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

interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
  onCancel: () => void
}

export default function ShoppingCart({ items, onUpdateQuantity, onRemoveItem, onCheckout, onCancel }: ShoppingCartProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-4 my-4 border border-[var(--accent)]/20">
      {/* Cart Header */}
      <div className="mb-4 pb-4 border-b border-[var(--bg-elevated)]">
        <h3 className="text-lg font-semibold text-white mb-2">🛒 Shopping Cart</h3>
        <p className="text-sm text-[var(--text-muted)]">
          {totalItems} item{totalItems !== 1 ? 's' : ''} • Total: ${totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="bg-[var(--bg-secondary)] rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="text-white font-medium">{item.name}</h4>
                <p className="text-sm text-[var(--text-muted)]">
                  ${item.price.toFixed(2)} each
                  {item.size && ` • Size: ${item.size}`}
                  {item.color && ` • Color: ${item.color}`}
                </p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-400 hover:text-red-300 ml-2"
                title="Remove item"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 bg-[var(--bg-elevated)] text-white rounded hover:bg-[var(--accent)] hover:text-[#0A0A0A] transition-colors"
                >
                  −
                </button>
                <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-[var(--bg-elevated)] text-white rounded hover:bg-[var(--accent)] hover:text-[#0A0A0A] transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-white font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center text-lg font-semibold text-white">
          <span>Total ({totalItems} items):</span>
          <span className="text-[var(--accent)]">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCheckout}
          className="flex-1 bg-[var(--accent)] text-[#0A0A0A] rounded-lg py-3 px-4 hover:scale-105 transition-transform font-medium"
        >
          Proceed to Checkout
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-3 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      {/* Info Notice */}
      <div className="mt-3 text-xs text-[var(--text-muted)] text-center">
        💡 You can add more items by continuing to chat
      </div>
    </div>
  )
}