import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useSettings from '../hooks/useSettings'
import './About.css'
import me from '../assets/phoksundo1.jpg'

const SKILLS = [
  { category: 'Frontend', items: ['React', 'React Native', 'Flutter', 'Next.js', 'GSAP', 'Three.js'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'Socket.io'] },
  { category: 'Database', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase'] },
  { category: 'Tools', items: ['Git', 'Docker', 'Figma', 'VS Code', 'Linux'] },
]

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { settings, loading } = useSettings()
  const pageRef = useRef(null)

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo('.about__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      )

      // Bio text lines
      gsap.fromTo('.about__bio-text',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.about__bio', start: 'top 75%' }
        }
      )

      // Image parallax
      gsap.to('.about__portrait img', {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about__portrait',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      })

      // Skills stagger
      gsap.fromTo('.about__skill-group',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.about__skills', start: 'top 80%' }
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <main ref={pageRef} className="about-page">
      <section className="about__hero section">
        <div className="container">
          <h1 className="about__heading">
            About<span className="text-accent">.</span>
          </h1>
        </div>
      </section>

      <section className="about__bio section">
        <div className="container">
          <div className="about__bio-grid">
            <div className="about__portrait">
              <img
                src={me}
                alt={settings.full_name || "Lawarna Aree"}
              />
            </div>
            <div className="about__bio-content">
              {settings.bio ? (
                settings.bio.split('\n').map((para, i) => (
                  <p key={i} className="about__bio-text">{para}</p>
                ))
              ) : (
                <>
                  <p className="about__bio-text">
                    I'm {settings.full_name || 'Lawarna Aree'}, a {settings.job_role || 'Cross-Platform Full-Stack Developer'} based in Nepal.
                  </p>
                  <p className="about__bio-text">
                    I specialize in building end-to-end digital solutions that merge thoughtful
                    design with robust engineering.
                  </p>
                </>
              )}
              <a href={settings.resume_url || "/resume.pdf"} className="about__resume-btn" data-cursor="Download" target="_blank" rel="noopener noreferrer">
                Download Resume
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v8M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about__skills section">
        <div className="container">
          <h2 className="about__section-title">Skills & Technologies</h2>
          <div className="about__skills-grid">
            {SKILLS.map(group => (
              <div key={group.category} className="about__skill-group">
                <h3 className="about__skill-category">{group.category}</h3>
                <div className="about__skill-list">
                  {group.items.map(skill => (
                    <span key={skill} className="about__skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
