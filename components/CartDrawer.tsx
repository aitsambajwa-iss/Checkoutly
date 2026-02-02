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

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 400)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
  const total = subtotal + tax + shipping

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 z-40 modal-backdrop
          transition-opacity duration-400 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full max-w-md z-50
          bg-[var(--bg-primary)] border-l border-[var(--bg-elevated)]
          transform transition-transform duration-400 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--bg-elevated)]">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-[var(--text-secondary)] mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="card p-4 rounded-lg">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 bg-[var(--bg-elevated)] rounded-lg overflow-hidden">
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

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {item.size && `Size ${item.size}`}
                          {item.size && item.color && ' · '}
                          {item.color}
                        </p>
                      )}
                      <p className="price text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
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
            </div>
          )}
        </div>

        {/* Footer with Totals and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-[var(--bg-elevated)] p-6">
            <div className="space-y-2 mb-4">
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

            <button
              onClick={onCheckout}
              className="w-full btn-primary py-3 rounded-lg font-semibold"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}