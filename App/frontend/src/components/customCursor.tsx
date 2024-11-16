'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <>
      <motion.div
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="fixed pointer-events-none z-[99999] w-3 h-3 bg-[#313BA8] rounded-full"
        style={{ 
          left: 0,
          top: 0,
        }}
      />
      <motion.div
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="fixed pointer-events-none z-[99998] w-8 h-8 border-2 border-[#313BA8] rounded-full"
        style={{ 
          left: 0,
          top: 0,
        }}
      />
    </>
  )
}