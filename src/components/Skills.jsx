import { motion } from 'framer-motion'
import {
  SiPython, SiPostgresql, SiMysql, SiDocker,
  SiGooglesheets, SiSnowflake, SiCanva,
  SiGithub, SiN8N, SiDbt, SiGooglebigquery, SiOpenai
} from 'react-icons/si'
import { FaAws, FaDatabase, FaChartBar as FaTableau } from 'react-icons/fa'
import { TbBrandGoogleBigQuery, TbWindmill, TbChartNodes } from 'react-icons/tb'
import { HiSparkles, HiChartBar, HiCog, HiTable, HiCode, HiLightningBolt, HiPhotograph, HiTerminal } from 'react-icons/hi'
import ScrollReveal from './ScrollReveal'

// Map icon names from config to actual icon components
const iconMap = {
  python: SiPython,
  sql: FaDatabase,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  snowflake: SiSnowflake,
  excel: HiTable,
  googlesheets: SiGooglesheets,
  appscript: HiCode,
  claude: HiSparkles,
  gemini: HiSparkles,
  antigravity: HiLightningBolt,
  github: SiGithub,
  docker: SiDocker,
  aws: FaAws,
  airflow: TbWindmill,
  looker: TbBrandGoogleBigQuery,
  tableau: FaTableau,
  metabase: HiChartBar,
  vscode: HiTerminal,
  photoshop: HiPhotograph,
  canva: SiCanva,
  n8n: SiN8N,
  dbt: SiDbt,
  bigquery: SiGooglebigquery,
  chatgpt: SiOpenai,
  smartpls: TbChartNodes,
}

const categoryIcons = {
  'Languages & Databases': FaDatabase,
  'Spreadsheet & Scripting': HiTable,
  'AI & Assistants': HiSparkles,
  'DevOps & Cloud': SiDocker,
  'Visualization & BI': HiChartBar,
  'Tools & Automation': HiCog,
}

export default function Skills({ config }) {
  return (
    <section id="skills" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">Technologies and tools I work with daily.</p>
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
          gap: '1.5rem',
        }}>
          {config.skills.map((category, catIdx) => {
            const CategoryIcon = categoryIcons[category.category] || HiCog
            return (
              <ScrollReveal key={catIdx} delay={catIdx * 0.1}>
                <motion.div
                  className="glass-card"
                  whileHover={{
                    borderColor: 'var(--border-hover)',
                    boxShadow: 'var(--shadow), var(--shadow-glow)',
                    y: -4,
                  }}
                >
                  {/* Category Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}>
                    <CategoryIcon style={{ color: 'var(--accent)', fontSize: '1.2rem' }} />
                    <h3 style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {category.category}
                    </h3>
                  </div>

                  {/* Skill Icons Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: '0.75rem',
                  }}>
                    {category.items.map((skill, skillIdx) => {
                      const Icon = iconMap[skill.icon] || HiCog
                      return (
                        <motion.div
                          key={skillIdx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.75rem 0.5rem',
                            borderRadius: '10px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            cursor: 'default',
                          }}
                          whileHover={{
                            scale: 1.08,
                            borderColor: 'var(--accent)',
                            boxShadow: '0 0 12px var(--accent-glow)',
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: skillIdx * 0.05, duration: 0.3 }}
                        >
                          <Icon style={{
                            fontSize: '1.5rem',
                            color: 'var(--accent)',
                          }} />
                          <span style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            textAlign: 'center',
                            lineHeight: 1.2,
                          }}>
                            {skill.name}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
