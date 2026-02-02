import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Demo from '@/components/Demo'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import ScrollController from '@/components/ScrollController'
import GrainOverlay from '@/components/ui/GrainOverlay'
import BackgroundOrbs from '@/components/ui/BackgroundOrbs'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Prevent unwanted scrolling */}
      <ScrollController />
      
      {/* Fixed background effects */}
      <GrainOverlay />
      <BackgroundOrbs />
      <ScrollProgress />
      
      {/* Main content */}
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <Footer />
    </main>
  )
}