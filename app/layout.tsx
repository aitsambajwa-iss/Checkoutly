import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Checkoutly - Commerce, Reimagined Through Chat',
  description: 'AI-powered conversational commerce platform for intelligent chatbots, order management, and payment processing',
  openGraph: {
    title: 'Checkoutly - Commerce, Reimagined Through Chat',
    description: 'Transform your business with AI-powered chatbots that handle orders, payments, and reviews',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}