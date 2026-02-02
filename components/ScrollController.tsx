'use client'

import { useEffect } from 'react'

export default function ScrollController() {
  useEffect(() => {
    // Prevent automatic scrolling to hash fragments on page load
    const preventHashScroll = () => {
      if (window.location.hash) {
        // Remove the hash from the URL without triggering a scroll
        const url = window.location.href.split('#')[0]
        window.history.replaceState(null, '', url)
      }
    }

    // Run on mount to prevent initial hash scrolling
    preventHashScroll()

    // Also prevent hash scrolling when hash changes
    const handleHashChange = (e: HashChangeEvent) => {
      e.preventDefault()
      // Don't scroll, just update the URL
      const newUrl = e.newURL.split('#')[0]
      window.history.replaceState(null, '', newUrl)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return null
}