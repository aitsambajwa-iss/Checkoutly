'use client'

import { useState, useEffect } from 'react'

interface TypewriterTextProps {
    text: string
    speed?: number
    onComplete?: () => void
}

export default function TypewriterText({ text, speed = 30, onComplete }: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        setDisplayedText('') // Important: reset on text change

        if (!text) return

        let currentIndex = 0
        let timeoutId: any

        const type = () => {
            if (currentIndex < text.length) {
                const char = text[currentIndex]
                if (char !== undefined) {
                    setDisplayedText(prev => prev + char)
                }
                currentIndex++
                timeoutId = setTimeout(type, speed)
            } else if (onComplete) {
                onComplete()
            }
        }

        type()
        return () => clearTimeout(timeoutId)
    }, [text, speed, onComplete])

    return (
        <span className="whitespace-pre-wrap leading-relaxed inline">
            {displayedText}
        </span>
    )
}
