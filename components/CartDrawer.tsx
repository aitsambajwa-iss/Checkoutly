'use client'

import { useState, useEffect } from 'react'
import ProductImage from './ProductImage'
import Price from './Price'

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
          bg-[var(--bg-tertiary)] border-l border-[var(--border-subtle)]
          transform transition-transform duration-400 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col shadow-2xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
          <h2 className="text-xl font-display font-medium text-[var(--text-primary)]">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">Your cart is currently empty</p>
              <button
                onClick={onClose}
                className="button-secondary px-6 py-2.5 rounded-lg"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4 rounded-xl">
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
                              className="object-contain opacity-40"
                            />
                          </div>
                        }
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-[var(--text-primary)] truncate">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {item.size && `${item.size}`}
                          {item.size && item.color && ' · '}
                          {item.color}
                        </p>
                      )}
                      <Price amount={item.price} size="sm" />
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#FFFFFF] hover:text-[#FFFFFF] rounded transition-all"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14" />
                        </svg>
                      </button>

                      <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>

                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--accent)] rounded transition-all"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-2 p-1 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
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
          <div className="border-t border-[var(--border-subtle)] p-6 bg-[var(--bg-secondary)]">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <Price amount={subtotal} size="sm" />
              </div>
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Tax</span>
                <Price amount={tax} size="sm" />
              </div>
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span className="font-mono text-[var(--text-primary)]">
                  {shipping === 0 ? <span className="text-[var(--success)]">Free</span> : <Price amount={shipping} size="sm" />}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-4 border-t border-[var(--border-subtle)] text-[var(--text-primary)]">
                <span className="text-base">Total</span>
                <Price amount={total} size="xl" />
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full button-primary py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </>
  )
}