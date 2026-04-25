import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Journey.css'

gsap.registerPlugin(ScrollTrigger)

const ENTRIES = [
  { id: 1, type: 'work', title: 'Full-Stack Developer', org: 'Freelance', period: '2024 — Present', desc: 'Building custom web and mobile solutions for clients across various industries.' },
  { id: 2, type: 'education', title: 'Computer Science', org: 'University', period: '2020 — 2024', desc: 'Studied software engineering, data structures, algorithms, and modern frameworks.' },
  { id: 3, type: 'achievement', title: 'First Client Project', org: 'E-Commerce', period: '2023', desc: 'Delivered a full-stack e-commerce platform with payment integration and admin panel.' },
  { id: 4, type: 'milestone', title: 'Open Source Contributor', org: 'GitHub', period: '2022', desc: 'Started contributing to open-source projects and building developer tools.' },
  { id: 5, type: 'education', title: 'Self-Taught Developer', org: 'Online Courses', period: '2020', desc: 'Began learning web development through online resources and personal projects.' },
]

const TYPE_ICONS = {
  work: '💼',
  education: '🎓',
  achievement: '🏆',
  milestone: '🚀',
}

export default function Journey() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.journey__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      )

      // Timeline line draw
      gsap.fromTo('.journey__line-fill', 
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.journey__timeline',
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          }
        }
      )

      // Cards slide in alternating
      gsap.utils.toArray('.journey__card').forEach((card, i) => {
        const fromX = i % 2 === 0 ? -60 : 60
        gsap.fromTo(card,
          { x: fromX, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' }
          }
        )
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef} className="journey-page">
      <section className="journey__hero section">
        <div className="container">
          <h1 className="journey__heading">Journey<span className="text-accent">.</span></h1>
          <p className="journey__subtitle">The milestones and experiences that shaped me.</p>
        </div>
      </section>

      <section className="journey__timeline section">
        <div className="container">
          <div className="journey__line">
            <div className="journey__line-fill" />
          </div>

          <div className="journey__entries">
            {ENTRIES.map((entry, i) => (
              <div key={entry.id} className={`journey__card journey__card--${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="journey__card-dot">
                  <span>{TYPE_ICONS[entry.type]}</span>
                </div>
                <div className="journey__card-content">
                  <span className="journey__card-period">{entry.period}</span>
                  <h3 className="journey__card-title">{entry.title}</h3>
                  <p className="journey__card-org">{entry.org}</p>
                  <p className="journey__card-desc">{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
