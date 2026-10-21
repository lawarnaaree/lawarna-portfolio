import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useSettings from '../../hooks/useSettings'
import './HeroSection.css'

export default function HeroSection({ isAppLoading }) {
  const { settings, loading } = useSettings()
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
    if (loading || isAppLoading) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(subRef.current, { autoAlpha: 1 })
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo('.hero__char',
        { yPercent: 115, rotateX: -35, autoAlpha: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.055,
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

  const name = (settings.full_name || 'Lawarna Aree').toUpperCase()

  return (
    <section ref={sectionRef} className="hero" id="hero-section">
      <canvas ref={starsRef} className="hero__stars" aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__title-wrap">
          <div className="hero__heading-mask">
            <h1 className="hero__heading" aria-label={settings.full_name || 'Lawarna Aree'}>
              {Array.from(name).map((char, index) => (
                <span className="hero__char" key={`${char}-${index}`}>
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
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
