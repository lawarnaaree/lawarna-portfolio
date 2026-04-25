import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Projects.css'

gsap.registerPlugin(ScrollTrigger)

const ALL_PROJECTS = [
  { id: 1, slug: 'ecommerce-platform', title: 'E-Commerce Platform', tags: ['React', 'Node.js', 'MySQL'], thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
  { id: 2, slug: 'fitness-tracker', title: 'Fitness Tracker App', tags: ['React Native', 'Firebase'], thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
  { id: 3, slug: 'portfolio-cms', title: 'Portfolio CMS', tags: ['Next.js', 'PostgreSQL'], thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80' },
  { id: 4, slug: 'chat-application', title: 'Real-Time Chat', tags: ['Socket.io', 'Express'], thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80' },
  { id: 5, slug: 'task-manager', title: 'Task Manager Pro', tags: ['React', 'Node.js'], thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80' },
  { id: 6, slug: 'weather-app', title: 'Weather Dashboard', tags: ['React', 'API'], thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80' },
]

const ALL_TAGS = ['All', ...new Set(ALL_PROJECTS.flatMap(p => p.tags))]

export default function Projects() {
  const [activeTag, setActiveTag] = useState('All')
  const pageRef = useRef(null)

  const filtered = activeTag === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.tags.includes(activeTag))

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    gsap.fromTo('.projects__card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, [activeTag])

  return (
    <main ref={pageRef} className="projects-page">
      <section className="projects__hero section">
        <div className="container">
          <h1 className="projects__heading">Projects<span className="text-accent">.</span></h1>
          <p className="projects__subtitle">A collection of things I've built and designed.</p>
        </div>
      </section>

      <section className="projects__content section">
        <div className="container">
          <div className="projects__filters">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                className={`projects__filter ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="projects__grid">
            {filtered.map(project => (
              <Link key={project.id} to={`/projects/${project.slug}`} className="projects__card" data-cursor="View">
                <div className="projects__card-img">
                  <img src={project.thumbnail} alt={project.title} loading="lazy" />
                </div>
                <div className="projects__card-body">
                  <h3 className="projects__card-title">{project.title}</h3>
                  <div className="projects__card-tags">
                    {project.tags.map(t => <span key={t} className="projects__card-tag">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
