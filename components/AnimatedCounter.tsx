'use client'

import { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
    value: number
    duration?: number
    suffix?: string
    prefix?: string
    decimals?: number
}

export default function AnimatedCounter({
    value,
    duration = 2000,
    suffix = '',
    prefix = '',
    decimals = 0
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const countRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.5 }
        )

        if (countRef.current) {
            observer.observe(countRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime: number | null = null
        const startValue = 0

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            // Easing function: easeOutExpo
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            const currentCount = startValue + (value - startValue) * easing
            setCount(currentCount)

            if (progress < 1) {
                window.requestAnimationFrame(animate)
            }
        }

        window.requestAnimationFrame(animate)
    }, [isVisible, value, duration])

    return (
        <span ref={countRef} className="tabular-nums">
            {prefix}{count.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}{suffix}
        </span>
    )
}
