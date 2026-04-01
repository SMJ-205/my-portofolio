import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiTag, FiFolder, FiFileText, FiCornerUpLeft, FiCode, FiGithub, FiX } from 'react-icons/fi'
import { FaChartBar as FaTableau } from 'react-icons/fa'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ScrollReveal from './ScrollReveal'

const BASE = import.meta.env.BASE_URL

export default function Projects({ config }) {
  const [activeTag, setActiveTag] = useState('All')
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState(null)
  
  // GitHub Browser States (scoped to the modal)
  const [repoPath, setRepoPath] = useState('')
  const [repoFiles, setRepoFiles] = useState([])
  const [repoLoading, setRepoLoading] = useState(false)
  const [repoError, setRepoError] = useState(null)
  
  const [activeFile, setActiveFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [fileLoading, setFileLoading] = useState(false)

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

  const openProject = (project) => {
    setSelectedProject(project)
    if (project.githubRepo) {
      setRepoPath('')
      setActiveFile(null)
      fetchRepoContents(project.githubRepo, '')
    }
  }

  const closeProject = () => {
    setSelectedProject(null)
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
    <>
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
                return (
                  <motion.div
                    key={project.title}
                    layoutId={`card-wrapper-${project.title}`}
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
              background: 'rgba(0, 0, 0, 0.85)',
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
              layoutId={`card-wrapper-${selectedProject.title}`}
              onClick={(e) => e.stopPropagation()} // Stop bubbling so click doesn't close modal
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '1100px',
                maxHeight: '90vh',
                overflowY: 'auto',
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

              {/* Massive Hero Image Background */}
              {selectedProject.image && (
                <div className="flex relative w-full h-[220px] md:h-[400px] justify-center overflow-hidden bg-black">
                  <img src={`${BASE}${selectedProject.image}`} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                  {/* Dark Gradient Overlay Fade */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10, 13, 19, 0) 0%, rgba(10, 13, 19, 0.95) 75%, var(--bg) 100%)' }} />
                </div>
              )}

              {/* Modal Body */}
              <div 
                className="flex-1 relative z-10" 
                style={{ 
                  background: 'var(--bg)', 
                  borderRadius: '0 0 16px 16px',
                  padding: 'clamp(2.5rem, 5vw, 4rem)' 
                }}
              >
                
                {/* Header Row */}
                <div className={`flex flex-col md:flex-row md:justify-between items-start md:items-center flex-wrap gap-5 mb-8 relative mt-0`}>
                  <div>
                    <h2 style={{ fontSize: 'var(--font-xl, 2.2rem)', fontWeight: 800, color: '#fff', textShadow: '0 2px 15px rgba(0,0,0,0.9)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                      {selectedProject.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selectedProject.tags.map(tag => <span key={tag} className="skill-tag" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.15)' }}>{tag}</span>)}
                    </div>
                  </div>

                  {/* External Action Links */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {selectedProject.link && (selectedProject.link !== `https://github.com/${selectedProject.githubRepo}`) && (!selectedProject.tableauLink || selectedProject.link !== selectedProject.tableauLink) && (
                      <motion.a 
                        href={selectedProject.link} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', border: '1px solid var(--accent)', padding: '0.6rem 1.25rem', borderRadius: '8px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'none', background: 'rgba(0,0,0,0.5)', marginRight: '0.5rem' }}
                        whileHover={{ background: 'var(--accent)', color: 'var(--bg)' }}
                      >
                        <FiExternalLink /> {selectedProject.linkLabel || 'View Full Project'}
                      </motion.a>
                    )}
                    {selectedProject.tableauLink && (
                      <motion.a 
                        href={selectedProject.tableauLink} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: '#e97b33', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid #e97b33', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', marginRight: '0.5rem' }}
                        whileHover={{ filter: 'brightness(1.1)' }}
                      >
                        <FaTableau /> {selectedProject.linkLabel || 'View Vizzes'}
                      </motion.a>
                    )}
                    {selectedProject.githubRepo && (
                      <motion.a 
                        href={`https://github.com/${selectedProject.githubRepo}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: '#333', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid #444', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', marginRight: '1rem' }}
                        whileHover={{ filter: 'brightness(1.2)' }}
                      >
                        <FiGithub /> Source Code
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  marginBottom: '2.5rem',
                  marginTop: '0.5rem',
                  position: 'relative',
                  textAlign: 'justify',
                  textJustify: 'inter-word'
                }}>
                  {selectedProject.description}
                </p>

                {/* Live IDE Repo Explorer */}
                {selectedProject.githubRepo && (
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', background: '#0e1117', overflow: 'hidden' }}>
                    {/* IDE Header */}
                    <div style={{ padding: '0.75rem 1rem', background: '#161b22', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <FiCode color="var(--accent)" />
                      <span>{selectedProject.githubRepo}</span>
                      {repoPath && <span style={{ color: 'var(--accent)' }}>/ {repoPath}</span>}
                    </div>

                    {/* IDE Content Provider */}
                    <div style={{ overflowY: 'auto', minHeight: '300px', maxHeight: '500px', padding: '0.5rem 0' }}>
                      {repoLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>Loading GitHub Environment...</div>
                      ) : repoError ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#ff6b6b', fontSize: '0.9rem' }}>{repoError}</div>
                      ) : activeFile ? (
                        <div>
                          <button 
                            onClick={() => setActiveFile(null)}
                            style={{ background: '#1f242d', border: 'none', color: 'var(--text-primary)', padding: '0.75rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', width: '100%', textAlign: 'left', borderBottom: '1px solid var(--border)' }}
                          >
                            <FiCornerUpLeft color="var(--accent)" /> Back to Files ({activeFile})
                          </button>
                          {fileLoading ? (
                              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>Reading Deep Storage File...</div>
                          ) : (
                              <SyntaxHighlighter
                              language={activeFile.split('.').pop() === 'py' ? 'python' : activeFile.split('.').pop() === 'js' ? 'javascript' : activeFile.split('.').pop()}
                              style={atomDark}
                              customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.85rem', background: 'transparent' }}
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
                              onClick={() => item.type === 'dir' ? navigateToDir(selectedProject.githubRepo, item.path) : fetchFileContent(item.download_url, item.name)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
