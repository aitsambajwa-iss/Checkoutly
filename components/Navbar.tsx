'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] py-6 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-[#2A2A2A]' : ''
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl">
          <img 
            src="/logo.svg" 
            alt="Checkoutly Logo" 
            width={40} 
            height={40}
            className="object-contain"
          />
          Checkoutly
        </Link>
        
        <ul className="hidden md:flex gap-8 list-none">
          <li>
            <Link 
              href="#features" 
              className="text-[var(--text-secondary)] hover:text-white transition-colors relative group"
            >
              Features
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[var(--accent)] transition-all group-hover:w-full" />
            </Link>
          </li>
          <li>
            <Link 
              href="#demo" 
              className="text-[var(--text-secondary)] hover:text-white transition-colors relative group"
            >
              Demo
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[var(--accent)] transition-all group-hover:w-full" />
            </Link>
          </li>
        </ul>
        
        <Link 
          href="#demo" 
          className="bg-[var(--accent)] text-[#0A0A0A] px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_var(--accent-glow)] relative overflow-hidden"
        >
          Start Free Trial
        </Link>
      </div>
    </nav>
  )
}