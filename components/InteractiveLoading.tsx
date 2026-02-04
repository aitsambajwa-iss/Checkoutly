'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type LoadingState = 'search' | 'cart' | 'order' | 'view' | 'general'

interface InteractiveLoadingProps {
    state: LoadingState
}

const MESSAGES = {
    search: [
        'Searching catalog...',
        'Checking availability...',
        'Finding best matches...',
        'Curating selection...'
    ],
    cart: [
        'Updating cart...',
        'Syncing items...',
        'Checking stock...',
        'Preparing summary...'
    ],
    order: [
        'Processing order...',
        'Preparing secure checkout...',
        'Calculating totals...',
        'Verifying information...'
    ],
    view: [
        'Looking up details...',
        'Fetching specifications...',
        'Loading reviews...',
        'Checking options...'
    ],
    general: [
        'AI is thinking...',
        'Processing and analyzing...',
        'Crafting response...',
        'Polishing answer...'
    ]
}

const STEPS = {
    search: ['Scanning products', 'Filtering results', 'Preparing details'],
    cart: ['Checking items', 'Updating database', 'Finalizing cart'],
    order: ['Verifying items', 'Generating order ID', 'Securing form'],
    view: ['Extracting product info', 'Fetching reviews', 'Loading images'],
    general: ['Analyzing intent', 'Searching knowledge', 'Formatting']
}

export default function InteractiveLoading({ state }: InteractiveLoadingProps) {
    const messages = MESSAGES[state] || MESSAGES.general

    return (
        <div className="flex items-center gap-2.5 p-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FFFFFF] border-t-transparent animate-spin opacity-80" />
            <span className="text-[#FFFFFF] text-[11px] font-semibold uppercase tracking-[0.12em] opacity-90">
                {messages[0]}
            </span>
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex gap-1"
            >
                <span className="w-1 h-1 bg-[#FFFFFF] rounded-full opacity-50" />
                <span className="w-1 h-1 bg-[#FFFFFF] rounded-full opacity-50" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 h-1 bg-[#FFFFFF] rounded-full opacity-50" style={{ animationDelay: '0.4s' }} />
            </motion.span>
        </div>
    )
}
