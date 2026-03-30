import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiSun, FiMoon } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import useScrollSpy from '../hooks/useScrollSpy'

export default function Navbar({ config, theme, toggleTheme, matrixEnabled, toggleMatrix }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const sectionIds = config.navigation.map((nav) => nav.id)
  const activeSection = useScrollSpy(sectionIds)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (id) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '0.6rem 0' : '1rem 0',
          background: scrolled ? 'var(--bg-glass)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {'<'}{config.profile.shortName}{' />'}
          </motion.a>

          {/* Desktop Nav */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          className="desktop-nav"
          >
            {config.navigation.map((nav, i) => (
              <motion.button
                key={nav.id}
                onClick={() => handleNavClick(nav.id)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === nav.id ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  position: 'relative',
                  fontWeight: activeSection === nav.id ? 600 : 400,
                  transition: 'color 0.2s ease',
                }}
                whileHover={{
                  color: 'var(--accent)',
                  backgroundColor: 'var(--accent-glow)',
                }}
              >
                <span style={{ color: 'var(--accent)', opacity: 0.5, marginRight: '2px' }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {nav.label}
              </motion.button>
            ))}

            {/* Matrix Toggle */}
            <motion.button
              onClick={toggleMatrix}
              title={matrixEnabled ? 'Disable matrix effect' : 'Enable matrix effect'}
              style={{
                background: matrixEnabled ? 'var(--accent-glow)' : 'transparent',
                border: '1px solid',
                borderColor: matrixEnabled ? 'var(--accent)' : 'var(--border)',
                color: matrixEnabled ? 'var(--accent)' : 'var(--text-muted)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ scale: 1.1, borderColor: 'var(--accent)' }}
              whileTap={{ scale: 0.9 }}
            >
              <HiSparkles />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid var(--border)',
                color: 'var(--accent)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.25rem',
                fontSize: '1.1rem',
              }}
              whileHover={{ scale: 1.1, borderColor: 'var(--accent)' }}
              whileTap={{ scale: 0.9, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="mobile-nav-btn">
            {/* Matrix Toggle (Mobile) */}
            <motion.button
              onClick={toggleMatrix}
              title={matrixEnabled ? 'Disable matrix effect' : 'Enable matrix effect'}
              style={{
                background: matrixEnabled ? 'var(--accent-glow)' : 'transparent',
                border: '1px solid',
                borderColor: matrixEnabled ? 'var(--accent)' : 'var(--border)',
                color: matrixEnabled ? 'var(--accent)' : 'var(--text-muted)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <HiSparkles />
            </motion.button>
            <motion.button
              onClick={toggleTheme}
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid var(--border)',
                color: 'var(--accent)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </motion.button>
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--accent)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
              }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileOpen ? <HiX /> : <HiMenu />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
            }}
          >
            {config.navigation.map((nav, i) => (
              <motion.button
                key={nav.id}
                onClick={() => handleNavClick(nav.id)}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                exit={{ opacity: 0, x: 50 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === nav.id ? 'var(--accent)' : 'var(--text-primary)',
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontWeight: activeSection === nav.id ? 700 : 400,
                }}
              >
                <span style={{ color: 'var(--accent)', opacity: 0.5, marginRight: '6px', fontSize: '1rem' }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                {nav.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav-btn { display: none !important; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
