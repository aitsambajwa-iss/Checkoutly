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
  items?: Array<{
    product_name: string
    size: string
    color: string
    quantity: number
  }>
}

export default function OrderFormCompact({ product, cartItems, onSubmit, onCancel }: OrderFormProps) {
  const isMultiItem = cartItems && cartItems.length > 1
  const [step, setStep] = useState(1)
  const totalSteps = 3
  
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

  const handleInputChange = (field: keyof OrderData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const calculateTotal = () => {
    if (isMultiItem && cartItems) {
      return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
    return product.price * formData.quantity
  }

  return (
    <div className="bg-[#0F0F0F] border-2 border-[#00E5FF] rounded-xl p-4 flex flex-col">
      {/* Progress Header - More Compact */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#B0B0B0]">
            Step {step} of {totalSteps}
          </span>
          <span className="text-xs text-[#6B6B6B]">
            {step === 1 ? 'Product Details' : step === 2 ? 'Your Info' : 'Shipping'}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < step ? 'bg-[#00E5FF]' : 'bg-[#2A2A2A]'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Form Content */}
      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
              <div className="text-sm text-[#B0B0B0]">{product.name}</div>
              <div className="text-base font-mono text-[#00E5FF]">${product.price.toFixed(2)}</div>
            </div>
            
            {!isMultiItem && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-[#B0B0B0] mb-1 block">Size</label>
                    <select 
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                    >
                      <option value="">Select</option>
                      {product.sizes?.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-[#B0B0B0] mb-1 block">Color</label>
                    <select 
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                    >
                      <option value="">Select</option>
                      {product.colors?.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-[#B0B0B0] mb-1 block">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                      className="w-8 h-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#00E5FF] transition-all duration-300 text-sm"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-mono text-white text-sm">{formData.quantity}</span>
                    <button 
                      type="button"
                      onClick={() => handleInputChange('quantity', formData.quantity + 1)}
                      className="w-8 h-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#00E5FF] transition-all duration-300 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {isMultiItem && (
              <div className="text-sm text-[#B0B0B0]">
                Multi-item order with {cartItems?.length} products
              </div>
            )}
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#B0B0B0] mb-1 block">Full Name</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="text-xs text-[#B0B0B0] mb-1 block">Email</label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label className="text-xs text-[#B0B0B0] mb-1 block">Phone</label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#B0B0B0] mb-1 block">Shipping Address</label>
              <textarea
                rows={3}
                value={formData.shipping_address}
                onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                className="w-full px-2 py-1.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none resize-none"
                placeholder="123 Main St&#10;Apt 4B&#10;New York, NY 10001"
              />
            </div>
            
            <div className="p-2 bg-[#1A1A1A] rounded-lg">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#B0B0B0]">Subtotal</span>
                <span className="text-white">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#B0B0B0]">Shipping</span>
                <span className="text-white">$10.00</span>
              </div>
              <div className="border-t border-[#2A2A2A] my-1"></div>
              <div className="flex justify-between font-semibold text-sm">
                <span className="text-white">Total</span>
                <span className="text-[#00E5FF] font-mono">${(calculateTotal() + 10).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions - Always visible at bottom */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-[#2A2A2A]">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 px-3 py-2 bg-[#1A1A1A] text-white rounded-lg border border-[#2A2A2A] hover:border-[#00E5FF] transition-all duration-300 font-medium text-sm"
          >
            Back
          </button>
        )}
        
        <button
          onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
          className="flex-1 px-3 py-2 bg-[#00E5FF] text-black rounded-lg hover:bg-[#00B8D4] transition-all duration-300 font-semibold text-sm"
        >
          {step === 3 ? 'Place Order' : 'Continue'}
        </button>
        
        <button
          onClick={onCancel}
          className="px-3 py-2 text-[#6B6B6B] hover:text-white transition-all duration-300 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}