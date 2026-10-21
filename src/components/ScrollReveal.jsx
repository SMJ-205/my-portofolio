import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useLayoutEffect, useState } from 'react'

// Content is visible by default. Only elements that start below the fold get
// a one-time entrance; anything already on screen, or any visitor who prefers
// reduced motion, renders statically so nothing is ever left at opacity 0.
export default function ScrollReveal({ children, className = '', delay = 0, style = {}, viewport = {} }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const [mode, setMode] = useState('static')
  const inView = useInView(ref, { once: true, amount: viewport.amount ?? 0.1, margin: viewport.margin ?? '0px 0px -20px 0px' })

  useLayoutEffect(() => {
    if (prefersReducedMotion || !ref.current) return
    // Measure before paint, then opt into the entrance; this is the intended layout-effect pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ref.current.getBoundingClientRect().top > window.innerHeight) setMode('reveal')
  }, [prefersReducedMotion])

  const variants = {
    shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } },
    hidden: { opacity: 0, y: 40, transition: { duration: 0 } },
  }

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={mode === 'reveal' && !inView ? 'hidden' : 'shown'}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
