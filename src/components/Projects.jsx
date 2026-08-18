import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiTag, FiFolder, FiFileText, FiCornerUpLeft, FiCode, FiGithub, FiX } from 'react-icons/fi'
import { FaChartBar as FaTableau } from 'react-icons/fa'
import { SiGooglesheets } from 'react-icons/si'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ScrollReveal from './ScrollReveal'

const BASE = import.meta.env.BASE_URL

const projectImageMapGlob = import.meta.glob('/public/assets/projects/*')
const availableImageKeys = Object.keys(projectImageMapGlob)

const ProjectSlideshow = ({ baseImagePath, title, isMobileFullBlock = false, theme }) => {
  const images = useMemo(() => {
    if (!baseImagePath) return [`${BASE}${baseImagePath}`]
    // Clean string dynamically: "demand-planning.jpg" -> "demandplanning"
    const cleanBaseName = baseImagePath.split('/').pop().split('.')[0].replace(/[-_ \.]/g, '').toLowerCase()

    // Scan local workspace statically
    const matched = availableImageKeys.filter(key => {
      const keyBase = key.split('/').pop().split('.')[0].replace(/[-_ \.]/g, '').toLowerCase()
      return keyBase.startsWith(cleanBaseName)
    })

    if (matched.length > 0) {
      return matched.sort().map(key => `${BASE}${key.replace('/public/', '')}`)
    }
    return [`${BASE}${baseImagePath}`]
  }, [baseImagePath])

  const [currentIndex, setCurrentIndex] = useState(0)

  // Reset index when path changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [baseImagePath])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [images])

  return (
    <div className={
      isMobileFullBlock
        ? "flex absolute inset-0 w-full h-full justify-center overflow-hidden bg-black"
        : "flex relative w-full h-[220px] md:h-[430px] justify-center overflow-hidden bg-black"
    }>
      <AnimatePresence>
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={`${title} - slide ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: isMobileFullBlock ? 0.35 : 0.35, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5, ease: 'easeInOut' },
            scale: { duration: 6, ease: 'linear' }
          }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </AnimatePresence>
      {/* Dark Gradient Overlay Fade */}
      {isMobileFullBlock ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: theme === 'light' ? 'rgba(241, 245, 249, 0.85)' : 'rgba(10, 14, 20, 0.8)',
          zIndex: 1
        }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--bg-secondary) 100%)', zIndex: 1 }} />
      )}
    </div>
  )
}


// ─── Tag Filter Bar ────────────────────────────────────────────────────────────
const TagButton = ({ tag, activeTag, setActiveTag }) => (
  <motion.button
    key={tag}
    onClick={() => setActiveTag(tag)}
    style={{
      padding: '0.4rem 0.85rem',
      borderRadius: '8px',
      border: '1px solid',
      borderColor: activeTag === tag ? 'var(--accent)' : 'var(--border)',
      background: activeTag === tag ? 'var(--accent-glow)' : 'transparent',
      color: activeTag === tag ? 'var(--accent)' : 'var(--text-muted)',
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono)',
      cursor: 'pointer',
      fontWeight: activeTag === tag ? 600 : 400,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}
    whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
    whileTap={{ scale: 0.95 }}
  >
    <FiTag style={{ marginRight: '0.3rem', verticalAlign: 'middle', fontSize: '0.7rem' }} />
    {tag}
  </motion.button>
)

const TagFilterBar = ({ allTags, activeTag, setActiveTag, isDesktop }) => {
  const [expanded, setExpanded] = useState(false)

  // ── Mobile: tag filter hidden entirely ───────────────────────────────────
  if (!isDesktop) return null

  // ── Desktop: slice-based collapse — no overflow:hidden, no clipping ───────
  // Show first COLLAPSED_COUNT tags by default; show all when expanded.
  // This completely avoids overflow clipping of borders/glows.
  const COLLAPSED_COUNT = 6
  const hiddenCount = allTags.length - COLLAPSED_COUNT
  const visibleTags = expanded ? allTags : allTags.slice(0, COLLAPSED_COUNT)

  // Always ensure the active tag is visible even when collapsed
  const activeIsHidden = !expanded && activeTag !== 'All' && !visibleTags.includes(activeTag)
  const displayTags = activeIsHidden
    ? [...visibleTags.slice(0, COLLAPSED_COUNT - 1), activeTag]
    : visibleTags

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.5rem',
      }}>
        {displayTags.map(tag => (
          <TagButton key={tag} tag={tag} activeTag={activeTag} setActiveTag={setActiveTag} />
        ))}
      </div>

      {/* Toggle button — only shown if there are hidden tags */}
      {hiddenCount > 0 && (
        <motion.button
          onClick={() => setExpanded(e => !e)}
          style={{
            padding: '0.25rem 0.7rem',
            borderRadius: '6px',
            border: '1px dashed var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
          whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          whileTap={{ scale: 0.95 }}
        >
          {expanded ? '▴ less tags' : `▾ more tags (+${hiddenCount})`}
        </motion.button>
      )}
    </div>
  )
}
// ──────────────────────────────────────────────────────────────────────────────

// ─── Jupyter Notebook Renderer ───────────────────────────────────────────────
const stripAnsi = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

const parseMarkdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // Escape HTML entities to prevent XSS
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold / Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Code blocks (inline and block)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Handle lists and paragraph wraps line by line
  const lines = html.split('\n');
  let inUl = false;
  let inOl = false;
  let inPre = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Check pre block toggle
    if (trimmed.includes('<pre>')) {
      inPre = true;
    }

    if (inPre) {
      processedLines.push(line);
      if (trimmed.includes('</pre>')) {
        inPre = false;
      }
      continue;
    }

    // Check for unordered lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (inOl) {
        processedLines.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        processedLines.push('<ul>');
        inUl = true;
      }
      processedLines.push(`<li>${trimmed.substring(2)}</li>`);
      continue;
    }

    // Check for ordered lists
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (inUl) {
        processedLines.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        processedLines.push('<ol>');
        inOl = true;
      }
      processedLines.push(`<li>${olMatch[2]}</li>`);
      continue;
    }

    // If it's an empty line or not a list item, close list if open
    if (trimmed === '' || (!trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !olMatch)) {
      if (inUl) {
        processedLines.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        processedLines.push('</ol>');
        inOl = false;
      }
    }

    // Wrap regular text in paragraphs if it's not a heading, list wrapper, list item, or empty line
    if (trimmed !== '' && !trimmed.startsWith('<h') && !trimmed.startsWith('<ul>') && !trimmed.startsWith('</ul>') && !trimmed.startsWith('<ol>') && !trimmed.startsWith('</ol>') && !trimmed.startsWith('<li>') && !trimmed.startsWith('</pre>') && !trimmed.startsWith('<pre>')) {
      processedLines.push(`<p>${line}</p>`);
    } else {
      processedLines.push(line);
    }
  }

  // Close lists if still open
  if (inUl) processedLines.push('</ul>');
  if (inOl) processedLines.push('</ol>');

  return processedLines.join('\n');
};

const JupyterNotebookRenderer = ({ fileContent }) => {
  const notebook = useMemo(() => {
    try {
      return JSON.parse(fileContent);
    } catch (e) {
      return null;
    }
  }, [fileContent]);

  if (!notebook || !notebook.cells) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
        Failed to parse notebook JSON content. Displaying as raw text below.
      </div>
    );
  }

  const getSourceString = (source) => {
    if (Array.isArray(source)) {
      return source.join('');
    }
    return source || '';
  };

  return (
    <div className="ipynb-container">
      {notebook.cells.map((cell, idx) => {
        const sourceText = getSourceString(cell.source);

        if (cell.cell_type === 'markdown') {
          const html = parseMarkdownToHtml(sourceText);
          return (
            <div key={idx} className="ipynb-cell ipynb-cell-markdown">
              <div 
                className="ipynb-markdown-content" 
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            </div>
          );
        }

        if (cell.cell_type === 'code') {
          const executionCount = cell.execution_count !== null && cell.execution_count !== undefined 
            ? cell.execution_count 
            : ' ';

          return (
            <div key={idx} className="ipynb-cell ipynb-cell-code">
              {/* Input Area */}
              <div className="ipynb-input-area">
                <div className="ipynb-prompt">
                  In [{executionCount}]:
                </div>
                <div className="ipynb-code-content">
                  <SyntaxHighlighter
                    language="python"
                    style={atomDark}
                    customStyle={{ margin: 0, padding: '0.75rem 1rem', fontSize: '0.82rem', background: 'transparent' }}
                  >
                    {sourceText}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Outputs Area */}
              {cell.outputs && cell.outputs.length > 0 && (
                <div className="ipynb-output-area">
                  {cell.outputs.map((out, outIdx) => {
                    // 1. Stream (stdout/stderr)
                    if (out.output_type === 'stream') {
                      const streamText = getSourceString(out.text);
                      return (
                        <div key={outIdx} className="ipynb-output-row">
                          <div className="ipynb-prompt ipynb-prompt-out" style={{ borderRight: 'none', opacity: 0 }}></div>
                          <div className="ipynb-output-content ipynb-output-content-stream">
                            {stripAnsi(streamText)}
                          </div>
                        </div>
                      );
                    }

                    // 2. Display Data / Execute Result (Data object with mime types)
                    if (out.output_type === 'display_data' || out.output_type === 'execute_result') {
                      const data = out.data || {};
                      
                      // Check for base64 PNG/JPEG images first
                      const imagePng = data['image/png'];
                      const imageJpeg = data['image/jpeg'];
                      if (imagePng) {
                        return (
                          <div key={outIdx} className="ipynb-output-row">
                            <div className="ipynb-prompt ipynb-prompt-out" style={{ borderRight: 'none', opacity: 0 }}></div>
                            <div className="ipynb-output-content">
                              <img 
                                src={`data:image/png;base64,${imagePng.trim()}`} 
                                alt="Notebook Output Chart" 
                                className="ipynb-output-image" 
                              />
                            </div>
                          </div>
                        );
                      }
                      if (imageJpeg) {
                        return (
                          <div key={outIdx} className="ipynb-output-row">
                            <div className="ipynb-prompt ipynb-prompt-out" style={{ borderRight: 'none', opacity: 0 }}></div>
                            <div className="ipynb-output-content">
                              <img 
                                src={`data:image/jpeg;base64,${imageJpeg.trim()}`} 
                                alt="Notebook Output Chart" 
                                className="ipynb-output-image" 
                              />
                            </div>
                          </div>
                        );
                      }

                      // Check for HTML (like pandas DataFrames)
                      const htmlContent = data['text/html'];
                      if (htmlContent) {
                        const htmlStr = getSourceString(htmlContent);
                        return (
                          <div key={outIdx} className="ipynb-output-row">
                            <div className="ipynb-prompt ipynb-prompt-out">
                              Out [{executionCount}]:
                            </div>
                            <div 
                              className="ipynb-output-content"
                              dangerouslySetInnerHTML={{ __html: htmlStr }}
                            />
                          </div>
                        );
                      }

                      // Fallback to text/plain
                      const textContent = data['text/plain'];
                      if (textContent) {
                        const plainText = getSourceString(textContent);
                        return (
                          <div key={outIdx} className="ipynb-output-row">
                            <div className="ipynb-prompt ipynb-prompt-out">
                              Out [{executionCount}]:
                            </div>
                            <div className="ipynb-output-content ipynb-output-content-stream">
                              {stripAnsi(plainText)}
                            </div>
                          </div>
                        );
                      }
                    }

                    // 3. Error / Traceback
                    if (out.output_type === 'error') {
                      const tracebackText = out.traceback ? getSourceString(out.traceback) : `${out.ename}: ${out.evalue}`;
                      return (
                        <div key={outIdx} className="ipynb-output-row">
                          <div className="ipynb-prompt ipynb-prompt-out" style={{ borderRight: 'none', opacity: 0 }}></div>
                          <div className="ipynb-output-content ipynb-output-content-error">
                            {stripAnsi(tracebackText)}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default function Projects({ config, theme }) {

  const [activeTag, setActiveTag] = useState('All')

  // Modal State
  const [selectedProject, setSelectedProject] = useState(null)

  // Cache state for static pre-generated repo data
  const [cachedRepoData, setCachedRepoData] = useState(null)

  // GitHub Browser States (scoped to the modal)
  const [repoPath, setRepoPath] = useState('')
  const [repoFiles, setRepoFiles] = useState([])
  const [repoLoading, setRepoLoading] = useState(false)
  const [repoError, setRepoError] = useState(null)

  const [activeFile, setActiveFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [fileLoading, setFileLoading] = useState(false)

  // Desktop check for Conditional Slideshow
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Freeze background scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedProject])

  // Collect all unique tags
  const allTags = ['All', ...new Set(config.projects.flatMap((p) => p.tags))]

  const filtered = activeTag === 'All'
    ? config.projects
    : config.projects.filter((p) => p.tags.includes(activeTag))

  const fetchRepoContents = async (githubRepo, path = '') => {
    setRepoLoading(true)
    setRepoError(null)
    try {
      const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${path}`)
      if (!response.ok) throw new Error('API Rate Limit Exceeded or Repo Not Found')
      const data = await response.json()
      const filteredData = Array.isArray(data)
        ? data.filter(item => !/\.(jpeg|jpg|png|gif|svg|webp|ico|mp4|pdf)$/i.test(item.name))
        : []

      const sorted = filteredData.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name)
        return a.type === 'dir' ? -1 : 1
      })
      setRepoFiles(sorted)
    } catch (err) {
      setRepoError(err.message)
    } finally {
      setRepoLoading(false)
    }
  }

  const fetchFileContent = async (downloadUrl, fileName, filePath = fileName) => {
    setFileLoading(true)
    setRepoError(null)
    setActiveFile(fileName)

    // Check pre-generated cache first
    if (cachedRepoData && cachedRepoData.files && cachedRepoData.files[filePath] !== undefined) {
      setFileContent(cachedRepoData.files[filePath])
      setFileLoading(false)
      return
    }

    try {
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Failed to load file content')
      const text = await response.text()
      setFileContent(text)
    } catch (err) {
      setRepoError(err.message)
    } finally {
      setFileLoading(false)
    }
  }

  const openProject = async (project) => {
    setSelectedProject(project)
    if (project.githubRepo) {
      setRepoPath('')
      setActiveFile(null)
      setRepoLoading(true)
      setRepoError(null)
      setRepoFiles([])
      setCachedRepoData(null)

      const localJsonName = project.githubRepo.replace('/', '_') + '.json'
      const localJsonUrl = `${BASE}data/repos/${localJsonName}`

      try {
        const response = await fetch(localJsonUrl)
        if (response.ok) {
          const data = await response.json()
          setCachedRepoData(data)
          setRepoFiles(data.tree[''] || [])
          setRepoLoading(false)
          return
        }
      } catch (err) {
        console.warn(`Local repo bundle not found or failed to load. Falling back to live GitHub API.`, err)
      }

      // Fallback to Live GitHub API
      fetchRepoContents(project.githubRepo, '')
    }
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  const navigateToDir = (githubRepo, path) => {
    setRepoPath(path)
    setActiveFile(null)
    if (cachedRepoData && cachedRepoData.tree && cachedRepoData.tree[path] !== undefined) {
      setRepoFiles(cachedRepoData.tree[path])
    } else {
      fetchRepoContents(githubRepo, path)
    }
  }

  const navigateUp = (githubRepo) => {
    const parts = repoPath.split('/')
    parts.pop()
    const newPath = parts.join('/')
    setRepoPath(newPath)
    setActiveFile(null)
    if (cachedRepoData && cachedRepoData.tree && cachedRepoData.tree[newPath] !== undefined) {
      setRepoFiles(cachedRepoData.tree[newPath])
    } else {
      fetchRepoContents(githubRepo, newPath)
    }
  }

  return (
    <>
      <section id="projects" className="section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <ScrollReveal>
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle">Data projects and tools I have built.</p>
          </ScrollReveal>

          {/* Tag Filters */}
          <ScrollReveal delay={0.1}>
            <TagFilterBar allTags={allTags} activeTag={activeTag} setActiveTag={setActiveTag} isDesktop={isDesktop} />
          </ScrollReveal>

          {/* Project Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
            gap: '1.5rem',
          }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => {
                return (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    style={{ height: '100%' }}
                  >
                    <ScrollReveal delay={idx * 0.1} style={{ height: '100%' }}>
                      <motion.div
                        className="glass-card"
                        onClick={() => openProject(project)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      // Let native CSS `.glass-card:hover` handle the translateY and shadow rendering perfectly without layout-id collision
                      >
                        {/* Project Number */}
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--accent)',
                          opacity: 0.5,
                          marginBottom: '0.5rem',
                        }}>
                          {'// project-'}{String(idx + 1).padStart(2, '0')}
                        </div>

                        <h3 style={{
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '0.75rem',
                        }}>
                          {project.title}
                        </h3>

                        <p style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          flex: 1,
                          marginBottom: '1.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {project.description}
                        </p>

                        {/* Top-level Tags Preview */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.4rem',
                          marginBottom: '1rem',
                        }}>
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="skill-tag" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>{tag}</span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="skill-tag" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>+{project.tags.length - 3}</span>
                          )}
                        </div>

                        {/* Link & Integration Icons Preview (Footer) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>Click to explore →</span>

                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            {project.githubRepo && <FiGithub style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }} />}
                            {project.tableauLink && <FaTableau style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }} />}
                            {project.link?.includes('docs.google.com/spreadsheets') && <SiGooglesheets style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }} />}
                          </div>
                        </div>
                      </motion.div>
                    </ScrollReveal>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <ScrollReveal delay={0.3}>
            <p style={{
              textAlign: 'center',
              marginTop: '3rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              opacity: 0.5,
            }}>
              {'// More projects coming soon...'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Massive Project Popup Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 13, 20, 0.75)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={closeProject}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()} // Stop bubbling so click doesn't close modal
              style={{
                background: isDesktop ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '1100px',
                maxHeight: isDesktop ? 'calc(90vh + 30px)' : '90vh',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* Floating Close Button */}
              <button
                onClick={closeProject}
                className="absolute top-3 right-3 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer z-50 text-base md:text-xl"
                style={{
                  background: 'var(--accent-glow)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
              >
                <FiX />
              </button>

              {/* Mobile Fixed Background Slideshow */}
              {!isDesktop && selectedProject.image && (
                <ProjectSlideshow theme={theme} baseImagePath={selectedProject.image} title={selectedProject.title} isMobileFullBlock={true} />
              )}

              {/* Inner Scrolling Container */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Desktop Header Image */}
                {isDesktop && selectedProject.image && (
                  <ProjectSlideshow theme={theme} baseImagePath={selectedProject.image} title={selectedProject.title} />
                )}

                {/* Modal Body */}
                <div
                  className="flex-1 relative z-10"
                  style={{
                    background: isDesktop ? 'var(--bg-secondary)' : 'transparent',
                    borderRadius: '0 0 16px 16px',
                    paddingTop: isDesktop ? '1rem' : '4rem',
                    paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
                    paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
                    paddingRight: 'clamp(1.5rem, 5vw, 4rem)'
                  }}
                >

                  {/* Header Row */}
                  <div 
                    className="flex flex-col md:flex-row md:justify-between items-start md:items-center flex-wrap gap-5 relative mt-0"
                    style={{ marginBottom: '2rem' }}
                  >
                    <div>
                      <h2 style={{ fontSize: isDesktop ? 'var(--font-xl, 2.2rem)' : '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                        {selectedProject.title}
                      </h2>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {selectedProject.tags.map(tag => (
                          <span key={tag} className="skill-tag" style={{ fontSize: isDesktop ? '0.75rem' : '0.65rem', padding: isDesktop ? '0.25rem 0.75rem' : '0.2rem 0.6rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* External Action Links */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {selectedProject.link && (selectedProject.link !== `https://github.com/${selectedProject.githubRepo}`) && (!selectedProject.tableauLink || selectedProject.link !== selectedProject.tableauLink) && (
                        <motion.a
                          href={selectedProject.link} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', border: '1px solid var(--accent)', padding: isDesktop ? '0.6rem 1.25rem' : '0.45rem 1rem', borderRadius: '8px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: isDesktop ? '0.85rem' : '0.75rem', textDecoration: 'none', background: 'rgba(0,0,0,0.05)', marginRight: '0.25rem' }}
                          whileHover={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                        >
                          <FiExternalLink /> {selectedProject.linkLabel || 'View Full Project'}
                        </motion.a>
                      )}
                      {selectedProject.tableauLink && (
                        <motion.a
                          href={selectedProject.tableauLink} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', border: '1px solid var(--accent)', padding: isDesktop ? '0.6rem 1.25rem' : '0.45rem 1rem', borderRadius: '8px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: isDesktop ? '0.85rem' : '0.75rem', textDecoration: 'none', background: 'rgba(0,0,0,0.05)', marginRight: '0.25rem' }}
                          whileHover={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                        >
                          <FaTableau /> {selectedProject.linkLabel || 'View Vizzes'}
                        </motion.a>
                      )}
                      {selectedProject.githubRepo && (
                        <motion.a
                          href={`https://github.com/${selectedProject.githubRepo}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', border: '1px solid var(--accent)', padding: isDesktop ? '0.6rem 1.25rem' : '0.45rem 1rem', borderRadius: '8px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: isDesktop ? '0.85rem' : '0.75rem', textDecoration: 'none', background: 'rgba(0,0,0,0.05)', marginRight: '0.5rem' }}
                          whileHover={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
                        >
                          <FiGithub /> Source Code
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: isDesktop ? '0.95rem' : '0.92rem',
                    lineHeight: isDesktop ? 1.8 : 1.6,
                    marginBottom: isDesktop ? '2.5rem' : '1.5rem',
                    marginTop: '0.5rem',
                    position: 'relative',
                    textAlign: 'justify',
                    textJustify: 'inter-word'
                  }}>
                    {selectedProject.description}
                  </p>

                  {/* Live IDE Repo Explorer */}
                  {selectedProject.githubRepo && (
                    <div style={{ border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                      {/* IDE Header */}
                      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        <FiCode color="var(--accent)" />
                        <span>{selectedProject.githubRepo}</span>
                        {repoPath && <span style={{ color: 'var(--accent)' }}>/ {repoPath}</span>}
                      </div>

                      {/* IDE Content Provider */}
                      <div style={{
                        overflowY: 'auto',
                        minHeight: '80px',
                        maxHeight: activeFile ? '550px' : '140px',
                        padding: '0.5rem 0',
                        transition: 'max-height var(--transition-medium)'
                      }}>
                        {repoLoading ? (
                          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>Loading GitHub Environment...</div>
                        ) : repoError ? (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b', fontSize: '0.9rem' }}>{repoError}</div>
                        ) : activeFile ? (
                          <div>
                            <button
                              onClick={() => setActiveFile(null)}
                              style={{ background: 'var(--bg-primary)', border: 'none', color: 'var(--text-primary)', padding: '0.75rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', width: '100%', textAlign: 'left', borderBottom: '1px solid var(--border)' }}
                            >
                              <FiCornerUpLeft color="var(--accent)" /> Back to Files ({activeFile})
                            </button>
                            {fileLoading ? (
                              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>Reading Deep Storage File...</div>
                            ) : activeFile.endsWith('.ipynb') ? (
                              <JupyterNotebookRenderer fileContent={fileContent} />
                            ) : (
                              <SyntaxHighlighter
                                language={activeFile.split('.').pop() === 'py' ? 'python' : activeFile.split('.').pop() === 'js' ? 'javascript' : activeFile.split('.').pop()}
                                style={atomDark}
                                customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.85rem', background: '#1a1b26', borderRadius: '0 0 12px 12px' }}
                              >
                                {fileContent}
                              </SyntaxHighlighter>
                            )}
                          </div>
                        ) : (
                          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {repoPath && (
                              <li
                                onClick={() => navigateUp(selectedProject.githubRepo)}
                                style={{ padding: '0.6rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <FiCornerUpLeft color="var(--accent)" /> ..
                              </li>
                            )}
                            {repoFiles.map((item) => (
                              <li
                                key={item.sha}
                                onClick={() => item.type === 'dir' ? navigateToDir(selectedProject.githubRepo, item.path) : fetchFileContent(item.download_url, item.name, item.path)}
                                style={{ padding: '0.6rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                {item.type === 'dir' ? <FiFolder color="var(--accent)" size={16} /> : <FiFileText color="var(--text-secondary)" size={16} />}
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
