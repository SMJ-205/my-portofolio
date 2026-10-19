import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const CONFIG_PATH = path.resolve('src/config/portfolio.json')
const PUBLIC_DIR = path.resolve('public')

const readConfig = () => JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Short content hash of the resume PDF, used as a cache-busting query string
export function getResumeVersion() {
  const { profile } = readConfig()
  const pdfPath = path.join(PUBLIC_DIR, profile.resumeUrl)
  if (!fs.existsSync(pdfPath)) return 'dev'
  return crypto.createHash('md5').update(fs.readFileSync(pdfPath)).digest('hex').slice(0, 8)
}

function renderSitemap(siteUrl) {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = [
    { loc: siteUrl, changefreq: 'monthly', priority: '1.0' },
    { loc: `${siteUrl}resume/`, changefreq: 'monthly', priority: '0.8' },
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
}

// ATS-friendly, single-column HTML resume generated from portfolio.json
function renderResume(config, resumeVersion) {
  const { meta, profile, stats = [], experience = [], projects = [], education = [], skills = [] } = config
  const siteUrl = meta.siteUrl
  const pdfUrl = `/${profile.resumeUrl}?v=${resumeVersion}`
  const headline = meta.description
  const location = experience[0]?.roles[0]?.location || ''

  const experienceHtml = experience.map(company => company.roles.map(role => `
      <article class="entry">
        <h3>${escapeHtml(role.title)} · ${escapeHtml(company.company)}</h3>
        <p class="meta">${escapeHtml(role.startDate)} – ${escapeHtml(role.endDate)} · ${escapeHtml(role.type)} · ${escapeHtml(role.location)}${role.workMode && role.workMode !== role.location ? ` (${escapeHtml(role.workMode)})` : ''}</p>
        <ul>
          ${role.description.map(d => `<li>${escapeHtml(d)}</li>`).join('\n          ')}
        </ul>
        ${role.skills?.length ? `<p class="skills"><strong>Skills:</strong> ${role.skills.map(escapeHtml).join(', ')}</p>` : ''}
      </article>`).join('')).join('')

  const projectsHtml = projects.map(p => {
    const links = [
      p.githubRepo && `<a href="https://github.com/${escapeHtml(p.githubRepo)}">GitHub</a>`,
      p.link && !p.link.includes('github.com') && `<a href="${escapeHtml(p.link)}">${escapeHtml(p.linkLabel || 'Live')}</a>`,
    ].filter(Boolean)
    return `
      <article class="entry">
        <h3>${escapeHtml(p.title)}</h3>
        ${p.impact ? `<p><strong>Impact:</strong> ${escapeHtml(p.impact)}</p>` : ''}
        <p>${escapeHtml(p.description)}</p>
        <p class="skills"><strong>Stack:</strong> ${p.tags.map(escapeHtml).join(', ')}${links.length ? ` · ${links.join(' · ')}` : ''}</p>
      </article>`
  }).join('')

  const educationHtml = education.map(e => `
      <article class="entry">
        <h3>${escapeHtml(e.degree)}, ${escapeHtml(e.field)} · ${escapeHtml(e.institution)}</h3>
        <p class="meta">${escapeHtml(e.startYear)} – ${escapeHtml(e.endYear)}</p>
        ${e.thesis ? `<p>Thesis: ${e.thesisLink ? `<a href="${escapeHtml(e.thesisLink)}">${escapeHtml(e.thesis)}</a>` : escapeHtml(e.thesis)}</p>` : ''}
      </article>`).join('')

  const skillsHtml = skills.map(s => `
        <li><strong>${escapeHtml(s.category)}:</strong> ${s.items.map(i => escapeHtml(i.name)).join(', ')}</li>`).join('')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume | ${escapeHtml(profile.name)}, ${escapeHtml(headline)}</title>
    <meta name="description" content="Resume of ${escapeHtml(profile.name)}: ${escapeHtml(headline)}. Experience, projects, education, and skills." />
    <meta name="author" content="${escapeHtml(profile.name)}" />
    <link rel="canonical" href="${siteUrl}resume/" />
    <link rel="icon" type="image/png" href="/assets/favicon.png" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${siteUrl}resume/" />
    <meta property="og:title" content="Resume | ${escapeHtml(profile.name)}" />
    <meta property="og:description" content="${escapeHtml(headline)}" />
    <meta property="og:image" content="${siteUrl}${profile.photo}" />
    <style>
      :root { --bg: #ffffff; --text: #1e293b; --muted: #475569; --accent: #0d9488; --border: #e2e8f0; }
      @media (prefers-color-scheme: dark) {
        :root { --bg: #0b1120; --text: #e2e8f0; --muted: #94a3b8; --accent: #2dd4bf; --border: #1e293b; }
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.55; }
      main { max-width: 820px; margin: 0 auto; padding: 2.5rem 1rem 4rem; }
      a { color: var(--accent); }
      h1 { font-size: 2rem; margin: 0; }
      h2 { font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; margin: 2rem 0 0.75rem; }
      h3 { font-size: 1rem; margin: 0; }
      p, ul { margin: 0.35rem 0; }
      ul { padding-left: 1.2rem; }
      .headline { font-size: 1.05rem; color: var(--muted); margin-top: 0.25rem; }
      .contact { color: var(--muted); font-size: 0.92rem; }
      .actions { margin-top: 0.75rem; font-size: 0.92rem; }
      .entry { margin-bottom: 1.1rem; }
      .meta, .skills { color: var(--muted); font-size: 0.88rem; }
      @media print {
        :root { --bg: #fff; --text: #000; --muted: #333; --accent: #000; --border: #999; }
        .actions { display: none; }
        main { padding: 0; }
        a { text-decoration: none; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>${escapeHtml(profile.name)}</h1>
        <p class="headline">${escapeHtml(headline)}</p>
        <p class="contact">
          ${escapeHtml(location)} ·
          <a href="mailto:${escapeHtml(profile.social.email)}">${escapeHtml(profile.social.email)}</a> ·
          <a href="${escapeHtml(profile.social.linkedin)}">${escapeHtml(profile.social.linkedin.replace(/^https?:\/\//, ''))}</a> ·
          <a href="${escapeHtml(profile.social.github)}">${escapeHtml(profile.social.github.replace(/^https?:\/\//, ''))}</a> ·
          <a href="${siteUrl}">${escapeHtml(siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>
        </p>
        <p class="actions"><a href="${pdfUrl}">Download PDF</a> · <a href="/">View interactive portfolio</a> · <a href="javascript:window.print()">Print</a></p>
      </header>

      <section>
        <h2>Summary</h2>
        <p>${escapeHtml(profile.bio)}</p>
        ${profile.bioExtended ? `<p>${escapeHtml(profile.bioExtended)}</p>` : ''}
      </section>

      ${stats.length ? `<section>
        <h2>Key Impact</h2>
        <ul>
          ${stats.map(s => `<li><strong>${escapeHtml(s.label)} (${escapeHtml(s.number)}):</strong> ${escapeHtml(s.context)}</li>`).join('\n          ')}
        </ul>
      </section>` : ''}

      <section>
        <h2>Experience</h2>${experienceHtml}
      </section>

      <section>
        <h2>Projects</h2>${projectsHtml}
      </section>

      <section>
        <h2>Education</h2>${educationHtml}
      </section>

      <section>
        <h2>Skills</h2>
        <ul>${skillsHtml}
        </ul>
      </section>
    </main>
  </body>
</html>
`
}

export default function staticPages() {
  return {
    name: 'static-pages',

    // Serve /resume/ during `vite dev`
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0]
        if (url !== '/resume' && url !== '/resume/') return next()
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(renderResume(readConfig(), getResumeVersion()))
      })
    },

    // Emit /resume/index.html and /sitemap.xml into dist on build
    generateBundle() {
      const config = readConfig()
      this.emitFile({ type: 'asset', fileName: 'resume/index.html', source: renderResume(config, getResumeVersion()) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap(config.meta.siteUrl) })
    },
  }
}
