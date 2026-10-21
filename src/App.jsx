import { useState, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import config from './config/portfolio.json'
import MatrixBackground from './components/MatrixBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
    }
    return 'dark'
  })

  const [matrixEnabled, setMatrixEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('matrixEnabled')
      if (saved !== null) return saved === 'true'
      // Matrix rain is continuous motion: off by default for reduced-motion visitors
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return true
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('matrixEnabled', String(matrixEnabled))
  }, [matrixEnabled])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const toggleMatrix = () => {
    setMatrixEnabled(prev => !prev)
  }

  return (
    // reducedMotion="user" makes Framer Motion drop transform animations for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <MatrixBackground theme={theme} enabled={matrixEnabled} />
      <ScrollProgress />
      <Navbar
        config={config}
        theme={theme}
        toggleTheme={toggleTheme}
        matrixEnabled={matrixEnabled}
        toggleMatrix={toggleMatrix}
      />
      <main>
        <Hero config={config} />
        <About config={config} />
        <Experience config={config} />
        <Projects config={config} theme={theme} />
        <Education config={config} />
        <Skills config={config} />
        <Contact config={config} />
      </main>
      <Footer config={config} />
    </MotionConfig>
  )
}

export default App
