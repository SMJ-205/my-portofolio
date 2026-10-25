// Scrolls so a section's title lands just below the fixed navbar, skipping the
// section's own top padding (scrollIntoView would leave that padding as a gap).
// Breathing room between the navbar and the section title (desktop / mobile)
const GAP_BELOW_NAV_DESKTOP = 84
const GAP_BELOW_NAV_MOBILE = 56

export default function scrollToSection(id) {
  const section = document.getElementById(id)
  if (!section) return
  const navHeight = document.querySelector('nav')?.getBoundingClientRect().height ?? 0
  const paddingTop = parseFloat(getComputedStyle(section).paddingTop) || 0
  const gap = window.innerWidth >= 768 ? GAP_BELOW_NAV_DESKTOP : GAP_BELOW_NAV_MOBILE
  const top = section.getBoundingClientRect().top + window.scrollY + paddingTop - navHeight - gap
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}
