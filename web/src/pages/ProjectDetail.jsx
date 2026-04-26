import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import api from '../utils/api'
import { getFileUrl } from '../utils/helpers'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const pageRef = useRef(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        setProject(response.data.data);
      } catch (error) {
        console.error('Failed to fetch project detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (loading || !project) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.pd__cover img', { scale: 1.2 }, { scale: 1, duration: 1.5, ease: 'power3.out' })
      gsap.fromTo('.pd__title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.3 })
      gsap.fromTo('.pd__meta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      gsap.fromTo('.pd__body', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 })
      gsap.fromTo('.pd__gallery', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.7 })
    }, pageRef)
    return () => ctx.revert()
  }, [loading, project])

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pd-notfound">
        <h2>Project not found</h2>
        <Link to="/projects">Back to Projects</Link>
      </div>
    );
  }

  return (
    <main ref={pageRef} className="pd-page">
      <div className="pd__cover">
        <img src={getFileUrl(project.thumbnail)} alt={project.title} />
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
              {project.live_url && (
                <a href={project.live_url} className="pd__link-btn" target="_blank" rel="noopener noreferrer">Live Site ↗</a>
              )}
              {project.github_url && (
                <a href={project.github_url} className="pd__link-btn pd__link-btn--outline" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              )}
            </div>
          </div>
        </div>

        <div className="pd__body section">
          <p>{project.short_description}</p>
          <div className="pd__long-description">
            {project.long_description}
          </div>
        </div>

        {/* Gallery Section */}
        {project.media && project.media.length > 0 && (
          <div className="pd__gallery section">
            {project.media.map((item, i) => (
              <GalleryItem key={i} item={item} i={i} projectTitle={project.title} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function GalleryItem({ item, i, projectTitle }) {
  const [orientation, setOrientation] = useState('landscape'); // default

  const handleLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalHeight > naturalWidth) {
      setOrientation('portrait');
    } else {
      setOrientation('landscape');
    }
  };

  return (
    <div className={`pd__gallery-img pd__gallery-img--${orientation}`}>
      <img 
        src={getFileUrl(item.media_url)} 
        alt={`${projectTitle} screenshot ${i + 1}`} 
        loading="lazy" 
        onLoad={handleLoad}
      />
    </div>
  );
}
