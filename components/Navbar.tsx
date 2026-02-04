'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import WaitlistModal from './WaitlistModal'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function Navbar() {
  const scrollProgress = useScrollProgress(100) // Transition over 100px
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  // Calculate dynamic styles based on scroll progress
  const navPadding = 24 - (scrollProgress * 12) // py-6 (24px) -> py-3 (12px)
  const logoScale = 1 - (scrollProgress * 0.15) // 100% -> 85%
  const borderOpacity = scrollProgress * 1
  const blurIntensity = 8 + (scrollProgress * 12) // 8px -> 20px

  return (
    <>
      <nav
        style={{
          paddingTop: `${navPadding}px`,
          paddingBottom: `${navPadding}px`,
          backdropFilter: 'blur(12px)',
          borderColor: scrollProgress > 0 ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
          backgroundColor: 'transparent'
        }}
        className="fixed top-0 w-full z-[100] transition-all duration-300 border-b border-white/[0.04]"
      >
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-display font-medium text-xl text-[#F5F5F5]">
            <img
              src="/logo.svg"
              alt="Checkoutly Logo"
              width={40}
              height={40}
              style={{ transform: `scale(${logoScale})` }}
              className="object-contain transition-transform duration-300 brightness-[1.2]"
            />
            Checkoutly
          </Link>

          <ul className="hidden md:flex gap-8 list-none">
            <li>
              <Link
                href="#features"
                className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors relative group font-display text-sm tracking-tight"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#demo"
                className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors relative group font-display text-sm tracking-tight"
              >
                Demo
              </Link>
            </li>
          </ul>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="px-6 py-2.5 rounded-lg border border-[#F5F5F5]/20 text-[#F5F5F5] font-display text-sm transition-all hover:bg-white/[0.05] hover:border-[#F5F5F5]/40"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  )
}
