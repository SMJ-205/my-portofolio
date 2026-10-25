// Scrolls so a section's title lands just below the fixed navbar, skipping the
// section's own top padding (scrollIntoView would leave that padding as a gap).
const GAP_BELOW_NAV = 20

export default function scrollToSection(id) {
  const section = document.getElementById(id)
  if (!section) return
  const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 0
  const paddingTop = parseFloat(getComputedStyle(section).paddingTop) || 0
  const top = section.getBoundingClientRect().top + window.scrollY + paddingTop - navHeight - GAP_BELOW_NAV
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}
