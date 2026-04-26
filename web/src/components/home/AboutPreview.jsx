import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../../utils/api'
import './AboutPreview.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutPreview() {
  const [about, setAbout] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('/general/about');
        setAbout(response.data.data);
      } catch (error) {
        console.error('Failed to fetch about info:', error);
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-preview__text',
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-preview__text', start: 'top 80%' }
        }
      )

      gsap.fromTo('.about-preview__stat',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-preview__stats', start: 'top 80%' }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const STATS = [
    { value: '3+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Completed' },
    { value: '10+', label: 'Technologies' },
    { value: '100%', label: 'Passion' },
  ]

  return (
    <section ref={sectionRef} className="about-preview section" id="about-preview">
      <div className="container">
        <div className="about-preview__grid">
          <div className="about-preview__left">
            <p className="about-preview__label">About Me</p>
            <h2 className="about-preview__text">
              {about?.bio || "I build digital products that live at the intersection of design and technology — bringing ideas from concept to production."}
            </h2>
            <Link to="/about" className="about-preview__cta" data-cursor="Read More">
              More About Me
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="about-preview__stats">
            {STATS.map(stat => (
              <div key={stat.label} className="about-preview__stat">
                <span className="about-preview__stat-value">{stat.value}</span>
                <span className="about-preview__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
