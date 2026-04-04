import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiBriefcase } from 'react-icons/fi'
import ScrollReveal from './ScrollReveal'

/**
 * Dynamically calculate duration between two date strings like "Oct 2023" and "Present".
 * Returns a human-readable string like "2 yrs 6 mos".
 */
function calcDuration(startStr, endStr) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const parse = (str) => {
    if (!str || str.toLowerCase() === 'present') return new Date()
    const parts = str.split(' ')
    const monthIdx = months.indexOf(parts[0])
    const year = parseInt(parts[1], 10)
    return new Date(year, monthIdx >= 0 ? monthIdx : 0, 1)
  }

  const start = parse(startStr)
  const end = parse(endStr)

  let totalMonths = (end.getFullYear() - start.getFullYear()) * 12
    + (end.getMonth() - start.getMonth())

  // Include current month
  if (totalMonths >= 0) totalMonths += 1

  const years = Math.floor(totalMonths / 12)
  const mos = totalMonths % 12

  if (years === 0) return `${mos} mos`
  if (mos === 0) return `${years} yr${years > 1 ? 's' : ''}`
  return `${years} yr${years > 1 ? 's' : ''} ${mos} mos`
}

export default function Experience({ config }) {
  return (
    <section id="experience" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Experiences</h2>
          <p className="section-subtitle">My professional journey across data, finance and mentoring.</p>
        </ScrollReveal>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            left: '7px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--accent), var(--border), transparent)',
          }} />

          {config.experience.map((company, compIdx) => (
            <ScrollReveal key={compIdx} delay={compIdx * 0.1}>
              <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  style={{
                    position: 'absolute',
                    left: '-2rem',
                    top: '1.5rem',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    border: '3px solid var(--bg-primary)',
                    boxShadow: '0 0 12px var(--accent-glow-strong)',
                    zIndex: 2,
                  }}
                />

                <motion.div
                  className="glass-card"
                  whileHover={{
                    borderColor: 'var(--border-hover)',
                    boxShadow: 'var(--shadow), var(--shadow-glow)',
                    y: -4,
                  }}
                >
                  {/* Company Header */}
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {company.company}
                  </h3>

                  {/* Roles */}
                  {company.roles.map((role, roleIdx) => (
                    <div
                      key={roleIdx}
                      style={{
                        marginBottom: roleIdx < company.roles.length - 1 ? '1.5rem' : 0,
                        paddingBottom: roleIdx < company.roles.length - 1 ? '1.5rem' : 0,
                        borderBottom: roleIdx < company.roles.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '0.4rem',
                      }}>
                        {role.title}
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontWeight: 400,
                          marginLeft: '0.5rem',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          ({role.type})
                        </span>
                      </h4>

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginBottom: '0.75rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {role.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FiMapPin style={{ color: 'var(--accent)', fontSize: '0.75rem' }} />
                            {role.location}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FiCalendar style={{ color: 'var(--accent)', fontSize: '0.75rem' }} />
                          {role.startDate} – {role.endDate} · {calcDuration(role.startDate, role.endDate)}
                        </span>
                        {role.workMode && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FiBriefcase style={{ color: 'var(--accent)', fontSize: '0.75rem' }} />
                            {role.workMode}
                          </span>
                        )}
                      </div>

                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 0.75rem 0',
                      }}>
                        {role.description.map((desc, descIdx) => (
                          <li
                            key={descIdx}
                            style={{
                              position: 'relative',
                              paddingLeft: '1.2rem',
                              marginBottom: '0.4rem',
                              color: 'var(--text-secondary)',
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: 'var(--accent)',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                            }}>
                              ▹
                            </span>
                            {desc}
                          </li>
                        ))}
                      </ul>

                      {/* Skill Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {role.skills.map((skill) => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
