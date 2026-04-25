import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './HeroSection.css'

export default function HeroSection() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.5 }) // after preloader

      // Split heading into characters for reveal
      const heading = headingRef.current
      const text = heading.textContent
      heading.innerHTML = text.split('').map(char =>
        char === ' '
          ? '<span class="hero__char">&nbsp;</span>'
          : `<span class="hero__char">${char}</span>`
      ).join('')

      tl.fromTo('.hero__char',
        { y: '110%', rotateX: -80 },
        {
          y: '0%',
          rotateX: 0,
          duration: 1.2,
          stagger: 0.03,
          ease: 'power4.out'
        }
      )

      tl.fromTo(subRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      )

      // Floating scroll indicator
      gsap.to(scrollRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power1.inOut',
        delay: 4.5
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hero" id="hero-section">

      <div className="hero__content container">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          <span className="hero__badge-text">Available for Work</span>
        </div>

        <h1 ref={headingRef} className="hero__heading">
          Lawarna Aree
        </h1>

        <div ref={subRef} className="hero__sub">
          <p className="hero__role">Cross-Platform Full-Stack Developer</p>
          <p className="hero__desc">
            Crafting digital experiences with precision, creativity, and modern technology.
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  )
}
