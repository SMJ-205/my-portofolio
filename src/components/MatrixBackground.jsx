import { useRef, useEffect, useCallback } from 'react'

/**
 * Matrix-style background using vertical rounded rectangles
 * (same shape as the original static grid pattern).
 * Columns of capsules gently cascade with brightness changes,
 * creating a soft "data flowing" ambient effect.
 */
export default function MatrixBackground({ theme, enabled = true }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !enabled) return

    const ctx = canvas.getContext('2d')

    // Capsule / rounded rect dimensions (3x larger)
    const capWidth = 12
    const capHeight = 42
    const spacingX = 48
    const spacingY = 60
    const radius = 6  // border radius for rounded rect

    const cols = Math.ceil(canvas.width / spacingX) + 1
    const rows = Math.ceil(canvas.height / spacingY) + 1

    const isLight = theme === 'light'

    // Each column has a "pulse head" that drifts downward
    const pulses = new Array(cols).fill(0).map(() => ({
      y: Math.random() * rows,
      speed: 0.04 + Math.random() * 0.04,
      length: 5 + Math.random() * 7,
      active: Math.random() > 0.35,
      delay: Math.random() * 300,
    }))

    let frame = 0

    // Helper: draw a rounded rect (capsule shape)
    function roundedRect(x, y, w, h, r) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Base capsule color (very subtle, always visible)
      const baseAlpha = isLight ? 0.055 : 0.04

      for (let col = 0; col < cols; col++) {
        const pulse = pulses[col]

        // Advance pulse head
        if (pulse.active && frame > pulse.delay) {
          pulse.y += pulse.speed
          if (pulse.y > rows + pulse.length) {
            pulse.y = -pulse.length
            pulse.speed = 0.04 + Math.random() * 0.04
            pulse.length = 5 + Math.random() * 7
            pulse.active = Math.random() > 0.2
            pulse.delay = frame + Math.random() * 200
          }
        }

        for (let row = 0; row < rows; row++) {
          const offsetY = (col % 2 === 1) ? spacingY / 2 : 0
          const x = col * spacingX + (spacingX - capWidth) / 2
          const y = row * spacingY + (spacingY - capHeight) / 2 + offsetY

          // Calculate highlight intensity based on distance to pulse head
          let intensity = 0
          if (pulse.active && frame > pulse.delay) {
            const dist = pulse.y - row
            if (dist >= 0 && dist < pulse.length) {
              intensity = 1 - (dist / pulse.length)
              intensity = Math.pow(intensity, 1.3)
            }
          }

          if (intensity > 0) {
            const alpha = isLight
              ? baseAlpha + intensity * 0.16
              : baseAlpha + intensity * 0.13

            // Highlight color
            if (isLight) {
              ctx.fillStyle = `rgba(13, 148, 136, ${alpha})`
            } else {
              ctx.fillStyle = `rgba(45, 212, 191, ${alpha})`
            }

            // Add subtle glow on the brightest capsule (head)
            if (intensity > 0.85) {
              ctx.shadowColor = isLight
                ? 'rgba(13, 148, 136, 0.12)'
                : 'rgba(45, 212, 191, 0.1)'
              ctx.shadowBlur = 6
            }
          } else {
            // Base static capsule
            if (isLight) {
              ctx.fillStyle = `rgba(13, 148, 136, ${baseAlpha})`
            } else {
              ctx.fillStyle = `rgba(45, 212, 191, ${baseAlpha})`
            }
          }

          roundedRect(x, y, capWidth, capHeight, radius)
          ctx.shadowBlur = 0
        }
      }

      animationRef.current = requestAnimationFrame(render)
    }

    render()
  }, [theme, enabled])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    if (enabled) {
      draw()
    } else {
      // When disabled: draw static capsules only
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const isLight = theme === 'light'
      const baseAlpha = isLight ? 0.055 : 0.04
      const spacingX = 48, spacingY = 60
      const capW = 12, capH = 42, r = 6
      const c = Math.ceil(canvas.width / spacingX) + 1
      const rw = Math.ceil(canvas.height / spacingY) + 1

      ctx.fillStyle = isLight
        ? `rgba(13, 148, 136, ${baseAlpha})`
        : `rgba(45, 212, 191, ${baseAlpha})`

      for (let col = 0; col < c; col++) {
        const offsetY = (col % 2 === 1) ? spacingY / 2 : 0
        for (let row = 0; row < rw; row++) {
          const x = col * spacingX + (spacingX - capW) / 2
          const y = row * spacingY + (spacingY - capH) / 2 + offsetY
          ctx.beginPath()
          ctx.moveTo(x + r, y)
          ctx.lineTo(x + capW - r, y)
          ctx.quadraticCurveTo(x + capW, y, x + capW, y + r)
          ctx.lineTo(x + capW, y + capH - r)
          ctx.quadraticCurveTo(x + capW, y + capH, x + capW - r, y + capH)
          ctx.lineTo(x + r, y + capH)
          ctx.quadraticCurveTo(x, y + capH, x, y + capH - r)
          ctx.lineTo(x, y + r)
          ctx.quadraticCurveTo(x, y, x + r, y)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [draw, enabled, theme])

  // Pause on hidden tab for performance
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      } else if (enabled) {
        draw()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [draw, enabled])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
