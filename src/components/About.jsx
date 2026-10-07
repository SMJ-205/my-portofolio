import ScrollReveal from './ScrollReveal'

export default function About({ config }) {
  const { profile } = config

  return (
    <section id="about" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">About Me</h2>
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          marginTop: '2rem',
        }}>
          <ScrollReveal delay={0.1}>
            <div className="glass-card" style={{ width: '100%' }}>
              <p className="about-text" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1rem',
                textAlign: 'justify',
              }}>
                {profile.bio}
              </p>
              <p className="about-text" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                textAlign: 'justify',
              }}>
                {profile.bioExtended}
              </p>
            </div>
          </ScrollReveal>

          {/* Quick Stats */}
          <ScrollReveal delay={0.2}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              width: '100%',
            }}>
              {(config.stats || [
                { number: '7 → 3–4d', label: 'Month-End Closing (Est.)' },
                { number: '3–4d → 1', label: 'Postpaid Invoice Cycle' },
                { number: '4', label: 'Domains Covered by BI' },
                { number: '100+', label: 'Students Mentored' },
              ]).map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card"
                  style={{
                    textAlign: 'center',
                    padding: '1.25rem 0.75rem',
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(1.35rem, 2.8vw, 1.75rem)',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.4rem',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
      <style>{`
        .about-text {
          font-size: 0.9rem;
        }
        @media (min-width: 768px) {
          .about-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
