import { getSessionId } from './utils'

export async function sendToCloudflareWorker(message: string): Promise<string> {
  const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
  const N8N_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  
  // If no worker URL is configured, use direct n8n as last resort
  if (!WORKER_URL || WORKER_URL.includes('your-worker') || WORKER_URL.includes('placeholder')) {
    console.log('Worker URL not configured, falling back to N8N directly');
    if (!N8N_URL) {
      throw new Error('No n8n webhook URL configured');
    }
    return sendToN8n(N8N_URL, message);
  }
  
  const sessionId = getSessionId();
  const cleanWorkerUrl = WORKER_URL.replace(/\/+$/, '');
  const chatEndpoint = `${cleanWorkerUrl}/chat`;

  console.log('Sending ALL messages to Cloudflare Worker:', chatEndpoint);

  // Try multiple strategies to overcome QUIC protocol issues
  const strategies = [
    // Strategy 1: Standard fetch
    { name: 'standard', options: { headers: {} } },
    // Strategy 2: Disable keepalive and force connection close
    { name: 'no-keepalive', options: { 
      keepalive: false,
      headers: { 
        'Connection': 'close',
        'Cache-Control': 'no-cache'
      } 
    }},
    // Strategy 3: Try with different user agent to avoid QUIC
    { name: 'alt-headers', options: { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Checkoutly/1.0)',
        'Accept': 'application/json',
        'Cache-Control': 'no-store'
      } 
    }},
    // Strategy 4: Minimal headers
    { name: 'minimal', options: { 
      headers: {} 
    }}
  ];

  for (const strategy of strategies) {
    try {
      console.log(`Trying ${strategy.name} strategy...`);
      
      const requestBody = {
        message: message,
        chatInput: message,
        timestamp: new Date().toISOString(),
        sessionId: sessionId
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const baseHeaders = {
        'Content-Type': 'application/json',
        'X-Chat-ID': sessionId,
      };
      
      // Filter out undefined values from strategy headers
      const strategyHeaders = strategy.options.headers || {};
      const cleanHeaders = Object.fromEntries(
        Object.entries(strategyHeaders).filter(([_, value]) => value !== undefined)
      );
      
      const mergedHeaders = { ...baseHeaders, ...cleanHeaders };

      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: mergedHeaders,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      };

      if (strategy.options.keepalive !== undefined) {
        fetchOptions.keepalive = strategy.options.keepalive;
      }

      const response = await fetch(chatEndpoint, fetchOptions);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`${strategy.name} HTTP error:`, response.status, errorText);
        continue; // Try next strategy
      }

      const data = await response.json();
      console.log(`${strategy.name} strategy SUCCESS:`, data);
      
      if (data.error) {
        console.error(`${strategy.name} returned error:`, data.error);
        continue; // Try next strategy
      }
      
      return data.response || data.message || 'No response received';
      
    } catch (error) {
      console.error(`${strategy.name} strategy failed:`, (error as Error).message);
      
      // If this is the last strategy, fall back to N8N only for product questions
      if (strategy === strategies[strategies.length - 1]) {
        console.log('All Cloudflare strategies failed');
        
        // Only fall back to N8N for product questions
        const productKeywords = ['product', 'available', 'have', 'sell', 'show', 'see', 'what', 'tell', 'about', 'buy', 'price', 'cost', 'shopping', 'shop', 'browse'];
        const isProductQuestion = productKeywords.some(keyword => message.toLowerCase().includes(keyword));
        
        if (isProductQuestion && N8N_URL) {
          console.log('Product question detected, falling back to N8N...');
          try {
            return await sendToN8n(N8N_URL, message);
          } catch (fallbackError) {
            console.error('N8N fallback failed:', fallbackError);
            return 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.';
          }
        } else {
          // For non-product questions, return a generic response since we can't reach the AI
          return 'Hey there! I\'m your shopping assistant. I can help you find products, check prices, and answer questions about our items. What are you looking for today?';
        }
      }
      
      continue; // Try next strategy
    }
  }
  
  // This shouldn't be reached, but just in case
  return 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.';
}

// Keep the existing n8n function as fallback
export async function sendToN8n(webhookUrl: string, message: string): Promise<string> {
  if (!webhookUrl || !webhookUrl.startsWith('https://')) {
    throw new Error('Invalid webhook URL')
  }

  const sessionId = getSessionId()

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message,
        message: message,
        timestamp: new Date().toISOString(),
        sessionId: sessionId
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseText = await response.text()
    console.log('Raw n8n response:', responseText)
    
    // Handle streaming JSON responses from n8n
    const jsonLines = responseText.trim().split('\n').filter(line => line.trim())
    let finalResponse = ''
    
    for (const line of jsonLines) {
      try {
        const data = JSON.parse(line.trim())
        
        if (data.type === 'error') {
          throw new Error(data.content || 'Unknown error')
        } else if (data.type === 'message' || data.type === 'text') {
          finalResponse += data.content || data.text || ''
        } else if (data.type === 'end' || data.type === 'final') {
          if (data.content || data.text) {
            finalResponse += data.content || data.text
          }
        } else if (data.output) {
          finalResponse = data.output
        } else if (data.response) {
          finalResponse = data.response
        }
      } catch (jsonError) {
        console.warn('Failed to parse JSON line:', line, jsonError)
        if (line.trim() && !line.includes('{')) {
          finalResponse += line + ' '
        }
      }
    }
    
    return finalResponse.trim() || 'No response received from the AI. Please check your n8n workflow configuration.'
  } catch (error) {
    console.error('n8n Error:', error)
    throw error
  }
}