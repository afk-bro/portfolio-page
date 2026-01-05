'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled past the fold (300px)
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    // Check initial scroll position
    toggleVisibility()

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed bottom-6 right-6 z-50
        p-3 rounded-full
        bg-primary-600 text-white
        shadow-lg hover:shadow-xl
        hover:bg-primary-700
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
