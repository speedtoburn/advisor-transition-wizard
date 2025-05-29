'use client'

import ReactConfetti from 'react-confetti'
import { useEffect, useState } from 'react'

export default function Confetti() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Set initial dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()

    // Add window resize listener
    window.addEventListener('resize', updateDimensions)

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setIsActive(false), 5000)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
    }
  }, [])

  if (!isActive) return null

  return (
    <ReactConfetti
      {...dimensions}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
      initialVelocityY={20}
      colors={['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8']}
    />
  )
}
