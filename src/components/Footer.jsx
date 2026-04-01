export default function Footer({ config }) {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      padding: '2rem 1.5rem',
      borderTop: '1px solid var(--border)',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
      }}>
        © {year} {config.profile.name}
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        opacity: 0.5,
        marginTop: '0.3rem',
      }}>
        Built with React, Framer Motion and Morning Coffee
      </p>
    </footer>
  )
}
