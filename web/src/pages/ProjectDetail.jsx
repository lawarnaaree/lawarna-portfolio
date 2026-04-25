import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const pageRef = useRef(null)

  // Placeholder - will be replaced with API fetch
  const project = {
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'A comprehensive full-stack application built with modern technologies. This project showcases responsive design, real-time features, and a seamless user experience.',
    tags: ['React', 'Node.js', 'MySQL'],
    liveUrl: '#',
    githubUrl: '#',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    ]
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pd__cover img', { scale: 1.2 }, { scale: 1, duration: 1.5, ease: 'power3.out' })
      gsap.fromTo('.pd__title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.3 })
      gsap.fromTo('.pd__meta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      gsap.fromTo('.pd__body', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 })
    }, pageRef)
    return () => ctx.revert()
  }, [slug])

  return (
    <main ref={pageRef} className="pd-page">
      <div className="pd__cover">
        <img src={project.coverImage} alt={project.title} />
      </div>

      <div className="container">
        <div className="pd__header section">
          <Link to="/projects" className="pd__back">&larr; All Projects</Link>
          <h1 className="pd__title">{project.title}</h1>
          <div className="pd__meta">
            <div className="pd__tags">
              {project.tags.map(t => <span key={t} className="pd__tag">{t}</span>)}
            </div>
            <div className="pd__links">
              <a href={project.liveUrl} className="pd__link-btn" target="_blank" rel="noopener noreferrer">Live Site ↗</a>
              <a href={project.githubUrl} className="pd__link-btn pd__link-btn--outline" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
          </div>
        </div>

        <div className="pd__body section">
          <p>{project.description}</p>
        </div>

        <div className="pd__gallery section">
          {project.images.map((img, i) => (
            <div key={i} className="pd__gallery-img">
              <img src={img} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
