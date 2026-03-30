import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiDownload } from 'react-icons/fi'

const BASE = import.meta.env.BASE_URL

export default function Hero({ config }) {
  const { profile } = config

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '6rem 1.5rem 2rem',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: 'var(--container-max)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Profile Photo */}
        <motion.div
          variants={itemVariants}
          style={{ position: 'relative', width: '180px', height: '180px' }}
        >
          {/* Spinning outer radar ring */}
          <div style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, var(--accent) 100%)',
            animation: 'spin 3s linear infinite',
          }} />
          {/* Gap to separate outer and inner circles */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'var(--bg-primary)',
          }} />
          {/* Static image container (inner circle) */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--accent)',
            background: 'var(--bg-primary)',
          }}>
            <img
              src={`${BASE}${profile.photo}`}
              alt={profile.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          {/* Glow behind */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
            zIndex: -1,
            filter: 'blur(20px)',
          }} />
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            color: 'var(--accent)',
          }}
        >
          Hi, my name is
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {profile.name}
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          {profile.title}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
            color: 'var(--text-muted)',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>{'>'}</span>
          {profile.tagline}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
            style={{ color: 'var(--accent)', fontWeight: 700 }}
          >
            _
          </motion.span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <motion.a
            href={`${BASE}${profile.resumeUrl}`}
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px var(--accent-glow-strong)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload /> Resume
          </motion.a>
          <motion.button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              background: 'transparent',
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              border: '2px solid var(--accent)',
              cursor: 'pointer',
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: 'var(--accent-glow)',
              boxShadow: '0 0 25px var(--accent-glow)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {[
            { icon: <FiMail />, href: `mailto:${profile.social.email}`, label: 'Email' },
            { icon: <FiGithub />, href: profile.social.github, label: 'GitHub' },
            { icon: <FiLinkedin />, href: profile.social.linkedin, label: 'LinkedIn' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              title={social.label}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                textDecoration: 'none',
                background: 'var(--bg-glass)',
              }}
              whileHover={{
                scale: 1.15,
                color: 'var(--accent)',
                borderColor: 'var(--accent)',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: 'absolute',
            bottom: '0.5rem',
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '24px',
              height: '40px',
              borderRadius: '12px',
              border: '2px solid var(--border)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px',
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0], y: [0, 12] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '3px',
                height: '8px',
                borderRadius: '2px',
                background: 'var(--accent)',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Spinning border animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
