import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Use Inter and JetBrains Mono fonts (similar to the original design)
const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}