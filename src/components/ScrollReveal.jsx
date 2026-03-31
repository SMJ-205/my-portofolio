import { motion } from 'framer-motion'

export default function ScrollReveal({ children, className = '', delay = 0, style = {}, direction = 'up' }) {
  const variants = {
    hidden: { opacity: 0, y: direction === 'down' ? -40 : 40 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1, margin: '-20px' }}
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
