import { motion } from 'framer-motion'
import { FiBookOpen, FiAward, FiExternalLink } from 'react-icons/fi'
import ScrollReveal from './ScrollReveal'

const BASE = import.meta.env.BASE_URL

export default function Education({ config }) {
  return (
    <section id="education" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic background and research.</p>
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))',
          gap: '1.5rem',
        }}>
          {config.education.map((edu, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.15} style={{ height: '100%' }}>
              <motion.div
                className="glass-card"
                style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', height: '100%' }}
                whileHover={{
                  borderColor: 'var(--border-hover)',
                  boxShadow: 'var(--shadow), var(--shadow-glow)',
                  y: -4,
                }}
              >
                {/* Logo */}
                {edu.logo && (
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    border: '1px solid var(--border)',
                  }}>
                    <img
                      src={`${BASE}${edu.logo}`}
                      alt={edu.institution}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem',
                  }}>
                    {edu.institution}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    marginBottom: '0.25rem',
                    color: 'var(--accent)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    minHeight: '2.8rem',
                  }}>
                    <FiAward style={{ fontSize: '0.85rem', marginTop: '0.25rem', flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.4 }}>{edu.degree}, {edu.field}</span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.75rem',
                  }}>
                    {edu.startYear} – {edu.endYear}
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    marginBottom: '0.75rem',
                  }}>
                    {edu.description}
                  </p>

                  {/* Thesis */}
                  {edu.thesis && (
                    <motion.div 
                      whileHover={edu.thesisLink ? { y: -2, background: 'rgba(56, 189, 248, 0.1)' } : {}}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        background: 'var(--accent-glow)',
                        border: '1px solid var(--border)',
                        cursor: edu.thesisLink ? 'pointer' : 'default',
                      }}
                    >
                      {edu.thesisLink ? (
                        <a 
                          href={edu.thesisLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            flex: 1
                          }}
                        >
                          <FiBookOpen style={{ color: 'var(--accent)', fontSize: '0.9rem', marginTop: '3px', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--accent)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '0.2rem',
                            }}>
                              <span>Thesis</span>
                              <FiExternalLink style={{ fontSize: '0.85rem', opacity: 0.9 }} title="View Publication" />
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                              "{edu.thesis}"
                            </div>
                          </div>
                        </a>
                      ) : (
                        <>
                          <FiBookOpen style={{ color: 'var(--accent)', fontSize: '0.9rem', marginTop: '3px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                              Thesis
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                              "{edu.thesis}"
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
