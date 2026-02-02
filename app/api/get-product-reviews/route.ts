import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Orders database (where we get product info)
const ordersSupabase = createClient(
  'https://pwxwproyyiyqjezqkeoe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3eHdwcm95eWl5cWplenFrZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDc3NjksImV4cCI6MjA4NTE4Mzc2OX0.k99dnjnENt2biwEwsAl_I78g6-gZKG7NIGPDUh622_4'
)

// Reviews database (where we get approved reviews)
const reviewsSupabase = createClient(
  'https://exqdqnhqcockmqynpiew.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cWRxbmhxY29ja21xeW5waWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTQ3ODMsImV4cCI6MjA4NTEzMDc4M30.7hwhxFPUTyFPCqzrMJlJnOI8B7VbPXNT5kLPihlStRg'
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productName = searchParams.get('product_name')

    if (!productName) {
      return NextResponse.json({
        success: false,
        error: 'product_name is required'
      }, { status: 400 })
    }

    console.log('Fetching reviews for product:', productName)

    // 1. Get all approved reviews
    const { data: allReviews, error: reviewsError } = await reviewsSupabase
      .from('Approved')
      .select('*')
      .eq('Approval_status', 'approve')

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch reviews'
      }, { status: 500 })
    }

    if (!allReviews || allReviews.length === 0) {
      return NextResponse.json({
        success: true,
        reviews: [],
        statistics: {
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      })
    }

    // 2. For each review, get the order and check if it contains the product
    const productReviews = []

    for (const review of allReviews) {
      try {
        // Get order details
        const { data: orderData, error: orderError } = await ordersSupabase
          .from('orders')
          .select('items, customer_name')
          .eq('order_number', review.order_id)
          .single()

        if (orderError || !orderData) {
          console.log(`Order not found for review: ${review.order_id}`)
          continue
        }

        // Check if this order contains the product we're looking for
        const items = orderData.items as any[]
        const hasProduct = items.some(item => 
          item.product_name && item.product_name.toLowerCase() === productName.toLowerCase()
        )

        if (hasProduct) {
          productReviews.push({
            id: review.order_id,
            order_id: review.order_id,
            customer_name: orderData.customer_name || 'Anonymous',
            rating: review.rating,
            review_text: review.reviews,
            created_at: review.created_at,
            verified_purchase: true
          })
        }
      } catch (error) {
        console.error(`Error processing review ${review.order_id}:`, error)
        continue
      }
    }

    // 3. Calculate statistics
    const totalReviews = productReviews.length
    const averageRating = totalReviews > 0 
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0

    const ratingDistribution = {
      5: productReviews.filter(r => r.rating === 5).length,
      4: productReviews.filter(r => r.rating === 4).length,
      3: productReviews.filter(r => r.rating === 3).length,
      2: productReviews.filter(r => r.rating === 2).length,
      1: productReviews.filter(r => r.rating === 1).length,
    }

    console.log(`Found ${totalReviews} reviews for ${productName}`)

    return NextResponse.json({
      success: true,
      reviews: productReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      statistics: {
        total_reviews: totalReviews,
        average_rating: Math.round(averageRating * 10) / 10,
        rating_distribution: ratingDistribution
      }
    })

  } catch (error) {
    console.error('Get product reviews error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}