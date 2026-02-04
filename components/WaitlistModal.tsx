'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WaitlistModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        website: '',
        volume: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate submission
        setTimeout(() => {
            setSubmitted(true)
        }, 1000)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[var(--bg-tertiary)] border-2 border-[var(--accent)] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.1)]"
                    >
                        {!submitted ? (
                            <div className="p-8">
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699-2.7c-.91.246-1.875.37-2.871.37-1.42 0-2.775-.245-4.025-.694a15.228 15.228 0 016.906-6.905c.449 1.25.694 2.605.694 4.025 0 .996-.124 1.961-.37 2.871z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-display font-medium text-white text-center mb-2">
                                    Join the Waitlist
                                </h3>
                                <p className="text-sm text-[var(--text-muted)] text-center mb-6">
                                    We&apos;re onboarding businesses in batches. Get early access and exclusive setup support.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Business Email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    />

                                    <input
                                        type="url"
                                        placeholder="Your Website (optional)"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    />

                                    <select
                                        required
                                        value={formData.volume}
                                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-white focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    >
                                        <option value="">Monthly Order Volume</option>
                                        <option value="0-100">0-100 orders/month</option>
                                        <option value="100-500">100-500 orders/month</option>
                                        <option value="500-1000">500-1,000 orders/month</option>
                                        <option value="1000+">1,000+ orders/month</option>
                                    </select>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent-hover)] transition-all transform active:scale-95 shadow-[0_10px_30px_var(--accent-glow)] mt-4"
                                    >
                                        Join Waitlist
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center">
                                    <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>No credit card</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Setup support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center"
                                >
                                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </motion.div>
                                <h3 className="text-2xl font-display font-medium text-white mb-2">You&apos;re on the list!</h3>
                                <p className="text-[var(--text-muted)] mb-8">
                                    We&apos;ll reach out within 48 hours to set up your account and customize your chatbot.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-white rounded-lg hover:border-[var(--accent)] transition-all font-semibold"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
