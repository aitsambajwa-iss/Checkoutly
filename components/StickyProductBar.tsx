'use client'

import ProductImage from './ProductImage'

interface Product {
  id: string
  name: string
  price: number
  description?: string | null
  image_url?: string
}

interface StickyProductBarProps {
  product: Product | null
  onAddToCart: (productName: string) => void
  onClose: () => void
}

export default function StickyProductBar({ 
  product, 
  onAddToCart, 
  onClose 
}: StickyProductBarProps) {
  if (!product) return null

  return (
    <div className="sticky top-0 z-30 bg-[var(--bg-secondary)] border-b border-[var(--bg-elevated)] p-3 animate-slide-in-right">
      <div className="flex items-center gap-3">
        {/* Product Image Thumbnail */}
        <div className="w-10 h-10 bg-[var(--bg-elevated)] rounded-lg overflow-hidden flex-shrink-0">
          <ProductImage
            productName={product.name}
            className="w-full h-full object-cover"
            fallbackIcon={
              <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] overflow-hidden">
                <img 
                  src="/logo.svg" 
                  alt="Checkoutly Logo" 
                  width={16} 
                  height={16}
                  className="object-contain opacity-50"
                />
              </div>
            }
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <p className="price text-sm text-[var(--accent)]">${product.price.toFixed(2)}</p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product.name)}
          className="btn-primary px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
        >
          Add
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-[var(--bg-elevated)] rounded-lg transition-colors flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}