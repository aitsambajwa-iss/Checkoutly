'use client'

import { useState } from 'react'
import { getProductImageUrls } from '@/lib/products'

interface ProductImageProps {
  productName: string
  className?: string
  fallbackIcon?: React.ReactNode
}

export default function ProductImage({ productName, className = '', fallbackIcon }: ProductImageProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [showFallback, setShowFallback] = useState(false)
  
  const imageUrls = getProductImageUrls(productName)
  const currentUrl = imageUrls[currentUrlIndex]

  const handleImageError = () => {
    // Try next image format
    if (currentUrlIndex < imageUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1)
    } else {
      // All formats failed, show fallback
      setShowFallback(true)
    }
  }

  if (showFallback) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallbackIcon}
      </div>
    )
  }

  return (
    <img 
      src={currentUrl}
      alt={productName}
      className={className}
      onError={handleImageError}
    />
  )
}