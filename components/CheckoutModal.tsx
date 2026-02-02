'use client'

import { useState, useEffect } from 'react'
import ProductImage from './ProductImage'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image_url?: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onPlaceOrder: (orderData: any) => void
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setCurrentStep(0)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + tax + shipping

  const steps = [
    { title: 'Review Cart', icon: '🛒' },
    { title: 'Customer Info', icon: '👤' },
    { title: 'Confirm & Pay', icon: '💳' }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!customerInfo.name.trim()) newErrors.name = 'Name is required'
      if (!customerInfo.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Invalid email'
      if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required'
      if (!customerInfo.address.trim()) newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handlePlaceOrder = () => {
    if (validateStep(currentStep)) {
      const orderData = {
        items: cartItems,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        order_total: total
      }
      onPlaceOrder(orderData)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 z-50 modal-backdrop
          transition-opacity duration-300 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <div 
          className="bg-[var(--bg-primary)] border border-[var(--bg-elevated)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--bg-elevated)]">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Checkout</h2>
              
              {/* Progress Dots */}
              <div className="flex gap-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-200
                      ${index <= currentStep 
                        ? 'bg-[var(--accent)]' 
                        : 'bg-[var(--bg-elevated)]'
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Review Cart */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Review Your Items</h3>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="card p-4 rounded-lg">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-[var(--bg-elevated)] rounded-lg overflow-hidden flex-shrink-0">
                        <ProductImage
                          productName={item.name}
                          className="w-full h-full object-cover"
                          fallbackIcon={
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] overflow-hidden">
                              <img 
                                src="/logo.svg" 
                                alt="Checkoutly Logo" 
                                width={24} 
                                height={24}
                                className="object-contain opacity-50"
                              />
                            </div>
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {(item.size || item.color) && (
                          <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {item.size && `Size ${item.size}`}
                            {item.size && item.color && ' · '}
                            {item.color}
                          </p>
                        )}
                        <p className="price text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14"/>
                          </svg>
                        </button>
                        
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </button>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-2 p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="card p-4 rounded-lg mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="price">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span className="price">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="price">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-[var(--bg-elevated)]">
                      <span>Total</span>
                      <span className="price">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Customer Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className={`form-input w-full px-3 py-2 rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className={`form-input w-full px-3 py-2 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className={`form-input w-full px-3 py-2 rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shipping Address *</label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className={`form-input w-full px-3 py-2 rounded-lg h-24 resize-none ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="123 Main St, City, State 12345"
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Confirm & Pay */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Confirm Your Order</h3>
                
                {/* Order Summary */}
                <div className="card p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-[var(--bg-elevated)] pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="price">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="card p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Shipping Information</h4>
                  <div className="text-sm space-y-1">
                    <p>{customerInfo.name}</p>
                    <p>{customerInfo.email}</p>
                    <p>{customerInfo.phone}</p>
                    <p className="text-[var(--text-secondary)]">{customerInfo.address}</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-xs text-[var(--text-secondary)]">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--bg-elevated)] p-6 flex justify-between">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            )}

            <div className="flex-1"></div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className="btn-primary px-6 py-2 rounded-lg font-semibold"
              >
                Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}