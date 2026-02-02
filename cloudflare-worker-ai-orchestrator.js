// Cloudflare Worker - AI Orchestrator for Checkoutly
// Flow: User Message → Sanitize → AI (with n8n tools) → Response

export default {
  async fetch(request, env, ctx) {
    // Enhanced CORS handling
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Chat-ID, Accept, Cache-Control, User-Agent',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const response = await handleChatRequest(request, env);
        // Add CORS headers to the response
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      } catch (error) {
        console.error('Chat request error:', error);
        return new Response(JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    if (url.pathname === '/' || url.pathname === '') {
      return new Response('Checkoutly AI Chat Worker - Ready and Fixed', { 
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          ...corsHeaders
        }
      });
    }
    
    return new Response('Not Found', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders
      }
    });
  }
};

// Simple in-memory storage for last mentioned products per chat
const chatMemory = new Map();

async function handleChatRequest(request, env) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Chat-ID'
  };

  try {
    const body = await request.json();
    const { message, chatInput, sessionId } = body;
    const userMessage = message || chatInput || '';
    
    if (!userMessage.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const chatId = sessionId || generateChatId();
    const tokensApplied = [];
    
    // Step 1: Sanitize the message and store PII securely
    const sanitizedMessage = await sanitizeAndStore(userMessage, chatId, env, tokensApplied, 'user');
    
    // Step 2: Send sanitized message to AI with n8n tools
    const aiResponse = await getAIResponseWithTools(sanitizedMessage, chatId, env);
    
    // Step 3: Log the interaction for audit purposes
    await logToSupabase(env, 
      [{ role: 'user', content: userMessage }], 
      [{ role: 'user', content: sanitizedMessage }], 
      chatId, 
      tokensApplied
    );
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      chatId: chatId,
      tokensApplied: tokensApplied.length
    }), {
      status: 200,
      headers: corsHeaders
    });
    
  } catch (error) {
    console.error('Chat request error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function getAIResponseWithTools(message, chatId, env) {
  try {
    // Get last mentioned product for this chat
    const lastProduct = chatMemory.get(chatId) || '';
    
    // ALWAYS use AI with function calling - let AI decide when to call functions
    console.log('Using AI with function calling for message:', message);
    
    let systemPrompt = `You are a shopping assistant. You MUST ALWAYS call one of the available functions. NEVER return plain text.

AVAILABLE FUNCTIONS:
- product_lookup: for product questions
- add_to_cart: for adding products to cart  
- view_cart: for viewing cart contents

RULES:
- If user asks about a product → call product_lookup
- If user wants to add/buy something → call add_to_cart
- If user wants to see cart → call view_cart

For "Add it to my cart" → call add_to_cart with the last mentioned product name.

YOU MUST CALL A FUNCTION. DO NOT return text like "Call add_to_cart". ACTUALLY CALL THE FUNCTION.`;

    if (lastProduct) {
      systemPrompt += `\n\nLast mentioned product: "${lastProduct}". Use this for "add to cart" requests without specific product.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        functions: [
          {
            name: 'product_lookup',
            description: 'Search for products. Use "all" to browse all products, or specify exact product name for details.',
            parameters: {
              type: 'object',
              properties: {
                product_name: {
                  type: 'string',
                  description: 'Product name to search for. Use "all" for browsing all products, or exact product name like "TrailMaster X"'
                }
              },
              required: ['product_name']
            }
          },
          {
            name: 'add_to_cart',
            description: 'Add a specific product to the user\'s cart. Use when user shows ANY intent to purchase, buy, add, or get a product.',
            parameters: {
              type: 'object',
              properties: {
                product_name: {
                  type: 'string',
                  description: 'Exact product name to add to cart. If user says "add it", "I want it", etc. without specifying product name, use the LAST MENTIONED PRODUCT from the conversation context.'
                },
                quantity: {
                  type: 'number',
                  description: 'Quantity to add (default: 1)',
                  default: 1
                }
              },
              required: ['product_name']
            }
          },
          {
            name: 'view_cart',
            description: 'View current cart contents and total. Use when user asks about their cart.',
            parameters: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  description: 'Always use "view" to see cart contents'
                }
              },
              required: ['action']
            }
          },
          {
            name: 'place_cart_order',
            description: 'Place an order for all items currently in the cart.',
            parameters: {
              type: 'object',
              properties: {
                customer_info: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    address: { type: 'string' }
                  },
                  required: ['name', 'email', 'address']
                }
              },
              required: ['customer_info']
            }
          }
        ],
        function_call: 'auto', // Let AI decide when to call functions
        max_tokens: 300,
        temperature: 0.1 // Very low temperature for more consistent function calling
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message;
    
    console.log('AI Response:', JSON.stringify(aiMessage));
    console.log('Function call detected:', !!aiMessage.function_call);
    console.log('Message content:', aiMessage.content);
    
    // Check if AI decided to call a function
    if (aiMessage.function_call) {
      console.log('AI decided to call function:', aiMessage.function_call);
      const functionName = aiMessage.function_call.name;
      const functionArgs = JSON.parse(aiMessage.function_call.arguments);
      
      console.log(`Function: ${functionName}, Args:`, functionArgs);
      console.log(`Last product in memory for ${chatId}:`, chatMemory.get(chatId));
      
      // Store the product name for future context
      if (functionName === 'product_lookup' && functionArgs.product_name && functionArgs.product_name !== 'all') {
        console.log(`Storing product in memory: ${functionArgs.product_name} for chat ${chatId}`);
        chatMemory.set(chatId, functionArgs.product_name);
      } else if (functionName === 'add_to_cart' && functionArgs.product_name) {
        console.log(`Storing cart product in memory: ${functionArgs.product_name} for chat ${chatId}`);
        chatMemory.set(chatId, functionArgs.product_name);
      }
      
      console.log('Calling n8n tool:', functionName, 'with args:', functionArgs);
      
      // Call N8N to get the data
      const toolResult = await callN8nTool(functionName, functionArgs, chatId, env);
      
      console.log('N8N tool result:', toolResult);
      
      // Check if this is a client-side action that should be returned as JSON
      if (functionName === 'add_to_cart' || functionName === 'view_cart') {
        try {
          const actionData = JSON.parse(toolResult);
          if (actionData.action) {
            console.log('Returning client-side action directly:', actionData);
            return toolResult; // Return the JSON string directly for client-side processing
          }
        } catch (parseError) {
          console.log('Tool result is not JSON, proceeding with AI formatting');
        }
      }
      
      // Send the tool result BACK to AI for final formatting (for product_lookup and other functions)
      const finalResponse = await getAIFinalResponse(message, functionName, toolResult, env);
      return finalResponse;
    }
    
    console.log('AI chose not to call any functions, returning direct response');
    console.log('Direct response content:', aiMessage.content);
    // If AI didn't call a function, return its direct response
    return aiMessage.content || 'How can I help you today?';
    
  } catch (error) {
    console.error('AI API error:', error);
    return 'I\'m here to help with your shopping needs! How can I assist you today?';
  }
}

async function getAIFinalResponse(originalMessage, toolName, toolResult, env) {
  try {
    console.log('Getting AI final response for:', { originalMessage, toolName });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful shopping assistant. The user asked a question and you called a function to get data. Now provide a natural, conversational response using that data. Be friendly and helpful.'
          },
          {
            role: 'user',
            content: originalMessage
          },
          {
            role: 'assistant',
            content: `I called the ${toolName} function and got this data: ${toolResult}`
          },
          {
            role: 'user',
            content: 'Please provide a natural, friendly response based on that data.'
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.log('AI final response failed, returning raw tool result');
      return toolResult; // Fallback to raw tool result
    }

    const data = await response.json();
    const finalResponse = data.choices[0]?.message?.content;
    
    console.log('AI final response:', finalResponse);
    return finalResponse || toolResult;
    
  } catch (error) {
    console.error('AI final response error:', error);
    return toolResult; // Fallback to raw tool result
  }
}

function extractProductName(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific product names first
  if (lowerMessage.includes('trailmaster')) return 'TrailMaster X';
  if (lowerMessage.includes('aerorun')) return 'AeroRun Pro';  
  if (lowerMessage.includes('urbanwalk')) return 'UrbanWalk Classic';
  
  // For general shopping/product questions, return 'all' to browse all products
  // This matches your N8N workflow logic for browse_all = true
  const generalQuestions = [
    'what products', 'show products', 'available', 'what do you have', 
    'what\'s available', 'tell me about', 'all products', 'want to do shopping',
    'i want to shop', 'shopping', 'browse', 'what can i buy', 'what do you sell',
    'wanna do some shopping', 'yo wassup', 'wassup'
  ];
  
  // Check if any general question pattern matches
  if (generalQuestions.some(q => lowerMessage.includes(q))) {
    return 'all'; // This will trigger browse_all = true in your N8N workflow
  }
  
  // Default to 'all' for any product-related query
  return 'all';
}

async function callN8nTool(toolName, functionArgs, chatId, env) {
  console.log('callN8nTool called with:', { toolName, functionArgs, chatId });
  
  const toolUrls = {
    'product_lookup': `${env.N8N_BASE_URL}/webhook/product-lookup`,
    'add_to_cart': 'CLIENT_SIDE_ACTION', // Special marker for client-side actions
    'view_cart': 'CLIENT_SIDE_ACTION',
    'place_cart_order': `${env.N8N_BASE_URL}/webhook/place-order`, // Use existing order endpoint
    'order_status': `${env.N8N_BASE_URL}/webhook/order-status`,
    'process_return': `${env.N8N_BASE_URL}/webhook/process-return`,
    'process_payment': 'https://unaspirated-cristin-nonputrescent.ngrok-free.dev/webhook/process-payment',
    'submit_review': 'https://bot.csautomaition.com/n8n-second/webhook/submit-reviews',
    'get_customer_info': `${env.N8N_BASE_URL}/webhook/get-customer-info`
  };
  
  const webhookUrl = toolUrls[toolName];
  console.log('Webhook URL:', webhookUrl);
  
  if (!webhookUrl) {
    return `Error: Unknown tool ${toolName}`;
  }
  
  // Handle client-side actions
  if (webhookUrl === 'CLIENT_SIDE_ACTION') {
    if (toolName === 'add_to_cart') {
      let productName = functionArgs.product_name;
      
      // If AI passed "all" but we have a last mentioned product, use that instead
      if (productName === 'all') {
        const lastProduct = chatMemory.get(chatId);
        if (lastProduct && lastProduct !== 'all') {
          productName = lastProduct;
          console.log(`Using last mentioned product: ${productName}`);
        } else {
          return JSON.stringify({
            action: 'error',
            message: 'Please specify which product you\'d like to add to your cart.'
          });
        }
      }
      
      // Return a special response that the client will interpret
      // Note: We're not including size/color here - user will select during checkout
      return JSON.stringify({
        action: 'add_to_cart',
        product_name: productName,
        quantity: functionArgs.quantity || 1,
        // Don't include size/color - let user choose during checkout
        message: `✅ Added ${productName} to your cart! You can view your cart anytime by clicking the cart button.`
      });
    } else if (toolName === 'view_cart') {
      return JSON.stringify({
        action: 'view_cart',
        message: 'Opening your cart...'
      });
    }
  }
  
  try {
    let payload;
    
    // Handle different tool types with appropriate payloads
    if (toolName === 'product_lookup') {
      payload = {
        product_name: functionArgs.product_name || 'all',
        message: functionArgs.product_name || 'all',
        chatId: chatId,
        sessionId: chatId,
        timestamp: new Date().toISOString()
      };
    } else if (toolName === 'place_cart_order') {
      // Transform cart order to match existing N8N workflow format
      const customerInfo = functionArgs.customer_info;
      payload = {
        product_name: 'Multiple Items', // Will be handled by N8N
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone || '',
        shipping_address: customerInfo.address,
        quantity: 1, // N8N will calculate from items
        size: '',
        color: '',
        chatId: chatId,
        sessionId: chatId,
        timestamp: new Date().toISOString(),
        // Additional cart data
        cart_items: functionArgs.cart_items || [],
        order_type: 'cart_checkout'
      };
    } else {
      // Default payload structure for other tools
      payload = {
        ...functionArgs,
        chatId: chatId,
        sessionId: chatId,
        timestamp: new Date().toISOString()
      };
    }

    console.log('Sending payload to n8n:', JSON.stringify(payload));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Chat-ID': chatId,
        ...(toolName === 'process_payment' && {
          'X-API-Key': '34b7c482a7121b8ab2c970a8db5f3dd9d06f78530f00f4e979f4219fbe271c37'
        })
      },
      body: JSON.stringify(payload)
    });

    console.log('N8N response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('N8N error response:', errorText);
      return `Error: Tool ${toolName} returned status ${response.status} - ${errorText}`;
    }

    const result = await response.text();
    console.log('N8N raw result:', result);
    
    // Try to parse as JSON
    try {
      const jsonResult = JSON.parse(result);
      if (jsonResult.response) {
        return jsonResult.response;
      }
      return JSON.stringify(jsonResult);
    } catch (parseError) {
      // If it's not JSON, return the raw text
      if (result && result.trim()) {
        return result;
      }
      return `No response from ${toolName}`;
    }
    
  } catch (error) {
    console.log('N8N call error:', error);
    return `Network error calling ${toolName}: ${error.message}`;
  }
}

// Utility functions
function generateChatId() {
  return 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function convertWordsToDigits(text) {
  if (typeof text !== 'string') return text;
  
  let result = text.toLowerCase();
  
  // Handle "two thousand twenty X" year format
  result = result.replace(
    /\btwo\s+thousand\s+(twenty|thirty|forty|fifty)[\s-]*(one|two|three|four|five|six|seven|eight|nine)?\b/gi,
    (_, decade, unit) => {
      const decades = { 'twenty': '2', 'thirty': '3', 'forty': '4', 'fifty': '5' };
      const ones = { 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
                      'six': '6', 'seven': '7', 'eight': '8', 'nine': '9' };
      let year = '20' + decades[decade.toLowerCase()];
      year += unit ? ones[unit.toLowerCase()] : '0';
      return year;
    }
  );
  
  // Handle STT misinterpretations
  result = result.replace(/\b(or|for)\b(?=\s+(?:zero|oh|one|two|three|four|five|six|seven|eight|nine|o|\d))/gi, 'four');
  
  // Handle "double" and "triple"
  result = result.replace(/\bdouble\s+(zero|oh|one|two|three|four|five|six|seven|eight|nine|o|\d)/gi, '$1 $1');
  result = result.replace(/\btriple\s+(zero|oh|one|two|three|four|five|six|seven|eight|nine|o|\d)/gi, '$1 $1 $1');
  
  // Handle compound numbers
  const compounds = { 'twenty': '2', 'thirty': '3', 'forty': '4', 'fifty': '5',
                      'sixty': '6', 'seventy': '7', 'eighty': '8', 'ninety': '9' };
  const onesMap = { 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
                    'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'zero': '0', 'oh': '0' };
  
  for (const [tens, tensDigit] of Object.entries(compounds)) {
    for (const [unit, unitDigit] of Object.entries(onesMap)) {
      result = result.replace(new RegExp(`\\b${tens}[\\s-]*${unit}\\b`, 'gi'), tensDigit + unitDigit);
    }
  }
  
  // Single digit word replacements
  const wordToDigit = {
    'zero': '0', 'oh': '0', 'o': '0',
    'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
    'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
    'ten': '10', 'eleven': '11', 'twelve': '12'
  };
  
  for (const [word, digit] of Object.entries(wordToDigit)) {
    result = result.replace(new RegExp(`\\b${word}\\b`, 'gi'), digit);
  }
  
  return result;
}

function generateToken() {
  return 'tok_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

async function storeInSupabase(env, data) {
  try {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/secure_tokens`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      console.error('Supabase error:', await res.text());
    }
  } catch (error) {
    console.error('Supabase storage error:', error);
  }
}

async function sanitizeAndStore(text, callId, env, tokensApplied = [], messageRole = 'user') {
  if (typeof text !== 'string') return text;
  
  // Only tokenize user messages
  if (messageRole !== 'user') {
    return text;
  }
  
  // Skip if already contains tokens
  const tokenTypes = ['[CARD:', '[CVV:', '[EXPIRY:', '[NAME:', '[EMAIL:', '[MONTH:', '[YEAR:', '[PHONE:', '[ADDRESS:'];
  if (tokenTypes.some(t => text.includes(t))) {
    return text;
  }
  
  let result = text;
  const processedText = convertWordsToDigits(text);
  
  // === 1. CARD NUMBER DETECTION (Enhanced) ===
  const cardPattern = /(?:\d[\s-]*){15,16}\d?/g;
  const cardMatch = processedText.match(cardPattern);
  if (cardMatch) {
    const cleanCard = cardMatch[0].replace(/[\s-]/g, '');
    if (cleanCard.length >= 15 && cleanCard.length <= 16) {
      const token = generateToken();
      tokensApplied.push({ type: 'card', token });
      
      await storeInSupabase(env, {
        token,
        type: 'card_number',
        value: cleanCard,
        call_id: callId,
        created_at: new Date().toISOString()
      });
      
      return `[CARD:${token}]`;
    }
  }
  
  // === 2. PHONE NUMBER DETECTION (Enhanced) ===
  const phonePatterns = [
    /(?:\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g, // US format
    /(?:\+44[-.\s]?)?(?:\(?0\)?[-.\s]?)?([0-9]{4})[-.\s]?([0-9]{6})/g, // UK format
    /(?:\+92[-.\s]?)?0?([0-9]{10,11})/g, // Pakistani format (03354569322)
    /(?:\+\d{1,3}[-.\s]?)?(?:\(?0\)?[-.\s]?)?([0-9]{10,15})/g, // Generic international
    /(?:phone|number|contact)\s*:?\s*([0-9]{10,15})/gi // "phone number is 03354569322"
  ];
  
  for (const phonePattern of phonePatterns) {
    const phoneMatch = result.match(phonePattern);
    if (phoneMatch) {
      const phone = phoneMatch[0].trim();
      // Only tokenize if it looks like a real phone number
      if (phone.length >= 10) {
        const token = generateToken();
        tokensApplied.push({ type: 'phone', token });
        await storeInSupabase(env, { token, type: 'phone_number', value: phone, call_id: callId, created_at: new Date().toISOString() });
        result = result.replace(phone, `[PHONE:${token}]`);
        break;
      }
    }
  }
  
  // === 3. ADDRESS DETECTION (Enhanced) ===
  const addressPatterns = [
    /(?:address|live|located)\s*:?\s*(.+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|place|pl|pakistan|india|usa|uk|canada).+)/gi,
    /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)\b/gi,
    /\b\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/gi, // US format with state and zip
    /(?:street|st)\s+\d+[^.!?]*(?:pakistan|india|usa|uk|canada|city)/gi // "Street 3, ISS, Pakistan"
  ];
  
  for (const addressPattern of addressPatterns) {
    const addressMatch = result.match(addressPattern);
    if (addressMatch) {
      const address = addressMatch[0].trim();
      if (address.length > 8) { // Only tokenize substantial addresses
        const token = generateToken();
        tokensApplied.push({ type: 'address', token });
        await storeInSupabase(env, { token, type: 'address', value: address, call_id: callId, created_at: new Date().toISOString() });
        result = result.replace(address, `[ADDRESS:${token}]`);
        break;
      }
    }
  }
  
  // === 4. NAME DETECTION (Enhanced) ===
  const nameWithPrefixPattern = /(?:my\s+name\s+is|name\s+is|i'?m|i\s+am|this\s+is|it'?s|call\s+me|my\s+name)\s+([A-Za-z][A-Za-z'-]*(?:\s+[A-Za-z][A-Za-z'-]*)*)/i;
  const fullNamePattern = /^([A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+)*)\.?$/;
  
  const skipWords = new Set([
    'yes', 'no', 'the', 'a', 'an', 'is', 'it', 'and', 'or', 'yeah', 'okay', 'ok', 'sure', 
    'hi', 'hello', 'bye', 'thanks', 'thank', 'please', 'sorry', 'wait', 'waiting', 
    'good', 'great', 'nice', 'fine', 'looking', 'something', 'anything', 'nothing',
    'everything', 'someone', 'anyone', 'everyone', 'somewhere', 'anywhere', 'everywhere',
    'type', 'kind', 'sort', 'style', 'way', 'thing', 'stuff', 'item', 'product',
    'sneaker', 'shoe', 'shoes', 'sneakers', 'running', 'walking', 'casual'
  ]);
  
  let nameMatch = result.match(nameWithPrefixPattern);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    // Only tokenize if it's actually a name (not a common word)
    if (name.length >= 2 && !skipWords.has(name.toLowerCase()) && /^[A-Z][a-z]+$/.test(name)) {
      const token = generateToken();
      tokensApplied.push({ type: 'name', token });
      await storeInSupabase(env, { token, type: 'name', value: name, call_id: callId, created_at: new Date().toISOString() });
      return result.replace(nameMatch[0], nameMatch[0].replace(name, `[NAME:${token}]`));
    }
  }
  
  nameMatch = result.match(fullNamePattern);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    // Only tokenize proper names (capitalized, not common words)
    if (!skipWords.has(name.toLowerCase()) && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(name)) {
      const token = generateToken();
      tokensApplied.push({ type: 'name', token });
      await storeInSupabase(env, { token, type: 'name', value: name, call_id: callId, created_at: new Date().toISOString() });
      return `[NAME:${token}]`;
    }
  }
  
  // === 5. EMAIL DETECTION (Enhanced) ===
  const typedEmailPattern = /\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/gi;
  const spokenEmailPattern = /\b([A-Za-z0-9._%+-]+)\s+(?:at)\s+([A-Za-z0-9.-]+)\s+(?:dot)\s+([A-Za-z]{2,})\b/gi;
  const emailMentionPattern = /(?:my\s+email\s+is|email\s+is|contact\s+me\s+at)\s+([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi;
  
  // Check for explicit email mentions first
  let emailMatch = result.match(emailMentionPattern);
  if (emailMatch) {
    const email = emailMatch[0].match(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/)[1].toLowerCase();
    const token = generateToken();
    tokensApplied.push({ type: 'email', token });
    await storeInSupabase(env, { token, type: 'email', value: email, call_id: callId, created_at: new Date().toISOString() });
    return result.replace(emailMatch[0], emailMatch[0].replace(email, `[EMAIL:${token}]`));
  }
  
  // Check for regular email patterns
  emailMatch = result.match(typedEmailPattern);
  if (emailMatch) {
    const email = emailMatch[0].toLowerCase();
    const token = generateToken();
    tokensApplied.push({ type: 'email', token });
    await storeInSupabase(env, { token, type: 'email', value: email, call_id: callId, created_at: new Date().toISOString() });
    return result.replace(emailMatch[0], `[EMAIL:${token}]`);
  }
  
  // Check for spoken email patterns
  emailMatch = result.match(spokenEmailPattern);
  if (emailMatch) {
    const email = `${emailMatch[1]}@${emailMatch[2]}.${emailMatch[3]}`.toLowerCase();
    const token = generateToken();
    tokensApplied.push({ type: 'email', token });
    await storeInSupabase(env, { token, type: 'email', value: email, call_id: callId, created_at: new Date().toISOString() });
    return result.replace(emailMatch[0], `[EMAIL:${token}]`);
  }
  
  // === 6. CVV DETECTION (Enhanced) ===
  const cvvPatterns = [
    /(?:cvv|cvc|security\s+code)\s*:?\s*(\d{3,4})/gi,
    /(?:my\s+cvv|cvv\s+is)\s+(\d{3,4})/gi,
    /\bmy\s+cvv\s+(\d{3,4})\b/gi,
    /cvv\s+(\d{3,4})/gi, // Simple "cvv 456"
    /my\s+cvv\s+(\d{3,4})/gi, // "my cvv 456" without word boundaries
    /^(\d{3,4})$/ // Standalone 3-4 digits
  ];

  for (const cvvPattern of cvvPatterns) {
    const cvvMatch = result.match(cvvPattern);
    if (cvvMatch) {
      const cvv = cvvMatch[1] || cvvMatch[0];
      if (/^\d{3,4}$/.test(cvv)) {
        const token = generateToken();
        tokensApplied.push({ type: 'cvv', token });
        await storeInSupabase(env, { token, type: 'cvv', value: cvv, call_id: callId, created_at: new Date().toISOString() });
        return result.replace(cvvMatch[0], `[CVV:${token}]`);
      }
    }
  }
  
  // === 7. EXPIRY DATE DETECTION (New) ===
  const expiryPatterns = [
    /(?:exp|expiry|expires?)\s*:?\s*(\d{1,2}\/\d{2,4})/gi,
    /(?:exp|expiry|expires?)\s*:?\s*(\d{1,2}[-]\d{2,4})/gi,
    /\b(\d{1,2}\/\d{2,4})\b/g // Standalone MM/YY or MM/YYYY
  ];
  
  for (const expiryPattern of expiryPatterns) {
    const expiryMatch = result.match(expiryPattern);
    if (expiryMatch) {
      const expiry = expiryMatch[1] || expiryMatch[0];
      // Validate it looks like a real expiry date
      const parts = expiry.split(/[\/\-]/);
      if (parts.length === 2) {
        const month = parseInt(parts[0]);
        const year = parseInt(parts[1]);
        if (month >= 1 && month <= 12 && year >= 23) { // Valid month and reasonable year
          const token = generateToken();
          tokensApplied.push({ type: 'expiry', token });
          await storeInSupabase(env, { token, type: 'expiry_date', value: expiry, call_id: callId, created_at: new Date().toISOString() });
          return result.replace(expiryMatch[0], `[EXPIRY:${token}]`);
        }
      }
    }
  }
  
  return result;
}

async function logToSupabase(env, originalMessages, sanitizedMessages, callId, tokensApplied) {
  try {
    for (let i = 0; i < originalMessages.length; i++) {
      const original = originalMessages[i].content;
      const sanitized = sanitizedMessages[i].content;
      
      if (original !== sanitized) {
        await fetch(`${env.SUPABASE_URL}/rest/v1/llm_audit_logs`, {
          method: 'POST',
          headers: {
            'apikey': env.SUPABASE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            call_id: callId,
            message_role: originalMessages[i].role,
            original_content: original,
            sanitized_content: sanitized,
            tokens_applied: tokensApplied,
            timestamp: new Date().toISOString()
          })
        });
      }
    }
  } catch (error) {
    console.error('Audit log error:', error);
  }
}