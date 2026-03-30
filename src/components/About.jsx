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
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '1rem',
              }}>
                {profile.bio}
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.8,
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
              {[
                { number: '12+', label: 'Years Experience' },
                { number: '6+', label: 'Companies' },
                { number: '100+', label: 'Students Mentored' },
                { number: '2', label: 'Degrees' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card"
                  style={{
                    textAlign: 'center',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1,
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
    </section>
  )
}
