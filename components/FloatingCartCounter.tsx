'use client'

import { useState, useEffect } from 'react'

interface FloatingCartCounterProps {
  itemCount: number
  cartTotal: number
  onCartClick: () => void
  className?: string
}

export default function FloatingCartCounter({
  itemCount,
  cartTotal,
  onCartClick,
  className = ''
}: FloatingCartCounterProps) {
  const [justUpdated, setJustUpdated] = useState(false)

  // Trigger animation when cart updates
  useEffect(() => {
    if (itemCount > 0) {
      setJustUpdated(true)
      const timer = setTimeout(() => setJustUpdated(false), 400)
      return () => clearTimeout(timer)
    }
  }, [itemCount])

  if (itemCount === 0) return null

  return (
    <button
      onClick={onCartClick}
      className={`
        fixed top-6 right-8 z-50
        bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)]
        border border-[var(--border-subtle)] hover:border-[var(--accent)]
        text-[var(--text-primary)] hover:text-[var(--accent)]
        px-5 py-2.5 rounded-xl shadow-2xl
        flex items-center gap-3
        transition-all duration-300 ease-out
        backdrop-blur-md
        ${justUpdated ? 'animate-pulse-once scale-110' : ''}
        ${className}
      `}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="flex-shrink-0"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      <span className="text-sm font-medium whitespace-nowrap">
        {itemCount} item{itemCount !== 1 ? 's' : ''} ·
        <span className="price ml-1">${cartTotal.toFixed(2)}</span>
      </span>
    </button>
  )
}