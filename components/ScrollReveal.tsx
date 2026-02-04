'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
    children: ReactNode
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    delay?: number
    duration?: number
    threshold?: number
    className?: string
}

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 700,
    threshold = 0.2,
    className = ''
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Check for prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) {
            setIsVisible(true)
            return
        }

        // Performance check: Disable animations on mobile if needed, 
        // but standard fade-in is usually fine.

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    // Unobserve after animating once
                    if (ref.current) observer.unobserve(ref.current)
                }
            },
            { threshold }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [threshold])

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)'
        switch (direction) {
            case 'up': return 'translateY(48px)'
            case 'down': return 'translateY(-48px)'
            case 'left': return 'translateX(48px)'
            case 'right': return 'translateX(-48px)'
            default: return 'none'
        }
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
                transitionDelay: `${delay}ms`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    )
}
