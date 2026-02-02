'use client'

import { useState } from 'react'

interface ReviewFormProps {
  onSubmit: (reviewData: ReviewData) => void
  onCancel: () => void
}

interface ReviewData {
  order_id: string
  review: string
  rating: number
  customer_name?: string
  customer_email?: string
}

export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewData>({
    order_id: '',
    review: '',
    rating: 5,
    customer_name: '',
    customer_email: ''
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    {
      title: 'Order Information',
      fields: ['order_id', 'customer_email']
    },
    {
      title: 'Your Review',
      fields: ['rating', 'review']
    },
    {
      title: 'Contact Details',
      fields: ['customer_name']
    }
  ]

  const handleInputChange = (field: keyof ReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (stepIndex: number) => {
    const newErrors: Record<string, string> = {}
    const stepFields = steps[stepIndex].fields

    stepFields.forEach(field => {
      const value = formData[field as keyof ReviewData]
      
      if (field === 'order_id') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field] = 'Order ID is required'
        } else if (typeof value === 'string' && !value.toUpperCase().startsWith('ORD-')) {
          newErrors[field] = 'Please enter a valid order ID (e.g., ORD-1234567890-ABC123)'
        }
      } else if (field === 'customer_email') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field] = 'Email is required to verify your purchase'
        } else if (typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            newErrors[field] = 'Please enter a valid email address'
          }
        }
      } else if (field === 'review') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field] = 'Please write your review'
        } else if (typeof value === 'string' && value.trim().length < 10) {
          newErrors[field] = 'Review must be at least 10 characters long'
        }
      } else if (field === 'rating') {
        if (typeof value === 'number' && (value < 1 || value > 5)) {
          newErrors[field] = 'Rating must be between 1 and 5 stars'
        }
      } else if (field === 'customer_name') {
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field] = 'Name is required'
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true)
      try {
        onSubmit(formData)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderStarRating = () => {
    return (
      <div className="mb-3">
        <label className="block text-xs font-medium text-white mb-1">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => handleInputChange('rating', star)}
              className={`text-xl transition-colors ${
                star <= formData.rating 
                  ? 'text-yellow-400 hover:text-yellow-300' 
                  : 'text-gray-600 hover:text-gray-500'
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-xs text-[var(--text-muted)]">
            {formData.rating} out of 5 stars
          </span>
        </div>
        {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
      </div>
    )
  }

  const renderField = (field: string) => {
    const value = formData[field as keyof ReviewData]
    const error = errors[field]

    switch (field) {
      case 'order_id':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-white mb-1">Order ID</label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleInputChange('order_id', e.target.value.toUpperCase())}
              placeholder="ORD-1234567890-ABC123"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-[var(--accent)] font-mono text-sm"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Enter the order ID from your order confirmation
            </p>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      case 'customer_email':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-white mb-1">Email Address</label>
            <input
              type="email"
              value={value as string}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-[var(--accent)] text-sm"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              We&apos;ll use this to verify your purchase
            </p>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      case 'rating':
        return <div key={field}>{renderStarRating()}</div>

      case 'review':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-white mb-1">Your Review</label>
            <textarea
              value={value as string}
              onChange={(e) => handleInputChange('review', e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              maxLength={500}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-[var(--accent)] resize-none text-sm"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-[var(--text-muted)]">
                Minimum 10 characters
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {(value as string).length}/500
              </p>
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      case 'customer_name':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-white mb-1">Your Name</label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-[var(--accent)] text-sm"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              This will be shown with your review
            </p>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-3 my-2 border border-[var(--accent)]/20 flex flex-col">
      {/* Review Header - Compact */}
      <div className="mb-3 pb-2 border-b border-[var(--bg-elevated)]">
        <h3 className="text-base font-semibold text-white mb-1">⭐ Leave a Review</h3>
        <p className="text-xs text-[var(--text-muted)]">
          Share your experience to help other customers
        </p>
      </div>

      {/* Progress Indicator - Compact */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              index <= currentStep 
                ? 'bg-[var(--accent)] text-[#0A0A0A]' 
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                index < currentStep ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div className="flex-1 mb-3">
        <h4 className="text-sm font-medium text-white mb-2">{currentStepData.title}</h4>
        {currentStepData.fields.map(field => renderField(field))}
      </div>

      {/* Buttons - Always visible at bottom */}
      <div className="flex gap-2 pt-2 border-t border-[var(--bg-elevated)]">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex-1 bg-[var(--bg-elevated)] text-white border border-[var(--bg-elevated)] rounded-lg py-2 px-3 hover:bg-[var(--bg-elevated)]/80 transition-colors disabled:opacity-50 text-sm"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex-1 bg-[var(--accent)] text-[#0A0A0A] rounded-lg py-2 px-3 hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:hover:scale-100 text-sm"
        >
          {isSubmitting ? 'Submitting...' : currentStep === steps.length - 1 ? 'Submit Review' : 'Next'}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-3 py-2 text-[var(--text-muted)] hover:text-white transition-colors disabled:opacity-50 text-sm"
        >
          Cancel
        </button>
      </div>

      {/* Info Notice - Compact */}
      <div className="mt-2 text-xs text-[var(--text-muted)] text-center">
        📝 Your review will be verified before being published
      </div>
    </div>
  )
}