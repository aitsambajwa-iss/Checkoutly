'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * A performance-optimized hook to track scroll progress within a range.
 * Returns a value between 0 and 1.
 * 
 * @param range - The pixel range to track (default: 0 to 100)
 */
export function useScrollProgress(range: number = 100) {
    const [progress, setProgress] = useState(0)

    const handleScroll = useCallback(() => {
        const currentScroll = window.scrollY
        const newProgress = Math.min(1, Math.max(0, currentScroll / range))

        // Use requestAnimationFrame to ensure smooth 60fps updates
        window.requestAnimationFrame(() => {
            setProgress(newProgress)
        })
    }, [range])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        // Initial check
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return progress
}
