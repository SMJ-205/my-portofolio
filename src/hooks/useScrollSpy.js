import { useEffect, useState, useRef } from 'react'

export default function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState('')
  // Using a ref to track visible sections without triggering re-renders during calculation
  const visibleSections = useRef(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility status for each entry
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.current.set(entry.target.id, entry.boundingClientRect.top)
          } else {
            visibleSections.current.delete(entry.target.id)
          }
        })

        // Find the best candidate among visible sections
        // Heuristic: Pick the one that started before the 'offset' line
        // or the one currently occupying the main focus area.
        const sections = Array.from(visibleSections.current.keys())
          .map(id => {
            const el = document.getElementById(id)
            return {
              id,
              top: el ? el.getBoundingClientRect().top : Infinity,
              height: el ? el.getBoundingClientRect().height : 0
            }
          })
          .sort((a, b) => a.top - b.top)

        if (sections.length === 0) return

        // Sensitive Selection: Find the section that covers the 'focus point' (navbar area)
        // We look for the section whose top is closest to the offset but not too far below it.
        const candidate = sections.find(s => s.top <= offset + 50) || sections[0]
        
        if (candidate && candidate.id !== activeId) {
          setActiveId(candidate.id)
        }
      },
      {
        // Detect as soon as any part of the section crosses the vertical center of the screen
        // to ensure we have enough data to choose the best active one.
        rootMargin: `0px 0px -40% 0px`,
        threshold: [0, 0.1, 0.2]
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // Initial check on mount
    const handleInitial = () => {
      const sorted = sectionIds
        .map(id => {
          const el = document.getElementById(id)
          return { id, top: el ? el.getBoundingClientRect().top : Infinity }
        })
        .filter(s => s.top !== Infinity)
        .sort((a, b) => a.top - b.top)
      
      const initial = sorted.find(s => s.top <= offset + 100) || sorted[0]
      if (initial) setActiveId(initial.id)
    }
    handleInitial()

    return () => observer.disconnect()
  }, [sectionIds, offset])

  return activeId
}
