import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from '../components/home/HeroSection'
import MarqueeText from '../components/home/MarqueeText'
import FeaturedProjects from '../components/home/FeaturedProjects'
import AboutPreview from '../components/home/AboutPreview'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const mainRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the hero scaling down and fading as the reveal layer scrolls up
      gsap.to('.home-hero-sticky', {
        scale: 0.85,
        opacity: 0,
        y: 80, // push down slightly
        ease: 'none',
        scrollTrigger: {
          trigger: '.home-reveal-layer',
          start: 'top bottom', // When top of reveal layer hits bottom of viewport
          end: 'top top',      // When top of reveal layer hits top of viewport
          scrub: true
        }
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={mainRef} className="home-main">
      <div className="home-hero-sticky">
        <HeroSection />
      </div>
      
      <div className="home-reveal-layer">
        <div className="home-drip-mask">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Liquid shape that fills from the curve down to the bottom */}
            <path d="M0,100 C240,100 240,0 720,0 C1200,0 1200,100 1440,100 L1440,120 L0,120 Z" fill="var(--c-bg)"></path>
          </svg>
        </div>
        <div className="home-reveal-content">
          <MarqueeText />
          <FeaturedProjects />
          <AboutPreview />
        </div>
      </div>
    </main>
  )
}
