import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Lifestyle.css'

gsap.registerPlugin(ScrollTrigger)

const POSTS = [
  { id: 1, likes: '1.2k', comments: 42, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { id: 2, likes: '856', comments: 15, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
  { id: 3, likes: '2.4k', comments: 124, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  { id: 4, likes: '1.1k', comments: 38, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80' },
  { id: 5, likes: '3.2k', comments: 210, image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80' },
  { id: 6, likes: '945', comments: 23, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' },
  { id: 7, likes: '1.8k', comments: 64, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80' },
  { id: 8, likes: '2.1k', comments: 89, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
  { id: 9, likes: '1.5k', comments: 47, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80' },
]

const HIGHLIGHTS = [
  { id: 1, title: 'Travel', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&q=80' },
  { id: 2, title: 'Setup', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&q=80' },
  { id: 3, title: 'Food', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&q=80' },
  { id: 4, title: 'Fitness', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80' },
]

export default function Lifestyle() {
  const pageRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page Heading animation
      gsap.fromTo('.lifestyle__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      )

      // Highlights animation
      gsap.fromTo('.ig-highlight',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.4 }
      )

      // Grid animation
      gsap.fromTo('.ig-post',
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', delay: 0.6,
          scrollTrigger: { trigger: '.ig-grid', start: 'top 85%' }
        }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={pageRef} className="lifestyle-page">
      <section className="lifestyle__hero section">
        <div className="container">
          <h1 className="lifestyle__heading">Lifestyle<span className="text-accent">.</span></h1>
          <p className="lifestyle__subtitle">Beyond the code — glimpses of my personal world.</p>
        </div>
      </section>

      <div className="ig-container">


        {/* Highlights */}
        <div className="ig-highlights">
          {HIGHLIGHTS.map(hl => (
            <div key={hl.id} className="ig-highlight" data-cursor="View">
              <div className="ig-highlight-ring">
                <img src={hl.image} alt={hl.title} />
              </div>
              <span className="ig-highlight-title">{hl.title}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="ig-tabs">
          <button className="ig-tab active">
            <svg aria-label="Posts" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            POSTS
          </button>
          <button className="ig-tab">
            <svg aria-label="Reels" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 4.5l-17 15"></path><path d="M14.5 4.5l-11 11"></path><path d="M20.5 10.5l-11 11"></path><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
            REELS
          </button>
        </div>

        {/* Grid */}
        <div className="ig-grid">
          {POSTS.map(post => (
            <div 
              key={post.id} 
              className="ig-post"
              onClick={() => setLightbox(post)}
              data-cursor="Expand"
            >
              <img src={post.image} alt={`Post ${post.id}`} loading="lazy" />
              <div className="ig-post-overlay">
                <div className="ig-post-stats">
                  <span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {post.likes}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lifestyle__lightbox" onClick={() => setLightbox(null)}>
          <div className="lifestyle__lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lifestyle__lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image} alt={`Post ${lightbox.id}`} />
            <div className="lifestyle__lightbox-info">
              <div className="lifestyle__lightbox-actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>{lightbox.likes} likes</span>
              </div>
              <div className="lifestyle__lightbox-actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>{lightbox.comments} comments</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
