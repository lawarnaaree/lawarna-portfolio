import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../../utils/api'
import { getFileUrl } from '../../utils/helpers'
import './FeaturedProjects.css'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/projects');
        const featured = response.data.data
          .filter(p => p.is_featured === 1)
          .slice(0, 4); // Show top 4 featured
        setProjects(featured);
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (loading) return;

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
      gsap.utils.toArray('.fp__card').forEach((card) => {
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
  }, [loading])

  if (loading) return null;

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
          {projects.map((project, i) => {
            // Determine size based on index or property if available
            const sizes = ['large', 'small', 'wide', 'medium'];
            const size = sizes[i % sizes.length];
            
            return (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className={`fp__card fp__card--${size}`}
                data-cursor="View"
              >
                <div className="fp__card-image">
                  <img src={getFileUrl(project.thumbnail)} alt={project.title} loading="lazy" />
                </div>
                <div className="fp__card-info">
                  <h3 className="fp__card-title">{project.title}</h3>
                  <div className="fp__card-tags">
                    {project.tags && project.tags.map(tag => (
                      <span key={tag} className="fp__tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
