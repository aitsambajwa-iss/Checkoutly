'use client'

import { useState } from 'react'
import Price from './Price'

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
    <div className="bg-[var(--bg-tertiary)] border-2 border-[var(--accent)] rounded-xl p-4 flex flex-col shadow-2xl">
      {/* Progress Header - More Compact */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Step {step} of {totalSteps}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {step === 1 ? 'Product Details' : step === 2 ? 'Your Info' : 'Shipping'}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-[var(--accent)]' : 'bg-[var(--border-subtle)]'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: '400px' }}>
        {step === 1 && (
          <div className="space-y-4">
            {!isMultiItem ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A]">
                  <div className="text-sm font-display font-medium text-white">{product.name}</div>
                  <Price amount={product.price} size="md" className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#FFFFFF] focus:outline-none transition-all"
                    >
                      <option value="">Select Size</option>
                      {product.sizes?.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Color</label>
                    <select
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none transition-all"
                    >
                      <option value="">Select Color</option>
                      {product.colors?.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#FFFFFF] transition-all text-white"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14" /></svg>
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-white text-lg">{formData.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleInputChange('quantity', formData.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:border-[#00E5FF] transition-all text-white"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  Select options for each item in your cart ({cartItems?.length} items)
                </div>
                {formData.items?.map((item, index) => {
                  const productInCart = cartItems?.find(p => p.name === item.product_name);
                  return (
                    <div key={index} className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-display font-medium text-white">{item.product_name}</div>
                        <div className="text-xs text-white">
                          <Price amount={productInCart?.price || 0} size="sm" className="inline-flex" />
                          <span className="ml-1">x {item.quantity}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#6B6B6B] mb-1 block uppercase font-bold">Size</label>
                          <select
                            value={item.size}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[index].size = e.target.value;
                              setFormData(prev => ({ ...prev, items: newItems }));
                            }}
                            className="w-full px-2 py-1.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded text-white text-xs focus:border-[#FFFFFF] focus:outline-none"
                          >
                            <option value="">Select</option>
                            {productInCart?.sizes?.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6B6B6B] mb-1 block uppercase font-bold">Color</label>
                          <select
                            value={item.color}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[index].color = e.target.value;
                              setFormData(prev => ({ ...prev, items: newItems }));
                            }}
                            className="w-full px-2 py-1.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded text-white text-xs focus:border-[#FFFFFF] focus:outline-none"
                          >
                            <option value="">Select</option>
                            {productInCart?.colors?.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Full Name</label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#FFFFFF] focus:outline-none resize-none placeholder-[#333]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Email Address</label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#FFFFFF] focus:outline-none resize-none placeholder-[#333]"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Phone Number</label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#FFFFFF] focus:outline-none resize-none placeholder-[#333]"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#B0B0B0] mb-1.5 block uppercase tracking-wider font-display font-medium">Shipping Address</label>
              <textarea
                rows={3}
                value={formData.shipping_address}
                onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white text-sm focus:border-[#00E5FF] focus:outline-none resize-none placeholder-[#333]"
                placeholder="123 Main St&#10;Apt 4B&#10;New York, NY 10001"
              />
            </div>

            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <Price amount={calculateTotal()} size="sm" />
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--text-muted)]">Estimated Shipping</span>
                <Price amount={10} size="sm" />
              </div>
              <div className="border-t border-[var(--border-subtle)] my-2"></div>
              <div className="flex justify-between font-bold text-base">
                <span className="text-[var(--text-primary)]">Order Total</span>
                <Price amount={calculateTotal() + 10} size="md" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions - Always visible at bottom */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 px-4 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-white transition-all font-semibold text-sm"
          >
            Back
          </button>
        )}

        <button
          onClick={() => {
            // Validation for Step 1
            if (step === 1) {
              if (isMultiItem) {
                const incomplete = formData.items?.some(item => !item.size || !item.color);
                if (incomplete) {
                  alert("Please select size and color for all items.");
                  return;
                }
              } else {
                if (!formData.size || !formData.color) {
                  alert("Please select a size and color.");
                  return;
                }
              }
            } else if (step === 2) {
              if (!formData.customer_name || !formData.customer_email) {
                alert("Please provide your name and email.");
                return;
              }
            } else if (step === 3) {
              if (!formData.shipping_address) {
                alert("Please provide a shipping address.");
                return;
              }
            }

            step < 3 ? setStep(step + 1) : handleSubmit()
          }}
          className="flex-[2] px-4 py-2.5 bg-[var(--accent)] text-black rounded-lg hover:bg-[var(--accent-hover)] transform hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-sm shadow-[0_10px_30px_var(--accent-glow)]"
        >
          {step === 3 ? 'Complete Purchase' : 'Continue'}
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2.5 text-[var(--text-muted)] hover:text-white transition-all text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}