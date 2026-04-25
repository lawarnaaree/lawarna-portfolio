import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './FeaturedProjects.css'

gsap.registerPlugin(ScrollTrigger)

// Placeholder projects - will be replaced with API data
const PROJECTS = [
  {
    id: 1,
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    tags: ['React', 'Node.js', 'MySQL'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    size: 'large',
  },
  {
    id: 2,
    slug: 'fitness-tracker',
    title: 'Fitness Tracker App',
    tags: ['React Native', 'Firebase'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    size: 'small',
  },
  {
    id: 3,
    slug: 'portfolio-cms',
    title: 'Portfolio CMS',
    tags: ['Next.js', 'PostgreSQL'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    size: 'wide',
  },
  {
    id: 4,
    slug: 'chat-application',
    title: 'Real-Time Chat',
    tags: ['Socket.io', 'Express'],
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    size: 'medium',
  },
]

export default function FeaturedProjects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title reveal
      gsap.fromTo('.fp__title',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.fp__title', start: 'top 85%' }
        }
      )

      // Staggered card reveals with clipPath
      gsap.utils.toArray('.fp__card').forEach((card, i) => {
        gsap.fromTo(card,
          { clipPath: 'inset(100% 0 0 0)', y: 40 },
          {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="fp section" id="featured-projects">
      <div className="container">
        <div className="fp__header">
          <h2 className="fp__title">Selected Work</h2>
          <Link to="/projects" className="fp__view-all" data-cursor="View">
            View All Projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="fp__grid">
          {PROJECTS.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className={`fp__card fp__card--${project.size}`}
              data-cursor="View"
            >
              <div className="fp__card-image">
                <img src={project.thumbnail} alt={project.title} loading="lazy" />
              </div>
              <div className="fp__card-info">
                <h3 className="fp__card-title">{project.title}</h3>
                <div className="fp__card-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="fp__tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
