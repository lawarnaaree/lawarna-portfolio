import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../utils/api'
import { getFileUrl } from '../utils/helpers'
import './Projects.css'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [tags, setTags] = useState(['All'])
  const [activeTag, setActiveTag] = useState('All')
  const [loading, setLoading] = useState(true)
  const pageRef = useRef(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        const data = response.data.data;
        setProjects(data);
        
        // Extract unique tags
        const allTags = ['All', ...new Set(data.flatMap(p => p.tags))];
        setTags(allTags);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filtered = activeTag === 'All'
    ? projects
    : projects.filter(p => p.tags.includes(activeTag))

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.projects__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [loading])

  useEffect(() => {
    if (loading) return;

    gsap.fromTo('.projects__card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, [activeTag, loading])

  if (loading) {
    return (
      <div className="projects-loading">
        <div className="loader"></div>
      </div>
    );
  }

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
            {tags.map(tag => (
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
            {filtered.length > 0 ? (
              filtered.map(project => (
                <Link key={project.id} to={`/projects/${project.slug}`} className="projects__card" data-cursor="View">
                  <div className="projects__card-img">
                    <img src={getFileUrl(project.thumbnail)} alt={project.title} loading="lazy" />
                  </div>
                  <div className="projects__card-body">
                    <h3 className="projects__card-title">{project.title}</h3>
                    <div className="projects__card-tags">
                      {project.tags.map(t => <span key={t} className="projects__card-tag">{t}</span>)}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="projects__empty">
                <p>No projects found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
