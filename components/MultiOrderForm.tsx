'use client'

import { useState } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
}

interface MultiOrderFormProps {
  items: CartItem[]
  onSubmit: (orderData: MultiOrderData) => void
  onCancel: () => void
}

interface MultiOrderData {
  items: CartItem[]
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  order_total: number
}

export default function MultiOrderForm({ items, onSubmit, onCancel }: MultiOrderFormProps) {
  const [formData, setFormData] = useState<MultiOrderData>({
    items: items,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    order_total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    {
      title: 'Your Information',
      fields: ['customer_name', 'customer_email', 'customer_phone']
    },
    {
      title: 'Shipping Address',
      fields: ['shipping_address']
    }
  ]

  const handleInputChange = (field: keyof MultiOrderData, value: string) => {
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
      if (field === 'customer_phone') return // Optional field
      
      const value = formData[field as keyof MultiOrderData]
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'This field is required'
      }
      
      // Email validation
      if (field === 'customer_email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value as string)) {
          newErrors[field] = 'Please enter a valid email address'
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

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData)
    }
  }

  const renderField = (field: string) => {
    const value = formData[field as keyof MultiOrderData]
    const error = errors[field]

    switch (field) {
      case 'shipping_address':
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Shipping Address</label>
            <textarea
              value={value as string}
              onChange={(e) => handleInputChange('shipping_address', e.target.value)}
              placeholder="Enter your full shipping address"
              rows={3}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)] resize-none"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      default:
        const fieldLabels: Record<string, string> = {
          customer_name: 'Full Name',
          customer_email: 'Email Address',
          customer_phone: 'Phone Number (Optional)'
        }

        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              {fieldLabels[field]}
            </label>
            <input
              type={field === 'customer_email' ? 'email' : field === 'customer_phone' ? 'tel' : 'text'}
              value={value as string}
              onChange={(e) => handleInputChange(field as keyof MultiOrderData, e.target.value)}
              placeholder={`Enter your ${fieldLabels[field].toLowerCase()}`}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )
    }
  }

  const currentStepData = steps[currentStep]
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-4 my-4 border border-[var(--accent)]/20">
      {/* Order Summary */}
      <div className="mb-4 pb-4 border-b border-[var(--bg-elevated)]">
        <h3 className="text-lg font-semibold text-white mb-2">📦 Multi-Item Order</h3>
        <div className="space-y-1 text-sm text-[var(--text-muted)]">
          {items.map((item, index) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-[var(--bg-elevated)]">
          <div className="flex justify-between text-[var(--accent)] font-semibold">
            <span>Total ({totalItems} items):</span>
            <span>${formData.order_total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep 
                ? 'bg-[var(--accent)] text-[#0A0A0A]' 
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                index < currentStep ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-white mb-4">{currentStepData.title}</h4>
        {currentStepData.fields.map(field => renderField(field))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 bg-[var(--bg-elevated)] text-white border border-[var(--bg-elevated)] rounded-lg py-2 px-4 hover:bg-[var(--bg-elevated)]/80 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 bg-[var(--accent)] text-[#0A0A0A] rounded-lg py-2 px-4 hover:scale-105 transition-transform font-medium"
        >
          {currentStep === steps.length - 1 ? 'Place Order' : 'Next'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}