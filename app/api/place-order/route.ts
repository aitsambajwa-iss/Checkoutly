import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Handle both single product orders and cart orders
    let n8nPayload
    
    if (orderData.order_type === 'multi_item' && orderData.items) {
      // Multi-item order - use the exact format that worked in CLI
      n8nPayload = {
        order_type: 'multi_item',
        items: orderData.items,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || '',
        shipping_address: orderData.shipping_address,
        item_count: orderData.item_count,
        chatId: orderData.chatId,
        timestamp: orderData.timestamp
      }
    } else {
      // Single item order - use existing format
      let cleanProductName = orderData.product_name
      
      // Remove common prefixes that might get included
      const prefixesToRemove = [
        'price of the ',
        'price of ',
        'the price of the ',
        'the price of ',
        'what is the price of the ',
        'what is the price of ',
        'whats the price of the ',
        'whats the price of ',
        'the '
      ]
      
      for (const prefix of prefixesToRemove) {
        if (cleanProductName.toLowerCase().startsWith(prefix)) {
          cleanProductName = cleanProductName.substring(prefix.length)
          break
        }
      }
      
      // Ensure proper product name format
      if (cleanProductName.toLowerCase().includes('trailmaster')) {
        cleanProductName = 'TrailMaster X'
      } else if (cleanProductName.toLowerCase().includes('aerorun')) {
        cleanProductName = 'AeroRun Pro'
      } else if (cleanProductName.toLowerCase().includes('urbanwalk')) {
        cleanProductName = 'UrbanWalk Classic'
      }
      
      console.log('Cleaned product name:', cleanProductName)
      
      n8nPayload = {
        product_name: cleanProductName,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || '',
        shipping_address: orderData.shipping_address,
        quantity: orderData.quantity || 1,
        size: orderData.size || '',
        color: orderData.color || '',
        chatId: orderData.chatId || `order_${Date.now()}`,
        timestamp: orderData.timestamp || new Date().toISOString()
      }
    }
    
    
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.replace('/product-lookup', '/place-order') || 'https://semiepically-interprotoplasmic-duane.ngrok-free.dev/webhook/place-order'
    
    const n8nResponse = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload)
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      throw new Error(`N8N error: ${n8nResponse.status} - ${errorText}`)
    }

    const responseText = await n8nResponse.text()
    
    let result
    try {
      result = responseText ? JSON.parse(responseText) : { response: 'Order placed successfully!' }
    } catch (parseError) {
      result = { response: responseText || 'Order placed successfully!' }
    }
    
    return NextResponse.json({
      success: true,
      response: result.response || 'Order placed successfully!',
      order: result
    })
    
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to place order', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}