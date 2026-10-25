import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useSettings from '../../hooks/useSettings'
import './HeroSection.css'

const technologies = [
  { name: 'Laravel', logo: 'laravel', position: 'left-top' },
  { name: 'Angular', logo: 'angular', position: 'right-top' },
  { name: 'Webpack', logo: 'webpack', position: 'left-middle' },
  { name: 'Astro', logo: 'astro', position: 'right-middle' },
  { name: 'React.js', logo: 'react', position: 'left-bottom' },
  { name: 'Node.js', logo: 'nodejs', position: 'right-bottom' },
  { name: 'Android SDK', logo: 'android', position: 'upper-left' },
  { name: 'ASP.NET Core', logo: 'dotnetcore', position: 'upper-right' },
  { name: 'React Native', logo: 'react', position: 'lower-left' },
  { name: 'Express.js', logo: 'express', position: 'lower-right' },
  { name: 'Electron', logo: 'electron', position: 'top-center' },
]

export default function HeroSection({ isAppLoading }) {
  const { loading } = useSettings()
  const sectionRef = useRef(null)
  const subRef = useRef(null)
  const starsRef = useRef(null)

  useEffect(() => {
    const canvas = starsRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let particles = []
    let animationFrame
    let lastTime = 0

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = Math.min(80, Math.max(24, Math.round((width * height) / 18000)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 1.1,
        opacity: 0.2 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.012,
        speedY: (Math.random() - 0.5) * 0.012,
      }))

      if (reducedMotion) draw(0)
    }

    const draw = (time) => {
      const delta = lastTime ? Math.min(time - lastTime, 40) : 0
      lastTime = time
      context.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.x = (particle.x + particle.speedX * delta + width) % width
        particle.y = (particle.y + particle.speedY * delta + height) % height
        const twinkle = 0.72 + Math.sin(time * 0.001 + particle.phase) * 0.28

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(255, 141, 155, ${particle.opacity * twinkle})`
        context.shadowColor = '#ff8d9b'
        context.shadowBlur = particle.radius * 5
        context.fill()
      })

      context.shadowBlur = 0
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!section || reducedMotion || !finePointer) return

    const logos = Array.from(section.querySelectorAll('[data-tech-index]'))
    const radius = 150
    const maxDisplacement = 48
    let animationFrame

    const resetLogos = () => {
      logos.forEach((logo) => {
        logo.style.setProperty('--tech-repel-x', '0px')
        logo.style.setProperty('--tech-repel-y', '0px')
      })
    }

    const updateRepulsion = (pointerX, pointerY) => {
      logos.forEach((logo, index) => {
        const bounds = logo.getBoundingClientRect()
        const deltaX = bounds.left + bounds.width / 2 - pointerX
        const deltaY = bounds.top + bounds.height / 2 - pointerY
        const distance = Math.hypot(deltaX, deltaY)
        const angle = distance === 0 ? (index / logos.length) * Math.PI * 2 : Math.atan2(deltaY, deltaX)
        const displacement = Math.max(0, radius - distance) / radius * maxDisplacement

        logo.style.setProperty('--tech-repel-x', `${Math.cos(angle) * displacement}px`)
        logo.style.setProperty('--tech-repel-y', `${Math.sin(angle) * displacement}px`)
      })
    }

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        updateRepulsion(event.clientX, event.clientY)
      })
    }

    const onPointerLeave = () => {
      window.cancelAnimationFrame(animationFrame)
      resetLogos()
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      resetLogos()
    }
  }, [])

  useEffect(() => {
    if (loading || isAppLoading) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(subRef.current, { autoAlpha: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo('.hero__heading',
        { yPercent: 115, rotateX: -35, autoAlpha: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: 'power4.out'
        }
      )

      tl.fromTo(subRef.current,
        { yPercent: 110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.45'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isAppLoading, loading])

  const displayName = 'लवर्ण एरी'

  return (
    <section ref={sectionRef} className="hero" id="hero-section">
      <canvas ref={starsRef} className="hero__stars" aria-hidden="true" />

      <ul className="hero__tech-orbit" aria-label="Technologies">
        {technologies.map((technology, index) => (
          <li
            className={`hero__tech hero__tech--${technology.position}`}
            aria-label={technology.name}
            data-tech-index={index}
            key={technology.name}
            style={{
              '--tech-delay': `${index * -0.55}s`,
              '--tech-duration': `${5.5 + (index % 4) * 0.7}s`,
            }}
          >
            <img
              className={`hero__tech-icon${['astro', 'express'].includes(technology.logo) ? ' hero__tech-icon--monochrome' : ''}`}
              src={`/technology-logos/${technology.logo}.svg`}
              alt=""
            />
          </li>
        ))}
      </ul>

      <div className="hero__content container">
        <div className="hero__title-wrap">
          <div className="hero__heading-mask">
            <h1 className="hero__heading" aria-label={displayName}>
              <span className="hero__heading-text">{displayName}</span>
            </h1>
          </div>
          <div ref={subRef} className="hero__sub">
            <p className="hero__role">Developer</p>
          </div>
        </div>
      </div>

      <div className="hero__socials" aria-label="Social profiles">
        <a href="https://github.com/lawarnaaree" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/lawarna-aree-032180317/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </section>
  )
}
