'use client'

import ProductImage from './ProductImage'

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
    <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#00E5FF] transition-all duration-300 my-2">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A1A]">
          <ProductImage
            productName={product.name}
            className="w-full h-full object-cover"
            fallbackIcon={
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src="/logo.svg" 
                  alt="Checkoutly Logo" 
                  width={32} 
                  height={32}
                  className="object-contain opacity-30"
                />
              </div>
            }
          />
        </div>
        
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{product.name}</h4>
          <p className="text-sm text-[#B0B0B0] line-clamp-2 mt-1">
            {product.description || 'Premium quality product with excellent features and design.'}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-mono font-bold text-[#00E5FF]">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => onViewDetails(product)}
                className="px-3 py-1.5 bg-[#1A1A1A] text-[#B0B0B0] text-sm rounded-lg border border-[#2A2A2A] hover:border-[#00E5FF] hover:text-white transition-all duration-300"
              >
                Details
              </button>
              <button 
                onClick={() => onAddToCart(product.name)}
                className="px-4 py-1.5 bg-[#00E5FF] text-black text-sm font-semibold rounded-lg hover:bg-[#00B8D4] transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}