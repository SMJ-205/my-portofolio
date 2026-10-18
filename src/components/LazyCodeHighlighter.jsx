import { lazy, Suspense } from 'react'

const loadHighlighter = () => import('./CodeHighlighter')
const CodeHighlighter = lazy(loadHighlighter)

// Desktop preloads right away so its behavior is unchanged; mobile loads on first use
if (typeof window !== 'undefined' && window.innerWidth >= 768) {
  loadHighlighter()
}

export default function LazyCodeHighlighter({ children, customStyle, ...props }) {
  return (
    <Suspense
      fallback={
        <pre style={{ ...customStyle, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          {children}
        </pre>
      }
    >
      <CodeHighlighter customStyle={customStyle} {...props}>
        {children}
      </CodeHighlighter>
    </Suspense>
  )
}
