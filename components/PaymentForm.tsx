'use client'

import { useState, useEffect } from 'react'
import { getCurrentYear } from '@/lib/time'

interface PaymentFormProps {
  orderData: {
    customer_name: string
    customer_email: string
    order_total?: number
    total?: number
    order_number: string
    product_name: string
  }
  onSubmit: (paymentData: PaymentData) => void
  onCancel: () => void
}

interface PaymentData {
  name: string
  email: string
  amount: number
  currency: string
  description: string
  card: {
    number: string
    exp_month: number
    exp_year: number
    cvc: string
  }
  order_number: string
}

export default function PaymentForm({ orderData, onSubmit, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    name: orderData.customer_name,
    email: orderData.customer_email,
    amount: orderData.order_total || orderData.total || 0,
    currency: 'usd',
    description: `Payment for ${orderData.product_name} - Order ${orderData.order_number}`,
    card: {
      number: '',
      exp_month: 1,
      exp_year: 2025, // Will be updated in useEffect
      cvc: ''
    },
    order_number: orderData.order_number
  })

  // Update year after hydration to avoid mismatch
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      card: {
        ...prev.card,
        exp_year: getCurrentYear() + 1
      }
    }))
  }, [])

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    {
      title: 'Payment Information',
      fields: ['card.number', 'card.exp_month', 'card.exp_year', 'card.cvc']
    },
    {
      title: 'Confirm Payment',
      fields: ['name', 'email']
    }
  ]

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('card.')) {
      const cardField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        card: { ...prev.card, [cardField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    return /^\d{16}$/.test(cleaned)
  }

  const validateCVC = (cvc: string) => {
    return /^\d{3,4}$/.test(cvc)
  }

  const validateStep = (stepIndex: number) => {
    const newErrors: Record<string, string> = {}
    const stepFields = steps[stepIndex].fields

    stepFields.forEach(field => {
      if (field === 'card.number') {
        if (!formData.card.number || !validateCardNumber(formData.card.number)) {
          newErrors[field] = 'Please enter a valid 16-digit card number'
        }
      } else if (field === 'card.cvc') {
        if (!formData.card.cvc || !validateCVC(formData.card.cvc)) {
          newErrors[field] = 'Please enter a valid 3-4 digit CVC'
        }
      } else if (field === 'card.exp_month') {
        if (formData.card.exp_month < 1 || formData.card.exp_month > 12) {
          newErrors[field] = 'Please select a valid month'
        }
      } else if (field === 'card.exp_year') {
        if (formData.card.exp_year < getCurrentYear()) {
          newErrors[field] = 'Card cannot be expired'
        }
      } else if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          newErrors[field] = 'Please enter a valid email address'
        }
      } else if (field === 'name') {
        if (!formData.name.trim()) {
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
      setIsProcessing(true)
      try {
        await onSubmit(formData)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim()
    return formatted.substring(0, 19) // Max 16 digits + 3 spaces
  }

  const renderField = (field: string) => {
    const error = errors[field]

    switch (field) {
      case 'card.number':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Card Number</label>
            <input
              type="text"
              value={formatCardNumber(formData.card.number)}
              onChange={(e) => handleInputChange('card.number', e.target.value.replace(/\s/g, ''))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono text-sm placeholder:text-[var(--text-muted)]"
            />
            {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
          </div>
        )

      case 'card.exp_month':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Month</label>
            <select
              value={formData.card.exp_month}
              onChange={(e) => handleInputChange('card.exp_month', parseInt(e.target.value))}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] text-sm appearance-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month} className="bg-[var(--bg-elevated)]">
                  {month.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
          </div>
        )

      case 'card.exp_year':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Year</label>
            <select
              value={formData.card.exp_year}
              onChange={(e) => handleInputChange('card.exp_year', parseInt(e.target.value))}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] text-sm appearance-none"
            >
              {Array.from({ length: 10 }, (_, i) => getCurrentYear() + i).map(year => (
                <option key={year} value={year} className="bg-[var(--bg-elevated)]">{year}</option>
              ))}
            </select>
            {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
          </div>
        )

      case 'card.cvc':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">CVC</label>
            <input
              type="text"
              value={formData.card.cvc}
              onChange={(e) => handleInputChange('card.cvc', e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              maxLength={4}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono text-sm placeholder:text-[var(--text-muted)]"
            />
            {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
          </div>
        )

      case 'name':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Cardholder Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] text-sm placeholder:text-[var(--text-muted)]"
            />
            {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
          </div>
        )

      case 'email':
        return (
          <div key={field} className="mb-3">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-2 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] text-sm placeholder:text-[var(--text-muted)]"
            />
            {error && <p className="text-[var(--error)] text-xs mt-1">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-3 my-2 border border-[var(--accent)]/20 flex flex-col">
      {/* Payment Summary - Compact */}
      <div className="mb-3 pb-2 border-b border-[var(--bg-elevated)]">
        <h3 className="text-base font-display font-medium text-white mb-1">💳 Payment Details</h3>
        <p className="text-xs text-[var(--text-muted)]">Order: {orderData.order_number}</p>
        <p className="text-[var(--accent)] font-semibold mt-1 text-sm">
          Total: ${(orderData.order_total || orderData.total || 0).toFixed(2)}
        </p>
      </div>

      {/* Progress Indicator - Compact */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${index <= currentStep
              ? 'bg-[var(--accent)] text-[#0A0A0A]'
              : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
              }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${index < currentStep ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
                }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div className="flex-1 mb-3">
        <h4 className="text-sm font-display font-medium text-white mb-2">{currentStepData.title}</h4>

        {currentStep === 0 && (
          <div className="space-y-3">
            {renderField('card.number')}
            <div className="grid grid-cols-2 gap-2">
              <div>{renderField('card.exp_month')}</div>
              <div>{renderField('card.exp_year')}</div>
            </div>
            {renderField('card.cvc')}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-3">
            {renderField('name')}
            {renderField('email')}
            <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mt-3">
              <h5 className="text-white font-medium mb-2 text-sm">Payment Summary</h5>
              <div className="text-xs text-[var(--text-muted)] space-y-1">
                <div className="flex justify-between">
                  <span>Order:</span>
                  <span>{orderData.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${(orderData.order_total || orderData.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Card:</span>
                  <span>****{formData.card.number.slice(-4)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons - Always visible at bottom */}
      <div className="flex gap-2 pt-2 border-t border-[var(--bg-elevated)]">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            disabled={isProcessing}
            className="flex-1 bg-[var(--bg-elevated)] text-white border border-[var(--bg-elevated)] rounded-lg py-2 px-3 hover:bg-[var(--bg-elevated)]/80 transition-colors disabled:opacity-50 text-sm"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isProcessing}
          className="flex-1 bg-[var(--accent)] text-[#0A0A0A] rounded-lg py-2 px-3 hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:hover:scale-100 text-sm"
        >
          {isProcessing ? 'Processing...' : currentStep === steps.length - 1 ? 'Pay Now' : 'Next'}
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="px-3 py-2 text-[var(--text-muted)] hover:text-white transition-colors disabled:opacity-50 text-sm"
        >
          Cancel
        </button>
      </div>

      {/* Security Notice - Compact */}
      <div className="mt-2 text-xs text-[var(--text-muted)] text-center">
        🔒 Your payment information is encrypted and secure
      </div>
    </div>
  )
}