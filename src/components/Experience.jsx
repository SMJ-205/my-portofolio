import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiCalendar, FiBriefcase, FiX } from 'react-icons/fi'
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

// ─── Role Card ───────────────────────────────────────────────────────────────
function RoleCard({ role, roleIdx, totalRoles }) {
  const isLast = roleIdx === totalRoles - 1

  return (
    <div
      style={{
        marginBottom: !isLast ? '1.5rem' : 0,
        paddingBottom: !isLast ? '1.5rem' : 0,
        borderBottom: !isLast ? '1px solid var(--border)' : 'none',
      }}
    >
      {/* Role title + type */}
      <h4 className="card-title" style={{
        fontWeight: 700,
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

      {/* Meta: location, date, work mode */}
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

      {/* Description bullet points */}
      {role.description.length > 0 && (
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
      )}

      {/* Skill Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {role.skills.map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────


// ─── Mobile: compact company cards + detail popup ─────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const toMonthIndex = (str) => {
  if (!str || str.toLowerCase() === 'present') return Infinity
  const [mon, year] = str.split(' ')
  return parseInt(year, 10) * 12 + Math.max(MONTHS.indexOf(mon), 0)
}

// Overall period a company covers across all of its roles
function companySpan(roles) {
  const start = roles.reduce((a, r) => (toMonthIndex(r.startDate) < toMonthIndex(a) ? r.startDate : a), roles[0].startDate)
  const end = roles.reduce((a, r) => (toMonthIndex(r.endDate) > toMonthIndex(a) ? r.endDate : a), roles[0].endDate)
  return { start, end }
}

const uniqueSkills = (roles) => [...new Set(roles.flatMap(r => r.skills))]

// Makes a clickable card reachable and operable from the keyboard
const cardButtonProps = (label, onOpen) => ({
  role: 'button',
  tabIndex: 0,
  'aria-label': label,
  'aria-haspopup': 'dialog',
  onClick: onOpen,
  onKeyDown: (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  },
})

function MobileCompanyCard({ company, onOpen }) {
  const latest = company.roles[0]
  const { start, end } = companySpan(company.roles)
  const skills = uniqueSkills(company.roles)
  const extraRoles = company.roles.length - 1

  return (
    <motion.div className="glass-card" {...cardButtonProps(`${latest.title} at ${company.company}: view details`, onOpen)} whileTap={{ scale: 0.98 }} style={{ cursor: 'pointer', padding: '1.1rem 1.15rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {latest.title}
        </h4>
        {extraRoles > 0 && (
          <span className="skill-tag" style={{ flexShrink: 0, fontSize: '0.65rem' }}>
            +{extraRoles} role{extraRoles > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent)', margin: '0.3rem 0 0.35rem', fontFamily: 'var(--font-sans)' }}>
        {company.company}
      </h3>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.6rem' }}>
        {start} – {end} · {calcDuration(start, end)}{latest.workMode ? ` · ${latest.workMode}` : ''}
      </p>
      {company.highlight && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.7rem', paddingLeft: '1.1rem', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>▹</span>
          {company.highlight}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {skills.slice(0, 3).map(skill => (
            <span key={skill} className="skill-tag" style={{ fontSize: '0.65rem' }}>{skill}</span>
          ))}
          {skills.length > 3 && <span className="skill-tag" style={{ fontSize: '0.65rem' }}>+{skills.length - 3}</span>}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>Details →</span>
      </div>
    </motion.div>
  )
}

function MobileEarlierCareerCard({ companies, onOpen }) {
  return (
    <motion.div className="glass-card" {...cardButtonProps('Earlier career: view details', onOpen)} whileTap={{ scale: 0.98 }} style={{ cursor: 'pointer', padding: '1.1rem 1.15rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-sans)' }}>
        Earlier career
      </h3>
      {companies.map(company => {
        const { start, end } = companySpan(company.roles)
        return (
          <div key={company.company} style={{ marginBottom: '0.55rem' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1.35 }}>
              {company.roles[0].title}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {company.company} · {start.split(' ')[1]}–{end.split(' ')[1]}
            </p>
          </div>
        )
      })}
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Details →</span>
      </div>
    </motion.div>
  )
}

function ExperiencePopup({ companies, onClose }) {
  // Escape closes the popup like the close button does
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Mirrors the mobile project modal: centered card with a 1rem gutter
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 13, 20, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={companies.map(c => c.company).join(', ')}
        style={{
          width: '100%',
          maxHeight: '90vh',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={onClose}
          className="project-modal-close-btn absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer z-50 text-base"
          aria-label="Close experience details"
          title="Close"
          autoFocus
        >
          <FiX />
        </button>
        <div style={{ overflowY: 'auto', padding: '1.5rem 1.25rem 1.75rem' }}>
          {companies.map((company, idx) => (
            <div key={company.company} style={{ marginTop: idx ? '1.75rem' : 0 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '1rem', paddingRight: '2.5rem', fontFamily: 'var(--font-sans)' }}>
                {company.company}
              </h3>
              {company.roles.map((role, roleIdx) => (
                <RoleCard key={roleIdx} role={role} roleIdx={roleIdx} totalRoles={company.roles.length} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function MobileExperience({ experience }) {
  const [openCompanies, setOpenCompanies] = useState(null)
  const pushedRef = useRef(false)

  const mainCompanies = experience.filter(c => !c.earlierCareer)
  const earlierCompanies = experience.filter(c => c.earlierCareer)

  const open = (companies) => {
    setOpenCompanies(companies)
    // Let the phone's back button close the popup instead of leaving the page
    window.history.pushState({ experiencePopup: true }, '')
    pushedRef.current = true
  }

  const close = () => {
    if (pushedRef.current) {
      pushedRef.current = false
      window.history.back()
    } else {
      setOpenCompanies(null)
    }
  }

  useEffect(() => {
    const onPopState = () => {
      pushedRef.current = false
      setOpenCompanies(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // About stat cards open the popup for the company that backs them
  useEffect(() => {
    const onShow = (e) => {
      const company = experience.find(c => c.company === e.detail.company)
      if (!company) return
      open(company.earlierCareer ? earlierCompanies : [company])
    }
    window.addEventListener('show-experience', onShow)
    return () => window.removeEventListener('show-experience', onShow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience])

  // Freeze background scrolling while the popup is open
  useEffect(() => {
    document.body.style.overflow = openCompanies ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [openCompanies])

  const cards = [
    ...mainCompanies.map(company => ({ key: company.company, el: <MobileCompanyCard company={company} onOpen={() => open([company])} /> })),
    ...(earlierCompanies.length
      ? [{ key: 'earlier-career', el: <MobileEarlierCareerCard companies={earlierCompanies} onOpen={() => open(earlierCompanies)} /> }]
      : []),
  ]

  return (
    <>
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '5px',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, var(--accent), var(--border), transparent)',
        }} />
        {cards.map(({ key, el }) => (
          <ScrollReveal key={key} viewport={{ once: false, amount: 0 }}>
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-1.5rem',
                top: '1.2rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--accent)',
                border: '2px solid var(--bg-primary)',
                boxShadow: '0 0 10px var(--accent-glow-strong)',
                zIndex: 2,
              }} />
              {el}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {openCompanies && <ExperiencePopup companies={openCompanies} onClose={close} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Experience({ config }) {
  const [isMobile] = useState(() => window.innerWidth < 768)

  // Desktop: About stat cards scroll to the company that backs them and flash it
  useEffect(() => {
    if (isMobile) return
    const onShow = (e) => {
      const card = document.querySelector(`#experience [data-company="${CSS.escape(e.detail.company)}"]`)
      if (!card) return
      card.scrollIntoView({ behavior: 'smooth', block: 'center' })
      card.classList.remove('exp-flash')
      void card.offsetWidth // restart the animation if clicked again
      card.classList.add('exp-flash')
    }
    window.addEventListener('show-experience', onShow)
    return () => window.removeEventListener('show-experience', onShow)
  }, [isMobile])

  return (
    <section id="experience" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Experiences</h2>
          <p className="section-subtitle">My professional journey across data, finance and mentoring.</p>
        </ScrollReveal>

        {isMobile ? (
          <MobileExperience experience={config.experience} />
        ) : (
        /* Timeline */
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
                  data-company={company.company}
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
                    <RoleCard
                      key={roleIdx}
                      role={role}
                      roleIdx={roleIdx}
                      totalRoles={company.roles.length}
                    />
                  ))}
                </motion.div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
