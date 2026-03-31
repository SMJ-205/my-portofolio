import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0, style = {} }) {
  const ref = useRef(null)
  const [hiddenY, setHiddenY] = useState(40) // Default rise from below

  useEffect(() => {
    let ticking = false

    const checkPosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        // If element is upper half of viewport, it should drop down from above/exit up
        if (rect.top < window.innerHeight / 2) {
          setHiddenY(-40)
        } else {
          setHiddenY(40)
        }
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkPosition)
        ticking = true
      }
    }

    checkPosition() // Initial check
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: hiddenY }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: hiddenY }}
      viewport={{ once: false, amount: 0.1, margin: '-20px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
