'use client'

import { useState } from 'react'

interface SimpleCartProps {
  onClose: () => void
  onOrderMultiple: (items: string[]) => void
}

export default function SimpleCart({ onClose, onOrderMultiple }: SimpleCartProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  
  const availableProducts = [
    { name: 'TrailMaster X', price: 149.99 },
    { name: 'AeroRun Pro', price: 129.99 },
    { name: 'UrbanWalk Classic', price: 119.99 }
  ]

  const toggleItem = (itemName: string) => {
    setSelectedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const handleOrder = () => {
    if (selectedItems.length > 0) {
      onOrderMultiple(selectedItems)
    }
  }

  const totalPrice = selectedItems.reduce((sum, itemName) => {
    const product = availableProducts.find(p => p.name === itemName)
    return sum + (product?.price || 0)
  }, 0)

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-4 my-4 border border-[var(--accent)]/20">
      <div className="mb-4 pb-4 border-b border-[var(--bg-elevated)]">
        <h3 className="text-lg font-semibold text-white mb-2">🛒 Quick Multi-Order</h3>
        <p className="text-sm text-[var(--text-muted)]">Select multiple products to order together</p>
      </div>

      <div className="space-y-3 mb-4">
        {availableProducts.map((product) => (
          <div key={product.name} className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg p-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(product.name)}
                onChange={() => toggleItem(product.name)}
                className="w-4 h-4 text-[var(--accent)] bg-[var(--bg-elevated)] border-[var(--bg-elevated)] rounded focus:ring-[var(--accent)]"
              />
              <div>
                <h4 className="text-white font-medium">{product.name}</h4>
                <p className="text-sm text-[var(--text-muted)]">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItems.length > 0 && (
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center text-white">
            <span>Selected: {selectedItems.length} items</span>
            <span className="text-[var(--accent)] font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleOrder}
          disabled={selectedItems.length === 0}
          className="flex-1 bg-[var(--accent)] text-[#0A0A0A] rounded-lg py-2 px-4 hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:hover:scale-100"
        >
          Order Selected Items
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}