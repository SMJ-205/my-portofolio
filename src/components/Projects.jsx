import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiTag, FiEye, FiEyeOff, FiChevronDown, FiFolder, FiFileText, FiCornerUpLeft, FiCode, FiGithub } from 'react-icons/fi'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ScrollReveal from './ScrollReveal'

const BASE = import.meta.env.BASE_URL

export default function Projects({ config }) {
  const [activeTag, setActiveTag] = useState('All')
  const [expandedProject, setExpandedProject] = useState(null)
  
  // GitHub Browser States
  const [activeRepo, setActiveRepo] = useState(null)
  const [repoPath, setRepoPath] = useState('')
  const [repoFiles, setRepoFiles] = useState([])
  const [repoLoading, setRepoLoading] = useState(false)
  const [repoError, setRepoError] = useState(null)
  
  const [activeFile, setActiveFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [fileLoading, setFileLoading] = useState(false)

  // Collect all unique tags
  const allTags = ['All', ...new Set(config.projects.flatMap((p) => p.tags))]

  const filtered = activeTag === 'All'
    ? config.projects
    : config.projects.filter((p) => p.tags.includes(activeTag))

  const toggleSneakPeek = (title) => {
    setExpandedProject(prev => prev === title ? null : title)
    // Close repo if sneak peek is clicked
    if (activeRepo === title) setActiveRepo(null)
  }

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

  const fetchFileContent = async (downloadUrl, fileName) => {
    setFileLoading(true)
    setRepoError(null)
    setActiveFile(fileName)
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

  const toggleRepoBrowser = (projectTitle, githubRepo) => {
    if (activeRepo === projectTitle) {
      setActiveRepo(null)
      setActiveFile(null)
      setRepoPath('')
    } else {
      setActiveRepo(projectTitle)
      setExpandedProject(null) // Close sneak peek if open
      setActiveFile(null)
      setRepoPath('')
      fetchRepoContents(githubRepo, '')
    }
  }

  const navigateToDir = (githubRepo, path) => {
    setRepoPath(path)
    setActiveFile(null)
    fetchRepoContents(githubRepo, path)
  }

  const navigateUp = (githubRepo) => {
    const parts = repoPath.split('/')
    parts.pop()
    const newPath = parts.join('/')
    setRepoPath(newPath)
    setActiveFile(null)
    fetchRepoContents(githubRepo, newPath)
  }

  return (
    <section id="projects" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Data projects and tools I have built.</p>
        </ScrollReveal>

        {/* Tag Filters */}
        <ScrollReveal delay={0.1}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}>
            {allTags.map((tag) => (
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
                }}
                whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTag style={{ marginRight: '0.3rem', verticalAlign: 'middle', fontSize: '0.7rem' }} />
                {tag}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
          gap: '1.5rem',
        }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const isExpanded = expandedProject === project.title
              return (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%' }}
                >
                  <ScrollReveal delay={idx * 0.1} style={{ height: '100%' }}>
                    <motion.div
                      className="glass-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        cursor: 'default',
                      }}
                      whileHover={{
                        borderColor: 'var(--border-hover)',
                        boxShadow: 'var(--shadow), var(--shadow-glow)',
                        y: -6,
                      }}
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
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem',
                      }}>
                        {project.title}
                      </h3>

                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.7,
                        flex: 1,
                        marginBottom: '1rem',
                      }}>
                        {project.description}
                      </p>

                      {/* Sneak Peek Toggle */}
                      {project.image && (
                        <div style={{ marginBottom: '1rem' }}>
                          <motion.button
                            onClick={() => toggleSneakPeek(project.title)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.4rem 0.85rem',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: isExpanded ? 'var(--accent)' : 'var(--border)',
                              background: isExpanded ? 'var(--accent-glow)' : 'transparent',
                              color: 'var(--accent)',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 500,
                              cursor: 'pointer',
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            whileHover={{
                              borderColor: 'var(--accent)',
                              boxShadow: '0 0 10px var(--accent-glow)',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {isExpanded ? <FiEyeOff /> : <FiEye />}
                            {project.sneakPeekLabel || 'Sneak Peek'}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: 'flex' }}
                            >
                              <FiChevronDown />
                            </motion.span>
                          </motion.button>
                        </div>
                      )}

                      {/* GitHub Browser Toggle */}
                      {project.githubRepo && (
                        <div style={{ marginBottom: '1rem' }}>
                          <motion.button
                            onClick={() => toggleRepoBrowser(project.title, project.githubRepo)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.4rem 0.85rem',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: activeRepo === project.title ? 'var(--accent)' : 'var(--border)',
                              background: activeRepo === project.title ? 'var(--accent-glow)' : 'transparent',
                              color: 'var(--accent)',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 500,
                              cursor: 'pointer',
                              width: '100%',
                              justifyContent: 'center',
                            }}
                            whileHover={{
                              borderColor: 'var(--accent)',
                              boxShadow: '0 0 10px var(--accent-glow)',
                            }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <FiCode />
                            {activeRepo === project.title ? 'Close Code Browser' : 'Browse Repository Files'}
                            <motion.span
                              animate={{ rotate: activeRepo === project.title ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: 'flex' }}
                            >
                              <FiChevronDown />
                            </motion.span>
                          </motion.button>
                        </div>
                      )}

                      {/* Expandable Sneak Peek Image */}
                      <AnimatePresence>
                        {isExpanded && !activeRepo && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ overflow: 'hidden', marginBottom: '1rem' }}
                          >
                            <div style={{
                              marginTop: '0.25rem',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: '1px solid var(--border)',
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            }}>
                              <img
                                src={`${BASE}${project.image}`}
                                alt={`${project.title} preview`}
                                style={{
                                  width: '100%',
                                  height: 'auto',
                                  display: 'block',
                                }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expandable GitHub File Browser */}
                      <AnimatePresence>
                        {activeRepo === project.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ overflow: 'hidden', marginBottom: '1rem' }}
                          >
                            <div style={{
                              marginTop: '0.25rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              background: '#1a1f2c', // Dark IDE-like background
                              overflow: 'hidden',
                              maxHeight: '400px',
                              display: 'flex',
                              flexDirection: 'column',
                            }}>
                              {/* IDE Header */}
                              <div style={{
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(0,0,0,0.3)',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--text-muted)'
                              }}>
                                <span>{project.githubRepo}</span>
                                {repoPath && <span>/ {repoPath}</span>}
                              </div>

                              {/* IDE Content Area */}
                              <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem 0' }}>
                                {repoLoading ? (
                                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                                    Loading IDE...
                                  </div>
                                ) : repoError ? (
                                  <div style={{ padding: '1rem', textAlign: 'center', color: '#ff6b6b', fontSize: '0.8rem' }}>
                                    {repoError}
                                  </div>
                                ) : activeFile ? (
                                  <div>
                                    <button 
                                      onClick={() => setActiveFile(null)}
                                      style={{
                                        background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                                        padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', width: '100%', textAlign: 'left',
                                        borderBottom: '1px solid var(--border)'
                                      }}
                                    >
                                      <FiCornerUpLeft /> Back to Files ({activeFile})
                                    </button>
                                    {fileLoading ? (
                                       <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Reading File...</div>
                                    ) : (
                                       <SyntaxHighlighter
                                        language={activeFile.split('.').pop() === 'py' ? 'python' : activeFile.split('.').pop() === 'js' ? 'javascript' : activeFile.split('.').pop()}
                                        style={atomDark}
                                        customStyle={{ margin: 0, padding: '1rem', fontSize: '0.75rem', background: 'transparent' }}
                                      >
                                        {fileContent}
                                      </SyntaxHighlighter>
                                    )}
                                  </div>
                                ) : (
                                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    {repoPath && (
                                      <li 
                                        onClick={() => navigateUp(project.githubRepo)}
                                        style={{ padding: '0.4rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                      >
                                        <FiCornerUpLeft color="var(--accent)" /> ..
                                      </li>
                                    )}
                                    {repoFiles.map((item) => (
                                      <li
                                        key={item.sha}
                                        onClick={() => item.type === 'dir' ? navigateToDir(project.githubRepo, item.path) : fetchFileContent(item.download_url, item.name)}
                                        style={{ padding: '0.4rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                      >
                                        {item.type === 'dir' ? <FiFolder color="var(--accent)" /> : <FiFileText color="var(--text-secondary)" />}
                                        {item.name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tags */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginBottom: '1rem',
                      }}>
                        {project.tags.map((tag) => (
                          <span key={tag} className="skill-tag">{tag}</span>
                        ))}
                      </div>

                      {/* Link & GitHub Icon Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        {project.link && (project.link !== `https://github.com/${project.githubRepo}`) ? (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              color: 'var(--accent)',
                              fontSize: '0.85rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 500,
                              textDecoration: 'none',
                            }}
                            whileHover={{ x: 4 }}
                          >
                            <FiExternalLink />
                            {project.linkLabel || 'View Project'}
                          </motion.a>
                        ) : (
                          <div /> // Spacer if no left link
                        )}

                        {project.githubRepo && (
                          <motion.a
                            href={`https://github.com/${project.githubRepo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '1.25rem',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            whileHover={{ scale: 1.15, color: 'var(--accent)' }}
                            title="View on GitHub"
                          >
                            <FiGithub />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </ScrollReveal>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Hint for adding more */}
        <ScrollReveal delay={0.3}>
          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
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
  )
}
