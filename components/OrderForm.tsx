'use client'

import { useState } from 'react'

interface Product {
  name: string
  price: number
  sizes?: string[]
  colors?: string[]
  description?: string | null
}

interface OrderFormProps {
  product: Product
  cartItems?: Array<{
    id: string
    name: string
    price: number
    quantity: number
    sizes?: string[]
    colors?: string[]
    product_id?: string
  }>
  onSubmit: (orderData: OrderData) => void
  onCancel: () => void
}

interface OrderData {
  product_name: string
  size: string
  color: string
  quantity: number
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  // For multi-item orders
  items?: Array<{
    product_name: string
    size: string
    color: string
    quantity: number
  }>
}

export default function OrderForm({ product, cartItems, onSubmit, onCancel }: OrderFormProps) {
  const isMultiItem = cartItems && cartItems.length > 1
  
  const [formData, setFormData] = useState<OrderData>({
    product_name: product.name,
    size: '',
    color: '',
    quantity: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    items: isMultiItem ? cartItems.map(item => ({
      product_name: item.name,
      size: '',
      color: '',
      quantity: item.quantity
    })) : undefined
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  console.log('OrderForm - Product received:', product.name)
  console.log('OrderForm - Current step:', currentStep)
  
  const steps = isMultiItem ? [
    {
      title: 'Product Details',
      fields: ['items'] // Special field for multiple items
    },
    {
      title: 'Your Information',
      fields: ['customer_name', 'customer_email', 'customer_phone']
    },
    {
      title: 'Shipping Address',
      fields: ['shipping_address']
    }
  ] : [
    {
      title: 'Product Details',
      fields: ['size', 'color', 'quantity']
    },
    {
      title: 'Your Information',
      fields: ['customer_name', 'customer_email', 'customer_phone']
    },
    {
      title: 'Shipping Address',
      fields: ['shipping_address']
    }
  ]

  const handleInputChange = (field: keyof OrderData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleItemChange = (itemIndex: number, field: 'size' | 'color' | 'quantity', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.map((item, index) => 
        index === itemIndex ? { ...item, [field]: value } : item
      )
    }))
  }

  const validateStep = (stepIndex: number) => {
    const newErrors: Record<string, string> = {}
    const stepFields = steps[stepIndex].fields

    stepFields.forEach(field => {
      if (field === 'customer_phone') return // Optional field
      if (field === 'items' && isMultiItem) {
        // Validate each item has size and color
        formData.items?.forEach((item, index) => {
          if (!item.size) {
            newErrors[`item_${index}_size`] = `Size required for ${item.product_name}`
          }
          if (!item.color) {
            newErrors[`item_${index}_color`] = `Color required for ${item.product_name}`
          }
        })
        return
      }
      
      const value = formData[field as keyof OrderData]
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
    if (field === 'items' && isMultiItem) {
      return (
        <div key={field} className="space-y-6">
          {formData.items?.map((item, index) => (
            <div key={index} className="border border-[var(--bg-elevated)] rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">{item.product_name}</h4>
              
              {/* Size Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Size</label>
                <select
                  value={item.size}
                  onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="">Select size</option>
                  {/* Use actual sizes from the specific product */}
                  {(cartItems?.find(cartItem => cartItem.name === item.product_name)?.sizes || []).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors[`item_${index}_size`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`item_${index}_size`]}</p>
                )}
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Color</label>
                <select
                  value={item.color}
                  onChange={(e) => handleItemChange(index, 'color', e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="">Select color</option>
                  {/* Use actual colors from the specific product */}
                  {(cartItems?.find(cartItem => cartItem.name === item.product_name)?.colors || []).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                {errors[`item_${index}_color`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`item_${index}_color`]}</p>
                )}
              </div>

              {/* Quantity Display */}
              <div className="text-sm text-[var(--text-muted)]">
                Quantity: {item.quantity}
              </div>
            </div>
          ))}
        </div>
      )
    }

    const value = formData[field as keyof OrderData]
    const error = errors[field]

    switch (field) {
      case 'size':
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Size</label>
            <select
              value={value as string}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">Select size</option>
              {product.sizes?.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      case 'color':
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Color</label>
            <select
              value={value as string}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">Select color</option>
              {product.colors?.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )

      case 'quantity':
        return (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Quantity</label>
            <select
              value={value as number}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        )

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
              onChange={(e) => handleInputChange(field as keyof OrderData, e.target.value)}
              placeholder={`Enter your ${fieldLabels[field].toLowerCase()}`}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--accent)]"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )
    }
  }

  const currentStepData = steps[currentStep]
  const totalAmount = product.price * formData.quantity

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-4 my-4 border border-[var(--accent)]/20">
      {/* Product Summary */}
      <div className="mb-4 pb-4 border-b border-[var(--bg-elevated)]">
        <h3 className="text-lg font-semibold text-white mb-2">Order: {product.name}</h3>
        <p className="text-sm text-[var(--text-muted)]">{product.description}</p>
        <p className="text-[var(--accent)] font-semibold mt-2">
          ${product.price} × {formData.quantity} = ${totalAmount.toFixed(2)}
        </p>
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