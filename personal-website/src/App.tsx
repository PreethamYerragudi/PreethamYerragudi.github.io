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
  const galleryRef = useRef<HTMLDivElement>(null)
  const autoScrollPaused = useRef(false)
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
    const gallery = galleryRef.current
    if (!gallery) return
    let rafId: number

    // Duplicate children for seamless loop
    const originalContent = gallery.innerHTML
    gallery.innerHTML = originalContent + originalContent
    const halfScroll = gallery.scrollWidth / 2

    const speed = 0.5

    const tick = () => {
      if (!autoScrollPaused.current) {
        gallery.scrollLeft += speed
        if (gallery.scrollLeft >= halfScroll) {
          gallery.scrollLeft = 0
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    let resumeTimeout: number
    const scheduleResume = () => {
      clearTimeout(resumeTimeout)
      resumeTimeout = window.setTimeout(() => { autoScrollPaused.current = false }, 500)
    }

    const onPointerEnter = () => { autoScrollPaused.current = true }
    const onPointerLeave = () => { scheduleResume() }
    const onWheel = () => { autoScrollPaused.current = true; scheduleResume() }

    gallery.addEventListener('pointerenter', onPointerEnter)
    gallery.addEventListener('pointerleave', onPointerLeave)
    gallery.addEventListener('wheel', onWheel, { passive: true })
    gallery.addEventListener('touchstart', onPointerEnter)
    gallery.addEventListener('touchend', onPointerLeave)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resumeTimeout)
      gallery.removeEventListener('pointerenter', onPointerEnter)
      gallery.removeEventListener('pointerleave', onPointerLeave)
      gallery.removeEventListener('wheel', onWheel)
      gallery.removeEventListener('touchstart', onPointerEnter)
      gallery.removeEventListener('touchend', onPointerLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const stars: { x: number; y: number; size: number; alpha: number; twinkleSpeed: number; phase: number }[] = []
    const shootingStars: { x: number; y: number; len: number; speed: number; alpha: number; angle: number; life: number; maxLife: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create static stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.6,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const spawnShootingStar = () => {
      const angle = Math.random() * 0.4 + 0.3
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 4 + 3,
        alpha: 1,
        angle,
        life: 0,
        maxLife: Math.random() * 80 + 60,
      })
    }

    const sectionColors = sections.map(s => {
      const hex = s.color
      return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    })

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const idx = activeSectionIndex.current
      const [r, g, b] = sectionColors[idx]
      frame++

      // Spawn shooting stars only on homepage
      if (frame % 240 === 0 && (scrollProgress.current < 0.8 || activeSectionIndex.current === sections.length - 1)) spawnShootingStar()

      // Draw twinkling stars
      for (const s of stars) {
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.phase) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.alpha * twinkle})`
        ctx.fill()
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.life++
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.alpha = 1 - ss.life / ss.maxLife

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1)
          continue
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len
        const tailY = ss.y - Math.sin(ss.angle) * ss.len
        const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${ss.alpha})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Bright head
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`
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

      <nav className={`nav ${pastHero ? 'nav-hidden' : ''}`}>
        <a href="#education">Education</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
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
          <img src="/profile.jpeg" alt="Preetham" className="avatar-placeholder" />
        </div>
        <div className="hero-badge">Software Engineer</div>
        <h1>
          Hi, I'm <span className="accent">Preetham</span>
        </h1>
        <p className="hero-sub">
          I build elegant, high-performance digital experiences.
        </p>
        <div className="hero-cta">
          <a href="#experience" className="btn-primary">View My Work</a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
        </div>
      </main>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>

      <section id="education" className="education">
        <h2 className="section-title reveal-child">Education</h2>

        <div className="edu-hero-card reveal-child">
          <img src="/purdue.jpg" className="edu-img-placeholder" alt="Purdue University campus" />
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
                <img src="/club-1.png" alt="Purdue Hackers" className="club-logo" />
                <span>Purdue Hackers</span>
              </div>
              <div className="club-item">
                <img src="/club-2.png" alt="ACM" className="club-logo" />
                <span>ACM</span>
              </div>
              <div className="club-item">
                <img src="/club-3.png" alt="Blockchain" className="club-logo" />
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
            <div className="exp-connector" />
            <div className="exp-content">
              <div className="exp-header">
                <img src="/amazon_logo.jpg" alt="Company" className="exp-logo" />
                <div>
                  <h3>Amazon</h3>
                  <p>Software Development Engineer Intern</p>
                </div>
                <span className="exp-date">May 2026 - August 2026</span>
              </div>
              <p className="exp-desc">Built scalable microservices and improved API response times by 40%. Collaborated with cross-functional teams to deliver features on schedule.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-connector" />
            <div className="exp-content">
              <div className="exp-header">
                <img src="/company-2.png" alt="Company" className="exp-logo" />
                <div>
                  <h3>Costco</h3>
                  <p>Machine Learning Researcher</p>
                </div>
                <span className="exp-date">August 2025 - December 2025</span>
              </div>
              <p className="exp-desc">Developed full-stack features using React and Node.js. Designed and implemented a real-time data pipeline processing millions of events daily.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-connector" />
            <div className="exp-content">
              <div className="exp-header">
                <img src="/company-3.png" alt="Company" className="exp-logo" />
                <div>
                  <h3>OneAmerica Financial</h3>
                  <p>Data Engineering Intern</p>
                </div>
                <span className="exp-date">May 2025 - December 2025</span>
              </div>
              <p className="exp-desc">Created internal tooling that reduced deployment time by 60%. Wrote comprehensive unit and integration tests for critical services.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-connector" />
            <div className="exp-content">
              <div className="exp-header">
                <img src="/company-4.png" alt="Company" className="exp-logo" />
                <div>
                  <h3>Indiana University</h3>
                  <p>Research Assistant</p>
                </div>
                <span className="exp-date">Spring 2023</span>
              </div>
              <p className="exp-desc">Description of work completed at this role.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-connector" />
            <div className="exp-content">
              <div className="exp-header">
                <img src="/company-5.png" alt="Company" className="exp-logo" />
                <div>
                  <h3>Company Name</h3>
                  <p>Software Engineer Intern</p>
                </div>
                <span className="exp-date">Summer 2022</span>
              </div>
              <p className="exp-desc">Description of work completed at this role.</p>
            </div>
          </div>
          <div className="exp-item reveal-child">
            <div className="exp-connector" />
            <div className="exp-content">
              <div className="exp-header">
                <img src="/company-6.png" alt="Company" className="exp-logo" />
                <div>
                  <h3>Company Name</h3>
                  <p>Software Engineer Intern</p>
                </div>
                <span className="exp-date">Spring 2022</span>
              </div>
              <p className="exp-desc">Description of work completed at this role.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <h2 className="section-title reveal-child">Projects</h2>
        <div ref={galleryRef} className="projects-gallery reveal-child">
          <div className="project-card">
            <div className="project-img" />
            <div className="project-info">
              <h3>Project Name</h3>
              <p>A brief description of what this project does and the problem it solves.</p>
              <div className="project-tags">
                <span style={{ '--tag-color': '#61dafb' } as React.CSSProperties}>React</span>
                <span style={{ '--tag-color': '#3178c6' } as React.CSSProperties}>TypeScript</span>
                <span style={{ '--tag-color': '#68a063' } as React.CSSProperties}>Node.js</span>
              </div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
            </div>
          </div>
          <div className="project-card">
            <div className="project-img" />
            <div className="project-info">
              <h3>Project Name</h3>
              <p>A brief description of what this project does and the problem it solves.</p>
              <div className="project-tags">
                <span style={{ '--tag-color': '#3776ab' } as React.CSSProperties}>Python</span>
                <span style={{ '--tag-color': '#ff6f00' } as React.CSSProperties}>TensorFlow</span>
                <span style={{ '--tag-color': '#ff9900' } as React.CSSProperties}>AWS</span>
              </div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
            </div>
          </div>
          <div className="project-card">
            <div className="project-img" />
            <div className="project-info">
              <h3>Project Name</h3>
              <p>A brief description of what this project does and the problem it solves.</p>
              <div className="project-tags">
                <span style={{ '--tag-color': '#dea584' } as React.CSSProperties}>Rust</span>
                <span style={{ '--tag-color': '#654ff0' } as React.CSSProperties}>WebAssembly</span>
              </div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
            </div>
          </div>
          <div className="project-card">
            <div className="project-img" />
            <div className="project-info">
              <h3>Project Name</h3>
              <p>A brief description of what this project does and the problem it solves.</p>
              <div className="project-tags">
                <span style={{ '--tag-color': '#00add8' } as React.CSSProperties}>Go</span>
                <span style={{ '--tag-color': '#2496ed' } as React.CSSProperties}>Docker</span>
                <span style={{ '--tag-color': '#326ce5' } as React.CSSProperties}>Kubernetes</span>
              </div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="project-link">View on GitHub →</a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <h2 className="section-title reveal-child">Contact</h2>
        <div className="contact-layout reveal-child">
          <form className="contact-form" action="https://formsubmit.co/your@email.com" method="POST">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" rows={5} required />
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
          <div className="contact-socials">
            <p>Or find me on</p>
            <div className="social-icons">
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
