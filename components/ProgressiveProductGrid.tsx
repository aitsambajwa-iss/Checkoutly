'use client'

import { useState, useEffect, useMemo, memo } from 'react'
import ProductImage from './ProductImage'
import { getAllProducts } from '@/lib/products'
import type { Product } from '@/lib/types'

interface ProgressiveProductGridProps {
  onProductClick: (product: Product) => void
  onProductDrag: (product: Product) => void
  className?: string
}

export default memo(function ProgressiveProductGrid({ 
  onProductClick, 
  onProductDrag,
  className = '' 
}: ProgressiveProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [draggedProduct, setDraggedProduct] = useState<string | null>(null)
  
  const PRODUCTS_PER_PAGE = 4
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const currentProducts = useMemo(() => 
    products.slice(
      currentPage * PRODUCTS_PER_PAGE, 
      (currentPage + 1) * PRODUCTS_PER_PAGE
    ), [products, currentPage, PRODUCTS_PER_PAGE]
  )

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const fetchedProducts = await getAllProducts()
        setProducts(fetchedProducts)
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    setDraggedProduct(product.id)
    e.dataTransfer.setData('application/json', JSON.stringify(product))
    e.dataTransfer.effectAllowed = 'copy'
    
    // Create custom drag ghost with preview
    const ghost = document.createElement('div')
    ghost.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1A1A1A, #0F0F0F);
        border: 2px solid #00E5FF;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 12px 48px rgba(0, 229, 255, 0.4);
        min-width: 200px;
      ">
        <div style="color: white; font-weight: 600; margin-bottom: 4px;">
          ${product.name}
        </div>
        <div style="color: #00E5FF; font-family: monospace; font-size: 18px;">
          $${product.price.toFixed(2)}
        </div>
      </div>
    `
    ghost.style.position = 'absolute'
    ghost.style.top = '-1000px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 100, 50)
    
    setTimeout(() => document.body.removeChild(ghost), 0)
    
    onProductDrag(product)
  }

  const handleDragEnd = () => {
    setDraggedProduct(null)
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 rounded-lg">
            <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
            <div className="skeleton h-6 w-3/4 mb-2 rounded"></div>
            <div className="skeleton h-4 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-4xl mb-4">⚠</div>
        <p className="text-[var(--text-secondary)] mb-4">Couldn&apos;t load products</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary px-4 py-2 rounded-lg"
        >
          Try again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-[var(--text-secondary)] mb-4">No products found</p>
        <p className="text-sm text-[var(--text-muted)]">
          Try: &quot;running shoes&quot; or &quot;under $100&quot;
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Product Grid - 2 Columns with Better Spacing */}
      <div className="grid grid-cols-2 gap-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            onDragEnd={handleDragEnd}
            onClick={() => onProductClick(product)}
            className={`
              product-card relative overflow-hidden
              bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]
              border border-[#2A2A2A] rounded-2xl p-5
              transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
              cursor-grab hover:cursor-grab active:cursor-grabbing
              hover:transform hover:-translate-y-1 hover:border-[#00E5FF] 
              hover:shadow-[0_8px_32px_rgba(0,229,255,0.15)]
              ${draggedProduct === product.id ? 'dragging opacity-50 scale-95 border-[#00E5FF] shadow-[0_0_0_4px_rgba(0,229,255,0.2)]' : ''}
              before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
              before:bg-gradient-to-r before:from-transparent before:via-[#00E5FF] before:to-transparent
              before:opacity-0 before:transition-opacity before:duration-300
              hover:before:opacity-100
            `}
          >
            {/* Product Image */}
            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
              <ProductImage
                productName={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                fallbackIcon={
                  <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src="/logo.svg" 
                      alt="Checkoutly Logo" 
                      width={64} 
                      height={64}
                      className="object-contain opacity-30 text-[#00E5FF]"
                    />
                  </div>
                }
              />
              
              {/* Featured badge if applicable */}
              {product.featured && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#00E5FF] text-black text-xs font-mono rounded">
                  FEATURED
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white leading-tight">
                {product.name}
              </h3>
              
              <p className="text-sm text-[#B0B0B0] line-clamp-2 min-h-[40px]">
                {product.description || 'Premium quality product with excellent features and design.'}
              </p>
              
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-2xl font-mono font-bold text-[#00E5FF]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-[#6B6B6B] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock indicator */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                In Stock
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Show More Button */}
          {currentPage < totalPages - 1 && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-6 py-2 text-sm font-medium text-[#00E5FF] border border-[#2A2A2A] rounded-lg hover:border-[#00E5FF] transition-all duration-300"
            >
              Show More Products
            </button>
          )}

          {/* Pagination Dots */}
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index <= currentPage 
                    ? 'bg-[#00E5FF] w-6' 
                    : 'bg-[#2A2A2A] w-2'
                  }
                `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})