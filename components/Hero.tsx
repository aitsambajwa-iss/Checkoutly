'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative z-[2]">
      <div className="max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-[3]">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-up">
            <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>Commerce,</span><br/>
            <span 
              className="inline-block opacity-0 animate-fade-up bg-gradient-to-r from-[var(--accent)] to-[#00D4FF] bg-clip-text text-transparent"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              Reimagined
            </span><br/>
            <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>Through</span>{' '}
            <span className="inline-block opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>Chat</span>
          </h1>
          
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl leading-relaxed opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            AI-powered chatbots that handle orders, payments, and reviews - all in one conversation. 
            Transform your business with intelligent conversational commerce that feels natural.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <Link 
              href="#demo" 
              className="bg-[var(--accent)] text-[#0A0A0A] px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:-translate-y-1 hover:scale-105 relative overflow-hidden animate-glow"
            >
              Start Free Trial
            </Link>
            <Link 
              href="#demo" 
              className="border-2 border-[var(--bg-elevated)] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Demo
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 text-sm text-[var(--text-muted)] font-mono opacity-0 animate-fade-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-glow"></div>
              <span>Secure Payment Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-glow"></div>
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-glow"></div>
              <span>24/7 Automation</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-[3]">
          <div 
            className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--bg-elevated)] backdrop-blur-xl transition-transform duration-300 hover:scale-105 opacity-0 animate-fade-up"
            style={{ 
              transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
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
                <div className="text-xs text-[var(--text-muted)] mb-1">Customer • 2:34 PM</div>
                <div className="bg-[var(--accent)] text-[#0A0A0A] rounded-xl p-3 max-w-[280px] ml-auto text-sm">
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
                <div className="bg-[var(--bg-elevated)] text-white rounded-xl p-3 max-w-[280px] text-sm">
                  Perfect! I found Premium Wireless Headphones for $299. Would you like to proceed with the order?
                </div>
              </div>
              
              <div className="opacity-0 animate-slide-in-right" style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}>
                <div className="text-xs text-[var(--text-muted)] mb-1">Customer • 2:35 PM</div>
                <div className="bg-[var(--accent)] text-[#0A0A0A] rounded-xl p-3 max-w-[280px] ml-auto text-sm">
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
                <div className="bg-[var(--bg-elevated)] text-white rounded-xl p-3 max-w-[280px] text-sm">
                  ✓ Order confirmed! Processing payment securely... Order #CK-2024-001 ready for shipping.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] text-sm opacity-0 animate-fade-up" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
        <span>Scroll to explore</span>
        <div className="w-5 h-5 border-r-2 border-b-2 border-[var(--accent)] transform rotate-45 animate-float"></div>
      </div>
    </section>
  )
}