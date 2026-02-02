'use client'

import { useState, useEffect } from 'react'
import { getAllProducts, Product } from '@/lib/products'
import ProductImage from './ProductImage'

interface ProductGridProps {
  onProductClick: (product: Product) => void
}

export default function ProductGrid({ onProductClick }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const fetchedProducts = await getAllProducts()
        setProducts(fetchedProducts)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getIcon = () => {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 18h20l-2-6H4l-2 6zM6 12V9a3 3 0 016 0v3"/>
        <path d="M8 12h8"/>
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Featured Products</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--bg-elevated)] rounded-xl p-4 animate-pulse">
              <div className="aspect-square bg-[var(--bg-elevated)] rounded-lg mb-4"></div>
              <div className="h-4 bg-[var(--bg-elevated)] rounded mb-2"></div>
              <div className="h-3 bg-[var(--bg-elevated)] rounded mb-3 w-2/3"></div>
              <div className="h-6 bg-[var(--bg-elevated)] rounded mb-3 w-1/3"></div>
              <div className="h-8 bg-[var(--bg-elevated)] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Featured Products</h3>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[var(--accent)] text-[#0A0A0A] px-4 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Featured Products</h3>
        <div className="text-center py-8">
          <p className="text-[var(--text-muted)]">No products available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Featured Products</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[var(--bg-secondary)] border border-[var(--bg-elevated)] rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_10px_20px_rgba(0,240,255,0.1)] group"
          >
            <div 
              onClick={() => onProductClick(product)}
              className="cursor-pointer"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(product))
                e.dataTransfer.effectAllowed = 'copy'
              }}
            >
              <div className="aspect-square bg-[var(--bg-elevated)] rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                <ProductImage 
                  productName={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  fallbackIcon={
                    <div className="text-[var(--accent)]">
                      {getIcon()}
                    </div>
                  }
                />
              </div>
              <h4 className="font-semibold mb-2 text-sm">{product.name}</h4>
              <p className="text-[var(--text-muted)] text-xs mb-2 line-clamp-2">{product.description}</p>
              <p className="text-[var(--accent)] font-bold mb-3">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}