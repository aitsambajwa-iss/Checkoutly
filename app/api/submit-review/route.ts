import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()
    
    console.log('Received review data:', {
      ...reviewData,
      customer_email: reviewData.customer_email ? '***@' + reviewData.customer_email.split('@')[1] : 'not provided'
    })
    
    // Call n8n review webhook
    const n8nPayload = {
      order_id: reviewData.order_id,
      review: reviewData.review,
      rating: reviewData.rating,
      customer_name: reviewData.customer_name,
      customer_email: reviewData.customer_email,
      chatId: `review_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    
    console.log('Sending to n8n review webhook')
    
    const n8nUrl = 'https://bot.csautomaition.com/n8n-second/webhook/submit-reviews'
    
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(n8nPayload)
    })

    console.log('N8N review response status:', n8nResponse.status)

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('N8N review error response:', errorText)
      
      // Handle specific error cases
      if (n8nResponse.status === 403) {
        return NextResponse.json({
          success: false,
          response: '❌ Review submission is temporarily unavailable. Please try again later.',
          error: 'Review webhook not accessible'
        })
      }
      
      throw new Error(`N8N review error: ${n8nResponse.status} - ${errorText}`)
    }

    const responseText = await n8nResponse.text()
    console.log('N8N review raw response:', responseText)
    
    let result
    try {
      result = responseText ? JSON.parse(responseText) : null
    } catch (parseError) {
      console.log('N8N review response is not JSON, treating as plain text:', responseText)
      result = null
    }
    
    console.log('N8N review parsed result:', result)
    
    // Handle different response scenarios
    let responseMessage = ''
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      // No response or empty array - order ID doesn't exist or payment not successful
      responseMessage = '❌ We couldn\'t verify your order. Please check your order ID and ensure your payment was successful before submitting a review.'
    } else {
      // Response received - check approval status
      const reviewData = result[0]
      const approvalStatus = reviewData.Approval_status
      
      if (approvalStatus === 'approve') {
        responseMessage = '✅ Thank you for your review! Your review has been approved and published. We appreciate your feedback!'
      } else if (approvalStatus === 'reject') {
        responseMessage = '❌ Your review could not be approved as it contains inappropriate content. Please revise your review and ensure it follows our community guidelines.'
      } else {
        // Fallback for any other status
        responseMessage = '📝 Your review has been submitted and is under review. We\'ll notify you once it\'s processed.'
      }
    }
    
    return NextResponse.json({
      success: true,
      response: responseMessage
    })
    
  } catch (error) {
    console.error('Review API error:', error)
    
    // Provide user-friendly error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('403')) {
      return NextResponse.json({
        success: false,
        response: '❌ Review submission is currently unavailable. Please try again later.',
        error: 'Review service unavailable'
      }, { status: 200 }) // Return 200 so frontend shows the message
    }
    
    return NextResponse.json({
      success: false,
      response: '❌ There was an error submitting your review. Please check your details and try again.',
      error: 'Review submission failed'
    }, { status: 200 }) // Return 200 so frontend shows the message
  }
}