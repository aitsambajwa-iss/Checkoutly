'use client'

import Link from 'next/link'
import { useState } from 'react'
import WaitlistModal from './WaitlistModal'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function Hero() {
  const scrollProgress = useScrollProgress(500) // Transition over 500px
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  // Calculate dynamic scale and opacity
  const heroScale = 1 - (scrollProgress * 0.1) // 100% -> 90%
  const heroOpacity = 1 - (scrollProgress * 0.5) // 100% -> 50%

  return (
    <section className="min-h-screen flex items-center relative z-[2]">
      <div className="max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-[3]">
          <h1 className="hero-headline mb-6 opacity-0 animate-fade-up font-display font-medium">
            <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>Commerce,</span><br />
            <span
              className="inline-block opacity-0 animate-fade-up text-[#FFFFFF]"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              Reimagined
            </span><br />
            <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>Through</span>{' '}
            <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>Chat</span>
          </h1>

          <p className="hero-subheadline mb-8 max-w-2xl opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            AI-powered chatbots that handle orders, payments, and reviews - all in one conversation.
            Transform your business with intelligent conversational commerce that feels natural.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="button-primary px-8 py-4 rounded-xl transition-all hover:-translate-y-1 hover:scale-105 relative overflow-hidden flex items-center justify-center font-display font-bold"
            >
              Start Free Trial
            </button>
            <a
              href="https://calendly.com/aitsambajwa-ai-innovativesoftwaresolution/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary px-8 py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.03)] flex items-center justify-center gap-2 font-display"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Your Free Demo & Setup Call
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 text-sm text-[var(--text-muted)] font-mono opacity-0 animate-fade-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-full"></div>
              <span>Secure Payment Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-full"></div>
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFFFFF] rounded-full"></div>
              <span>24/7 Automation</span>
            </div>
          </div>
        </div>

        <div className="relative z-[3]">
          <div
            className="bg-[var(--bg-tertiary)] rounded-2xl p-6 border border-[var(--border-subtle)] backdrop-blur-xl transition-all duration-300 hover:scale-105 opacity-0 animate-fade-up"
            style={{
              transform: `perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(${heroScale})`,
              opacity: heroOpacity,
              animationDelay: '1.2s',
              animationFillMode: 'forwards'
            }}
          >
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 bg-[#FF5F57] rounded-full"></div>
              <div className="w-3 h-3 bg-[#FFBD2E] rounded-full"></div>
              <div className="w-3 h-3 bg-[#28CA42] rounded-full"></div>
            </div>

            <div className="space-y-4">
              <div className="opacity-0 animate-slide-in-right" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                <div className="text-xs text-[var(--text-muted)] mb-1 font-mono">Customer • 2:34 PM</div>
                <div className="bg-[#FFFFFF] text-[#000000] rounded-xl p-3.5 max-w-[280px] ml-auto text-sm font-medium shadow-[0_8px_24px_rgba(255,255,255,0.08)]">
                  I&apos;d like to order the wireless headphones
                </div>
              </div>

              <div className="opacity-0 animate-slide-in-left" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/logo.svg"
                    alt="Checkoutly Logo"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <div className="text-xs text-[var(--text-muted)]">Checkoutly AI • 2:34 PM</div>
                </div>
                <div className="bg-[#1E1E1E] text-white border border-[#2A2A2A] rounded-xl p-3.5 max-w-[280px] text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  Perfect! I found Premium Wireless Headphones for $299. Would you like to proceed with the order?
                </div>
              </div>

              <div className="opacity-0 animate-slide-in-right" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
                <div className="text-xs text-[var(--text-muted)] mb-1 font-mono">Customer • 2:35 PM</div>
                <div className="bg-[#FFFFFF] text-[#000000] rounded-xl p-3.5 max-w-[280px] ml-auto text-sm font-medium shadow-[0_8px_24px_rgba(255,255,255,0.08)]">
                  Yes, in black please
                </div>
              </div>

              <div className="opacity-0 animate-slide-in-left" style={{ animationDelay: '3s', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/logo.svg"
                    alt="Checkoutly Logo"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <div className="text-xs text-[var(--text-muted)]">Checkoutly AI • 2:35 PM</div>
                </div>
                <div className="bg-[#1E1E1E] text-white border border-[#2A2A2A] rounded-xl p-3.5 max-w-[280px] text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  ✓ Order confirmed! Processing payment securely... Order #CK-2024-001 ready for shipping.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] text-sm opacity-0 animate-fade-up" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
        <span className="font-mono tracking-widest uppercase text-[10px]">Scroll to explore</span>
        <div className="w-5 h-5 border-r border-b border-[#FFFFFF] transform rotate-45 animate-float opacity-50"></div>
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </section>
  )
}