# 🚀 Interactive 3D Data Analyst & Accountant Portfolio

[![Stars](https://img.shields.io/github/stars/SMJ-205/my-portofolio?style=for-the-badge&color=2dd4bf)](https://github.com/SMJ-205/my-portofolio/stargazers)
[![Forks](https://img.shields.io/github/forks/SMJ-205/my-portofolio?style=for-the-badge&color=0d9488)](https://github.com/SMJ-205/my-portofolio/network/members)
[![MIT License](https://img.shields.io/github/license/SMJ-205/my-portofolio?style=for-the-badge&color=115e59)](LICENSE)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B736FF?style=for-the-badge&logo=vite&logoColor=FFD62B)](#)

A premium, interactive, and lightweight portfolio built specifically for Data Analysts, Engineers, and Finance Professionals. Designed with a dark glassmorphism theme, ambient background physics, and a 3D orbital pop-out layout.

🔗 **Live Demo:** [www.sarifmj.my.id](https://www.sarifmj.my.id/)

---

## ✨ Features

- 🌌 **Ambient Matrix Data Stream**: Soft cascading data-rain background canvas that automatically resizes dynamically, optimized for performance on visibility shifts and window zooms.
- 💫 **3D Profile Pop-Out & Orbit**: Custom 3D profile picture overlapping the circular container with a smooth orbiting satellite dot, utilizing `-webkit-mask-image` bottom gradients to avoid clipping.
- 🎨 **Responsive Layouts**: Dedicated desktop grid-based and mobile center-aligned layouts for optimal mobile performance and high desktop fidelity.
- 🔒 **Spambot-Resistant Social CTAs**: Decodes your business WhatsApp link dynamically on user hover or touch event using Base64 decryption, completely shielding your raw phone number from web scrapers.
- ⚙️ **JSON Configuration Driven**: Entire portfolio content (experiences, projects, skills, education) is fully customizable simply by editing [`portfolio.json`](src/config/portfolio.json).
- 📈 **SEO & GEO Optimized**: Configured with automated XML sitemaps, robots.txt rules, Open Graph previews, and inline JSON-LD Person/WebSite Schema markup to maximize index discovery in traditional and AI engines.

---

## 🛠️ Tech Stack

- **Core**: React 18, Vite 8, ES6 JavaScript, HTML5
- **Styling**: Vanilla CSS, Framer Motion (for smooth micro-animations and scroll reveals), React Icons
- **Deployment**: GitHub Pages with Custom CNAME (Domain) integration

---

## 🚀 Quick Start & Customization

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
  }
}
```

### 4. Build and Deploy
```bash
# Build production bundle
npm run build
```
The output will be built into the `dist/` directory, ready to serve or deploy to your static hosting provider (GitHub Pages, Netlify, Vercel).

---

## 🏷️ Recommended GitHub Topics (Hashtags)

To maximize search visibility on GitHub's explore tab, add these hashtags/topics in your repository settings:
`react` • `vite` • `portfolio-website` • `data-analyst` • `accountant` • `glassmorphism` • `interactive-portfolio` • `data-science` • `framer-motion` • `modern-ui`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
