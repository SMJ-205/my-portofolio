# Sarif Mubdi Jantika — Senior Data Analyst Portfolio

[![Stars](https://img.shields.io/github/stars/SMJ-205/my-portofolio?style=for-the-badge&color=2dd4bf)](https://github.com/SMJ-205/my-portofolio/stargazers)
[![Forks](https://img.shields.io/github/forks/SMJ-205/my-portofolio?style=for-the-badge&color=0d9488)](https://github.com/SMJ-205/my-portofolio/network/members)
[![MIT License](https://img.shields.io/github/license/SMJ-205/my-portofolio?style=for-the-badge&color=115e59)](LICENSE)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B736FF?style=for-the-badge&logo=vite&logoColor=FFD62B)](#)

Source code of my personal portfolio. I'm a **Senior Data Analyst** with 12+ years across accounting, finance, and cross-functional operations, working on **Analytics Engineering, Data Modeling, and Data Governance** with Snowflake, dbt, Apache Airflow, SQL, and Python.

- **Live site:** [www.sarifmj.my.id](https://www.sarifmj.my.id/)
- **Resume:** [HTML](https://www.sarifmj.my.id/resume/) · [PDF](https://www.sarifmj.my.id/assets/resume_sarif_mubdi_jantika.pdf)
- **LinkedIn:** [linkedin.com/in/sarifmj](https://linkedin.com/in/sarifmj)
- **Email:** [sarif.mj@gmail.com](mailto:sarif.mj@gmail.com)

The site is also built to be reused as a template by other data analysts, analytics engineers, and finance professionals. See [Quick Start & Customization](#quick-start--customization).

---

## Features

- **Ambient Matrix Data Stream**: Soft cascading data-rain background canvas that automatically resizes dynamically, optimized for performance on visibility shifts and window zooms.
- **3D Profile Pop-Out & Orbit**: Custom 3D profile picture overlapping the circular container with a smooth orbiting satellite dot, utilizing `-webkit-mask-image` bottom gradients to avoid clipping.
- **Responsive Layouts**: Dedicated desktop grid-based and mobile center-aligned layouts for optimal mobile performance and high desktop fidelity.
- **Spambot-Resistant Social CTAs**: Decodes your business WhatsApp link dynamically on user hover or touch event using Base64 decryption, completely shielding your raw phone number from web scrapers.
- **JSON Configuration Driven**: Entire portfolio content (experiences, projects, skills, education) is fully customizable simply by editing [`portfolio.json`](src/config/portfolio.json).
- **Project Impact Lines**: Each project card leads with a one-line, outcome-first `impact` summary before the technical description.
- **Live Repo Explorer**: Project modals include a code explorer backed by a build-time snapshot of each GitHub repo, re-crawled automatically whenever the repo has new commits.
- **ATS-Friendly HTML Resume**: A text-only resume at `/resume/` is generated from `portfolio.json` at build time, alongside the PDF (whose link is cache-busted by file hash).
- **SEO & GEO Optimized**: Configured with a build-generated XML sitemap, robots.txt rules, Open Graph previews, and inline JSON-LD Person/WebSite Schema markup to maximize index discovery in traditional and AI engines.

---

## Tech Stack

- **Core**: React 19, Vite 8, ES6 JavaScript, HTML5
- **Styling**: Vanilla CSS, Tailwind CSS 4, Framer Motion (for smooth micro-animations and scroll reveals), React Icons
- **Deployment**: GitHub Pages via GitHub Actions, with Custom CNAME (Domain) integration

---

## Quick Start & Customization

If you want to use this template as your own portfolio:

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/SMJ-205/my-portofolio.git
cd my-portofolio

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Customize Content
Open [`src/config/portfolio.json`](src/config/portfolio.json) and replace the values (name, bio, projects, credentials) with your own info:
```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "bio": "Write a short summary about yourself..."
  },
  "projects": [
    {
      "title": "Project Name",
      "impact": "One outcome-first sentence a recruiter can scan.",
      "description": "Longer technical description..."
    }
  ]
}
```

### 4. Mobile Images (optional)
After adding or replacing images in `public/assets/projects/` or `public/assets/profile.png`, regenerate the downscaled WebP copies served to phones (requires `cwebp`, e.g. `brew install webp`):
```bash
npm run images:mobile
```
Images without a mobile copy simply fall back to the original.

### 5. Build and Deploy
```bash
# Build production bundle
npm run build
```
The output will be built into the `dist/` directory, ready to serve or deploy to your static hosting provider (GitHub Pages, Netlify, Vercel).

---

## Recommended GitHub Topics (Hashtags)

To maximize search visibility on GitHub's explore tab, add these hashtags/topics in your repository settings:
`portfolio-website` • `data-analyst` • `analytics-engineering` • `dbt` • `snowflake` • `data-modeling` • `react` • `vite` • `framer-motion` • `interactive-portfolio`

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
