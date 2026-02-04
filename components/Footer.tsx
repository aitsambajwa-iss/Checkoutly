import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--bg-elevated)] mt-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-3 font-display font-bold text-xl">
            <img
              src="/logo.svg"
              alt="Checkoutly Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            Checkoutly
          </Link>

          <div className="flex items-center gap-8 text-sm text-[var(--text-secondary)] font-display">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <p className="text-sm text-[var(--text-muted)]">
            © 2026 Checkoutly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}