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
            <div className="stats-grid">
              {(config.stats || [
                {
                  number: '7d → 3–4d',
                  label: 'Month-End Closing',
                  context: 'Automated draft ledgers cut finance closing cycle by ~50%',
                },
                {
                  number: '3–4d → 1d',
                  label: 'Postpaid Invoice Cycle',
                  context: 'Automation script reduced billing turnaround for single PIC',
                },
                {
                  number: '4 Domains',
                  label: 'Cross-Functional BI',
                  context: 'Finance, General Trade, Ads Service & Shipping',
                },
                {
                  number: '100+',
                  label: 'Students Mentored',
                  context: 'Data analytics cohorts at RevoU & Kampus Merdeka',
                },
              ]).map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card stat-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'center',
                    padding: '1.25rem 0.85rem',
                  }}
                >
                  <div className="stat-number">
                    {stat.number}
                  </div>
                  <div className="stat-label">
                    {stat.label}
                  </div>
                  {stat.context && (
                    <div className="stat-context">
                      {stat.context}
                    </div>
                  )}
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
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          width: 100%;
        }
        @media (min-width: 520px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 960px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .stat-card {
          transition: transform var(--transition-medium), border-color var(--transition-medium), box-shadow var(--transition-medium);
        }
        .stat-number {
          font-size: clamp(1.35rem, 2.4vw, 1.7rem);
          font-weight: 800;
          color: var(--accent);
          font-family: var(--font-mono);
          line-height: 1.2;
          word-break: break-word;
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 0.45rem;
          font-family: var(--font-heading);
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .stat-context {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.35rem;
          font-family: var(--font-sans);
          line-height: 1.45;
        }
      `}</style>
    </section>
  )
}
