import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    console.log('Cart order received:', orderData)
    
    // Send to existing N8N place-order workflow
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.replace('/webhook/product-lookup', '/webhook/place-order')
    
    if (n8nWebhookUrl) {
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        })
        
        if (n8nResponse.ok) {
          const result = await n8nResponse.text()
          console.log('N8N order response:', result)
          
          // Try to parse N8N response
          try {
            const jsonResult = JSON.parse(result)
            return NextResponse.json({
              success: true,
              response: jsonResult.response || result,
              ...jsonResult
            })
          } catch {
            return NextResponse.json({
              success: true,
              response: result
            })
          }
        } else {
          const errorText = await n8nResponse.text()
          console.error('N8N error:', errorText)
          throw new Error(`N8N returned ${n8nResponse.status}: ${errorText}`)
        }
      } catch (n8nError) {
        console.error('N8N order error:', n8nError)
        throw n8nError
      }
    } else {
      throw new Error('N8N webhook URL not configured')
    }
    
  } catch (error) {
    console.error('Cart order error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process order',
      message: 'Sorry, there was an error processing your order. Please try again.',
      response: '❌ Sorry, there was an error processing your order. Please try again or contact support.'
    }, { status: 500 })
  }
}