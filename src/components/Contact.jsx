import { motion } from 'framer-motion'
import { FiMail, FiGithub, FiLinkedin, FiSend } from 'react-icons/fi'
import ScrollReveal from './ScrollReveal'

export default function Contact({ config }) {
  const { contact, profile } = config

  const socials = [
    {
      icon: <FiMail />,
      label: profile.social.email,
      href: `mailto:${profile.social.email}`,
    },
    {
      icon: <FiGithub />,
      label: 'SMJ-205',
      href: profile.social.github,
    },
    {
      icon: <FiLinkedin />,
      label: 'in/sarifmj',
      href: profile.social.linkedin,
    },
  ]

  return (
    <section id="contact" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <ScrollReveal>
          <h2 className="section-title" style={{ display: 'block', textAlign: 'center' }}>
            {contact.heading}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p className="section-subtitle" style={{ textAlign: 'center', margin: '0.5rem auto 2.5rem' }}>
              {contact.message}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-card" style={{
            maxWidth: '550px',
            margin: '0 auto',
            padding: '2.5rem',
          }}>
            {/* Social Links */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                  }}
                  whileHover={{
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    x: 6,
                    boxShadow: '0 0 15px var(--accent-glow)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{social.icon}</span>
                  {social.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              href={`mailto:${profile.social.email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                fontWeight: 700,
                fontSize: '0.95rem',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                border: 'none',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px var(--accent-glow-strong)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSend /> Say Hello
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
