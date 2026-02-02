'use client'

import { useState, useEffect } from 'react'
import { formatTime } from '@/lib/time'

interface Review {
  id: string
  order_id: string
  customer_name: string
  rating: number
  review_text: string
  created_at: string
  verified_purchase: boolean
}

interface ReviewStatistics {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsProps {
  productName: string
  className?: string
}

export default function ProductReviews({ productName, className = '' }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [productName])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/get-product-reviews?product_name=${encodeURIComponent(productName)}`)
      const data = await response.json()

      if (data.success) {
        setReviews(data.reviews)
        setStatistics(data.statistics)
      } else {
        setError(data.error || 'Failed to fetch reviews')
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    return (
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-3 text-gray-400">{rating}</span>
        <span className="text-yellow-400">★</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-xs text-gray-400">{count}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-red-400 text-sm">
          Error loading reviews: {error}
        </div>
      </div>
    )
  }

  if (!statistics || statistics.total_reviews === 0) {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Customer Reviews</h3>
        <div className="text-gray-400 text-sm">
          No reviews yet. Be the first to review this product!
        </div>
      </div>
    )
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Customer Reviews</h3>
      
      {/* Review Summary */}
      <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{statistics.average_rating}</div>
            {renderStars(Math.round(statistics.average_rating), 'lg')}
            <div className="text-sm text-gray-400 mt-1">
              {statistics.total_reviews} {statistics.total_reviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating}>
                {renderRatingBar(rating, statistics.rating_distribution[rating as keyof typeof statistics.rating_distribution], statistics.total_reviews)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-[#1A1A1A] rounded-lg p-4 border border-[#2A2A2A]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00E5FF] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                  {review.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">{review.customer_name}</div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating, 'sm')}
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {formatTime(new Date(review.created_at))}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {review.review_text}
            </p>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#00E5FF] hover:text-[#00B8D4] text-sm font-medium transition-colors"
          >
            {showAll ? `Show Less` : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  )
}