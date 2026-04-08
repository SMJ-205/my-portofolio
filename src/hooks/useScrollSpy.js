import { useEffect, useState } from 'react'

export default function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      // Find the section that covers the 'focus point'
      // We look for the section whose top is closest to the offset but not too far below it.
      const sections = sectionIds
        .map(id => {
          const el = document.getElementById(id)
          if (!el) return null
          const rect = el.getBoundingClientRect()
          return {
            id,
            top: rect.top,
            bottom: rect.bottom
          }
        })
        .filter(Boolean)

      if (sections.length === 0) return

      // Logic: the active section is the one where the 'offset line' (120px)
      // falls between the section's top and bottom.
      const active = sections.find(s => s.top <= offset && s.bottom >= offset)
        // Fallback: if no section is precisely covering the offset, 
        // pick the one closest to it.
        || sections.sort((a, b) => Math.abs(a.top - offset) - Math.abs(b.top - offset))[0]

      if (active && active.id !== activeId) {
        setActiveId(active.id)
      }
    }

    // Run initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset, activeId])

  return activeId
}
