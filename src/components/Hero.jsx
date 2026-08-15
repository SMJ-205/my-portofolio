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
    hidden: { opacity: 0, y: -30 },
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
        }}
      >
        {/* Desktop Layout (visible on 992px+) */}
        <div className="desktop-hero-layout">
          {/* Left Column: Bio / Texts */}
          <div className="hero-left-col">
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
              className="dynamic-name-gradient"
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
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
              className="hero-tagline"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                color: 'var(--text-muted)',
                maxWidth: '500px',
                display: 'flex',
                alignItems: 'center',
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
              className="hero-ctas"
            >
              <motion.a
                href={`${BASE}${profile.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
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
                <FiDownload /> View Resume
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
              className="hero-socials"
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
          </div>

          {/* Right Column: Profile Image & Orbit */}
          <div className="hero-right-col">
            <motion.div
              variants={itemVariants}
              className="hero-profile-container"
            >
              {/* Background Glow */}
              <div className="profile-glow" />

              {/* Orbit Path & Satellite */}
              <div className="orbit-path">
                <div className="satellite" />
              </div>

              {/* Profile circle background (tosca sphere) */}
              <div className="profile-circle-bg" />

              {/* Profile image (overlapping the bottom) */}
              <img
                src={`${BASE}${profile.photo}`}
                alt={profile.name}
                className="profile-img"
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout (visible on <992px) - exact original code before any edits */}
        <div className="mobile-hero-layout">
          {/* Profile Photo */}
          <motion.div
            variants={itemVariants}
            className="hero-profile-container"
          >
            {/* Background Glow */}
            <div className="profile-glow" />

            {/* Orbit Path & Satellite */}
            <div className="orbit-path">
              <div className="satellite" />
            </div>

            {/* Profile circle background (tosca sphere) */}
            <div className="profile-circle-bg" />

            {/* Profile image (overlapping the bottom) */}
            <img
              src={`${BASE}${profile.photo}`}
              alt={profile.name}
              className="profile-img"
            />
          </motion.div>

          {/* Greeting */}
          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem',
              color: 'var(--accent)',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            Hi, my name is
          </motion.p>

          {/* Name with Dynamic Gradient */}
          <motion.h1
            variants={itemVariants}
            className="dynamic-name-gradient"
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1rem',
              textAlign: 'center',
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
              marginBottom: '1rem',
              textAlign: 'center',
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
              margin: '0 auto 2rem',
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
              marginBottom: '2rem',
            }}
          >
            <motion.a
              href={`${BASE}${profile.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
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
              justifyContent: 'center',
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
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
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

      {/* Spinning border and dynamic animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes textGradient {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: -200% center;
          }
        }

        @keyframes orbitRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Desktop vs Mobile displays */
        .desktop-hero-layout {
          display: none;
        }

        .mobile-hero-layout {
          display: block;
        }

        .hero-grid {
          padding: 1rem 0;
        }

        .hero-left-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          margin-left: 40px;
        }

        .hero-right-col {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .hero-socials {
          display: flex;
          gap: 1.2rem;
          margin-top: 1.5rem;
          justify-content: flex-start;
        }

        .dynamic-name-gradient {
          background: linear-gradient(
            to right,
            var(--text-primary) 0%,
            var(--accent) 25%,
            var(--text-primary) 50%,
            var(--accent) 75%,
            var(--text-primary) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textGradient 8s linear infinite;
          transition: filter 0.3s ease;
        }

        .dynamic-name-gradient:hover {
          filter: drop-shadow(0 0 12px var(--accent-glow-strong));
        }

        /* Profile Satellite & Circle styles (Mobile First) */
        .hero-profile-container {
          position: relative;
          width: 220px;
          height: 220px;
          margin: 0 auto 3.5rem;
        }

        .profile-glow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
          z-index: -1;
          filter: blur(20px);
        }

        .orbit-path {
          position: absolute;
          inset: -25px;
          border-radius: 50%;
          animation: orbitRotate 20s linear infinite;
          pointer-events: none;
          z-index: 2;
        }

        .orbit-path::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(45, 212, 191, 0.25);
          mask-image: linear-gradient(to bottom, black 50%, transparent 95%);
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 95%);
        }

        [data-theme="light"] .orbit-path::before {
          border-color: rgba(13, 148, 136, 0.25);
        }

        .satellite {
          position: absolute;
          top: 14.6%;
          left: 14.6%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background-color: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-glow-strong);
        }

        .profile-circle-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid var(--accent);
          background: radial-gradient(circle at 50% 45%, var(--accent) 0%, var(--accent-dim) 100%);
          opacity: 0.25;
          box-shadow: var(--shadow);
          mask-image: linear-gradient(to bottom, black 50%, transparent 95%);
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 95%);
          z-index: 1;
        }

        .profile-img {
          position: absolute;
          bottom: -38px;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: auto;
          pointer-events: none;
          z-index: 3;
        }

        @media (min-width: 992px) {
          .desktop-hero-layout {
            display: grid;
            grid-template-columns: 1.25fr 0.75fr;
            align-items: center;
            gap: 5rem;
          }
          .mobile-hero-layout {
            display: none;
          }

          /* Desktop overrides for profile container */
          .hero-profile-container {
            width: 350px;
            height: 350px;
            margin: 0;
            top: -50px;
            left: -70px;
          }
          .profile-glow {
            inset: -30px;
            filter: blur(25px);
          }
          .orbit-path {
            inset: -40px;
          }
          .satellite {
            width: 12px;
            height: 12px;
          }
          .profile-img {
            bottom: -60px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dynamic-name-gradient {
            animation: none;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .orbit-path {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
