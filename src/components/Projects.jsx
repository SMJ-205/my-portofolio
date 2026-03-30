import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiTag, FiEye, FiEyeOff, FiChevronDown } from 'react-icons/fi'
import ScrollReveal from './ScrollReveal'

const BASE = import.meta.env.BASE_URL

export default function Projects({ config }) {
  const [activeTag, setActiveTag] = useState('All')
  const [expandedProject, setExpandedProject] = useState(null)

  // Collect all unique tags
  const allTags = ['All', ...new Set(config.projects.flatMap((p) => p.tags))]

  const filtered = activeTag === 'All'
    ? config.projects
    : config.projects.filter((p) => p.tags.includes(activeTag))

  const toggleSneakPeek = (title) => {
    setExpandedProject(prev => prev === title ? null : title)
  }

  return (
    <section id="projects" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Data projects and tools I have built.</p>
        </ScrollReveal>

        {/* Tag Filters */}
        <ScrollReveal delay={0.1}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}>
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: activeTag === tag ? 'var(--accent)' : 'var(--border)',
                  background: activeTag === tag ? 'var(--accent-glow)' : 'transparent',
                  color: activeTag === tag ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontWeight: activeTag === tag ? 600 : 400,
                }}
                whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTag style={{ marginRight: '0.3rem', verticalAlign: 'middle', fontSize: '0.7rem' }} />
                {tag}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
          gap: '1.5rem',
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const isExpanded = expandedProject === project.title
              return (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ScrollReveal delay={idx * 0.1}>
                    <motion.div
                      className="glass-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        cursor: 'default',
                      }}
                      whileHover={{
                        borderColor: 'var(--border-hover)',
                        boxShadow: 'var(--shadow), var(--shadow-glow)',
                        y: -6,
                      }}
                    >
                      {/* Project Number */}
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--accent)',
                        opacity: 0.5,
                        marginBottom: '0.5rem',
                      }}>
                        {'// project-'}{String(idx + 1).padStart(2, '0')}
                      </div>

                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem',
                      }}>
                        {project.title}
                      </h3>

                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.7,
                        flex: 1,
                        marginBottom: '1rem',
                      }}>
                        {project.description}
                      </p>

                      {/* Sneak Peek Toggle */}
                      {project.image && (
                        <div style={{ marginBottom: '1rem' }}>
                          <motion.button
                            onClick={() => toggleSneakPeek(project.title)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.4rem 0.85rem',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: isExpanded ? 'var(--accent)' : 'var(--border)',
                              background: isExpanded ? 'var(--accent-glow)' : 'transparent',
                              color: 'var(--accent)',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 500,
                              cursor: 'pointer',
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            whileHover={{
                              borderColor: 'var(--accent)',
                              boxShadow: '0 0 10px var(--accent-glow)',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {isExpanded ? <FiEyeOff /> : <FiEye />}
                            {project.sneakPeekLabel || 'Sneak Peek'}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: 'flex' }}
                            >
                              <FiChevronDown />
                            </motion.span>
                          </motion.button>

                          {/* Expandable Image Preview */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{
                                  marginTop: '0.75rem',
                                  borderRadius: '10px',
                                  overflow: 'hidden',
                                  border: '1px solid var(--border)',
                                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                }}>
                                  <img
                                    src={`${BASE}${project.image}`}
                                    alt={`${project.title} preview`}
                                    style={{
                                      width: '100%',
                                      height: 'auto',
                                      display: 'block',
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Tags */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginBottom: '1rem',
                      }}>
                        {project.tags.map((tag) => (
                          <span key={tag} className="skill-tag">{tag}</span>
                        ))}
                      </div>

                      {/* Link */}
                      {project.link && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: 'var(--accent)',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                          whileHover={{ x: 4 }}
                        >
                          <FiExternalLink />
                          {project.linkLabel || 'View Project'}
                        </motion.a>
                      )}
                    </motion.div>
                  </ScrollReveal>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Hint for adding more */}
        <ScrollReveal delay={0.3}>
          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            opacity: 0.5,
          }}>
            {'// More projects coming soon...'}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
