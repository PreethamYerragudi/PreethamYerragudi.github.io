import { useEffect, useRef, useState } from 'react'
import './App.css'

const sections = [
  { id: 'home', label: 'Home', color: '#a855f7' },
  { id: 'education', label: 'Education', color: '#a855f7' },
  { id: 'experience', label: 'Experience', color: '#a855f7' },
  { id: 'projects', label: 'Projects', color: '#a855f7' },
  { id: 'contact', label: 'Contact', color: '#a855f7' },
]

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const scrollProgress = useRef(0)
  const activeSectionIndex = useRef(0)
  const [pastHero, setPastHero] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = window.innerHeight
      const progress = Math.min(window.scrollY / maxScroll, 1)
      scrollProgress.current = progress

      setPastHero(window.scrollY > maxScroll * 0.8)

      // Determine active section
      let current = 'home'
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = s.id
        }
      }
      setActiveSection(current)
      activeSectionIndex.current = sections.findIndex(s => s.id === current)

      if (heroRef.current) {
        heroRef.current.style.opacity = `${1 - progress}`
        heroRef.current.style.transform = `translateY(${progress * -60}px) scale(${1 - progress * 0.05})`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Stagger children
            const children = entry.target.querySelectorAll('.reveal-child')
            children.forEach((child, i) => {
              ;(child as HTMLElement).style.transitionDelay = `${i * 0.15}s`
              child.classList.add('child-visible')
            })
          }
        }
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.education, .section').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      })
    }

    const sectionColors = sections.map(s => {
      const hex = s.color
      return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const idx = activeSectionIndex.current
      const [r, g, b] = sectionColors[idx]

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.15 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="homepage">
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <nav className={`nav ${pastHero ? 'nav-hidden' : ''}`}>
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>

      <nav className={`timeline-nav ${pastHero ? 'timeline-visible' : ''}`} aria-label="Section navigation">
        <div className="timeline-line" aria-hidden="true">
          <div
            className="timeline-progress"
            style={{
              height: `${(sections.findIndex(s => s.id === activeSection) / (sections.length - 1)) * 100}%`,
              background: sections.find(s => s.id === activeSection)?.color,
              boxShadow: `0 0 8px ${sections.find(s => s.id === activeSection)?.color}99`,
            }}
          />
        </div>
        {sections.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`timeline-dot ${activeSection === s.id ? 'active' : ''}`}
            style={{
              '--dot-color': s.color,
            } as React.CSSProperties}
          >
            <span className="dot" />
            <span className="timeline-label">{s.label}</span>
          </a>
        ))}
      </nav>

      <main id="home" ref={heroRef} className="hero">
        <div className="hero-avatar">
          <div className="avatar-placeholder" />
        </div>
        <div className="hero-badge">Software Engineer</div>
        <h1>
          Hi, I'm <span className="accent">Preetham</span>
        </h1>
        <p className="hero-sub">
          I build elegant, high-performance digital experiences.
        </p>
        <div className="hero-cta">
          <a href="#work" className="btn-primary">View My Work</a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
        </div>
      </main>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>

      <section id="education" className="education">
        <h2 className="section-title reveal-child">Education</h2>

        <div className="edu-hero-card reveal-child">
          <div className="edu-img-placeholder">
            <span>Campus Photo</span>
          </div>
          <div className="edu-hero-info">
            <h3>Purdue University</h3>
            <p>Computer Science</p>
            <p className="edu-courses">DS&A · Systems Programming · OS · Software Engineering · Databases · Computer Architecture</p>
          </div>
        </div>

        <div className="edu-gallery">
          <div className="edu-clubs-card reveal-child">
            <h4>Organizations</h4>
            <div className="clubs-grid">
              <div className="club-item">
                <div className="club-logo" />
                <span>Purdue Hackers</span>
              </div>
              <div className="club-item">
                <div className="club-logo" />
                <span>ACM</span>
              </div>
              <div className="club-item">
                <div className="club-logo" />
                <span>Blockchain</span>
              </div>
            </div>
          </div>
          <div className="edu-awards-card reveal-child">
            <h4>Awards</h4>
            <ul className="awards-list">
              <li>🎗️ Dean's List</li>
              <li>🎗️ Hackathon Winner</li>
              <li>🎗️ CS Scholarship</li>
              <li>🎗️ Research Grant</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <h2 className="section-title reveal-child">Experience</h2>
        <div className="exp-timeline">
          <div className="exp-item reveal-child">
            <div className="exp-logo" />
            <div className="exp-connector" />
            <div className="exp-content">
              <span className="exp-date">Summer 2025</span>
              <h3>Company Name</h3>
              <p>Software Engineer Intern</p>
              <p className="exp-desc">Built scalable microservices and improved API response times by 40%. Collaborated with cross-functional teams to deliver features on schedule.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-logo" />
            <div className="exp-connector" />
            <div className="exp-content">
              <span className="exp-date">Summer 2024</span>
              <h3>Company Name</h3>
              <p>Software Engineer Intern</p>
              <p className="exp-desc">Developed full-stack features using React and Node.js. Designed and implemented a real-time data pipeline processing millions of events daily.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-logo" />
            <div className="exp-connector" />
            <div className="exp-content">
              <span className="exp-date">Summer 2023</span>
              <h3>Company Name</h3>
              <p>Software Engineer Intern</p>
              <p className="exp-desc">Created internal tooling that reduced deployment time by 60%. Wrote comprehensive unit and integration tests for critical services.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <h2 className="section-title reveal-child">Projects</h2>
        <div className="placeholder-content">
          <div className="placeholder-card reveal-child" />
          <div className="placeholder-card reveal-child" />
          <div className="placeholder-card reveal-child" />
        </div>
      </section>

      <section id="contact" className="section">
        <h2 className="section-title reveal-child">Contact</h2>
        <div className="placeholder-content">
          <div className="placeholder-card wide reveal-child" />
        </div>
      </section>
    </div>
  )
}

export default App
