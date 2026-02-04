'use client'

import ProductImage from './ProductImage'
import Price from './Price'

interface Product {
  id: string
  name: string
  price: number
  description?: string | null
  image_url?: string
}

interface InlineProductCardProps {
  product: Product
  onAddToCart: (productName: string) => void
  onViewDetails: (product: Product) => void
}

export default function InlineProductCard({
  product,
  onAddToCart,
  onViewDetails
}: InlineProductCardProps) {
  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--accent)] transition-all duration-300 my-2 group">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)]">
          <ProductImage
            productName={product.name}
            className="w-full h-full object-cover"
            fallbackIcon={
              <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                <img
                  src="/logo.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="object-contain opacity-20"
                />
              </div>
            }
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors truncate">
                {product.name}
              </h4>
              <p className="feature-description text-sm line-clamp-2">
                {product.description || 'Premium quality product with excellent features and design.'}
              </p>
            </div>
            <Price amount={product.price} size="lg" className="shrink-0" />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => onViewDetails(product)}
              className="px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-sm rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-white transition-all duration-300"
            >
              Details
            </button>
            <button
              onClick={() => onAddToCart(product.name)}
              className="px-4 py-1.5 bg-[var(--accent)] text-black text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}