import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    
    console.log('Received payment data:', {
      ...paymentData,
      card: {
        ...paymentData.card,
        number: '****' + paymentData.card.number.slice(-4), // Log only last 4 digits
        cvc: '***' // Don't log CVC
      }
    })
    
    // Call n8n payment webhook
    const n8nPayload = {
      name: paymentData.name,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: paymentData.currency || 'usd',
      description: paymentData.description,
      card: {
        number: paymentData.card.number,
        exp_month: paymentData.card.exp_month,
        exp_year: paymentData.card.exp_year,
        cvc: paymentData.card.cvc
      },
      order_number: paymentData.order_number,
      chatId: `payment_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    
    console.log('Sending to n8n payment webhook')
    
    const n8nUrl = 'https://unaspirated-cristin-nonputrescent.ngrok-free.dev/webhook/process-payment'
    
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'X-API-Key': '34b7c482a7121b8ab2c970a8db5f3dd9d06f78530f00f4e979f4219fbe271c37'
      },
      body: JSON.stringify(n8nPayload)
    })

    console.log('N8N payment response status:', n8nResponse.status)

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('N8N payment error response:', errorText)
      
      // Handle specific error cases
      if (n8nResponse.status === 403) {
        return NextResponse.json({
          success: false,
          response: '❌ Payment processing is temporarily unavailable. Please try again later or contact support.',
          error: 'Payment webhook not accessible'
        })
      }
      
      throw new Error(`N8N payment error: ${n8nResponse.status} - ${errorText}`)
    }

    const result = await n8nResponse.json()
    console.log('N8N payment result:', result)
    
    return NextResponse.json({
      success: true,
      response: result.response || '✅ Payment processed successfully! Your order has been confirmed and you will receive a confirmation email shortly.'
    })
    
  } catch (error) {
    console.error('Payment API error:', error)
    
    // Provide user-friendly error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('403')) {
      return NextResponse.json({
        success: false,
        response: '❌ Payment processing is currently unavailable. Please try again later.',
        error: 'Payment service unavailable'
      }, { status: 200 }) // Return 200 so frontend shows the message
    }
    
    return NextResponse.json({
      success: false,
      response: '❌ There was an error processing your payment. Please check your card details and try again.',
      error: 'Payment processing failed'
    }, { status: 200 }) // Return 200 so frontend shows the message
  }
}