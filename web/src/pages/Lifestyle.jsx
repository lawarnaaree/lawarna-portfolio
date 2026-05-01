import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../utils/api'
import { getFileUrl } from '../utils/helpers'
import { useFingerprint } from '../hooks/useFingerprint'
import me from '../assets/phoksundo1.jpg'
import StoryViewer from '../components/lifestyle/StoryViewer'
import './Lifestyle.css'

gsap.registerPlugin(ScrollTrigger)

export default function Lifestyle() {
  const [posts, setPosts] = useState([])
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState([])
  const pageRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)
  const [activeHighlight, setActiveHighlight] = useState(null)
  const [comments, setComments] = useState([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentForm, setCommentForm] = useState({ name: '', text: '' })

  const fingerprint = useFingerprint();

  const fetchData = useCallback(async () => {
    try {
      const [postsRes, highlightsRes] = await Promise.all([
        api.get('/lifestyle/posts'),
        api.get('/lifestyle/highlights')
      ]);
      setPosts(postsRes.data.data);
      setHighlights(highlightsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch lifestyle data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  // Separate effect for likes once fingerprint is ready
  useEffect(() => {
    if (fingerprint) {
      const fetchLikes = async () => {
        try {
          const res = await api.get(`/lifestyle/likes?fingerprint=${fingerprint}`);
          setLikedPosts(res.data.data);
        } catch (error) {
          console.error('Failed to fetch likes', error);
        }
      };
      const timeout = setTimeout(() => {
        fetchLikes();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [fingerprint]);

  // Load comments when lightbox opens
  useEffect(() => {
    if (lightbox) {
      const fetchComments = async () => {
        setCommentLoading(true);
        try {
          const res = await api.get(`/lifestyle/posts/${lightbox.id}/comments`);
          setComments(res.data.data);
        } catch (error) {
          console.error('Failed to fetch comments', error);
        } finally {
          setCommentLoading(false);
        }
      };
      fetchComments();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComments(prev => prev.length > 0 ? [] : prev);
    }
  }, [lightbox]);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Page Heading animation
      gsap.fromTo('.lifestyle__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.2 }
      )

      // Highlights animation
      if (highlights.length > 0) {
        gsap.fromTo('.ig-highlight',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.4 }
        )
      }

      // Grid animation
      gsap.fromTo('.ig-post',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', delay: 0.4,
          scrollTrigger: { trigger: '.ig-grid', start: 'top 85%' }
        }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [loading, highlights])

  const handleLike = async (e, postId) => {
    e.stopPropagation();
    if (!fingerprint) return;

    const isLiked = likedPosts.includes(postId);

    // Optimistic UI
    setLikedPosts(prev =>
      isLiked ? prev.filter(id => id !== postId) : [...prev, postId]
    );
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1 };
      }
      return p;
    }));
    if (lightbox?.id === postId) {
      setLightbox(prev => ({
        ...prev,
        likes: isLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
      }));
    }

    try {
      if (isLiked) {
        await api.delete(`/lifestyle/posts/${postId}/like`, { data: { fingerprint } });
      } else {
        await api.post(`/lifestyle/posts/${postId}/like`, { fingerprint });
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      // Revert on error
      setLikedPosts(prev =>
        isLiked ? [...prev, postId] : prev.filter(id => id !== postId)
      );
      // Ideally re-fetch or revert counts here too
      fetchData();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.text.trim()) return;

    try {
      const res = await api.post(`/lifestyle/posts/${lightbox.id}/comments`, {
        name: commentForm.name,
        comment: commentForm.text
      });
      setComments(prev => [res.data.data, ...prev]);
      setCommentForm({ ...commentForm, text: '' });
      // Update comment count on post
      setPosts(prev => prev.map(p => p.id === lightbox.id ? { ...p, comments: p.comments + 1 } : p));
      setLightbox(prev => ({ ...prev, comments: prev.comments + 1 }));
    } catch (error) {
      console.error('Failed to post comment', error);
    }
  };

  if (loading) {
    return (
      <div className="lifestyle-loading">
        <div className="loader"></div>
      </div>
    );
  }

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
        {highlights.length > 0 && (
          <div className="ig-highlights">
            {highlights.map(hl => (
              <div 
                key={hl.id} 
                className="ig-highlight" 
                data-cursor="View"
                onClick={() => setActiveHighlight(hl)}
              >
                <div className="ig-highlight-ring">
                  {hl.media_type === 'video' ? (
                    <video src={getFileUrl(hl.cover_image)} muted playsInline />
                  ) : (
                    <img src={getFileUrl(hl.cover_image)} alt={hl.title} />
                  )}
                </div>
                <span className="ig-highlight-title">{hl.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="ig-tabs">
          <button className="ig-tab active">
            <svg aria-label="Posts" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            POSTS
          </button>
        </div>

        {/* Grid */}
        <div className="ig-grid">
          {posts.length > 0 ? posts.map(post => (
            <div
              key={post.id}
              className="ig-post"
              onClick={() => setLightbox(post)}
              data-cursor="Expand"
            >
              {post.media_type === 'video' ? (
                <video src={getFileUrl(post.media_url)} muted playsInline />
              ) : (
                <img src={getFileUrl(post.media_url)} alt={post.caption} loading="lazy" />
              )}
              {post.is_reel && (
                <div className="reel-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
                </div>
              )}
              <div className="ig-post-overlay">
                <div className="ig-post-stats">
                  <span>
                    <svg viewBox="0 0 24 24" fill={likedPosts.includes(post.id) ? "var(--c-accent)" : "currentColor"} width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    {post.likes || 0}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                    {post.comments || 0}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="ig-empty">
              <p>No lifestyle posts yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lifestyle__lightbox" onClick={() => setLightbox(null)}>
          <div className="lifestyle__lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lifestyle__lightbox-close" onClick={() => setLightbox(null)}>✕</button>

            <div className="lightbox-content-grid">
              <div className="lightbox-media">
                {lightbox.media_type === 'video' ? (
                  <video src={getFileUrl(lightbox.media_url)} controls autoPlay />
                ) : (
                  <img src={getFileUrl(lightbox.media_url)} alt={lightbox.caption} />
                )}
              </div>

              <div className="lightbox-details">
                <div className="lightbox-header">
                  <div className="user-avatar">
                    <img src={me} alt="Lawarna" />
                  </div>
                  <div className="user-info">
                    <span className="username">lawarna_aree</span>
                    {lightbox.location && <span className="location">{lightbox.location}</span>}
                  </div>
                </div>

                <div className="lightbox-comments">
                  <div className="caption-section">
                    <span className="username">lawarna_aree</span>
                    <span className="caption-text">{lightbox.caption}</span>
                  </div>

                  <div className="comments-list">
                    {commentLoading ? (
                      <div className="comments-loading">Loading...</div>
                    ) : comments.length > 0 ? (
                      comments.map(c => (
                        <div key={c.id} className="comment-item">
                          <span className="username">{c.name}</span>
                          <span className="comment-text">{c.comment}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-comments">No comments yet.</div>
                    )}
                  </div>
                </div>

                <div className="lightbox-footer">
                  <div className="lightbox-actions">
                    <button
                      className={`action-btn ${likedPosts.includes(lightbox.id) ? 'liked' : ''}`}
                      onClick={(e) => handleLike(e, lightbox.id)}
                    >
                      <svg viewBox="0 0 24 24" fill={likedPosts.includes(lightbox.id) ? "var(--c-accent)" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    <button className="action-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </button>
                  </div>
                  <div className="likes-count">
                    {lightbox.likes || 0} likes
                  </div>

                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <input
                      type="text"
                      placeholder="Your name..."
                      className="comment-name-input"
                      value={commentForm.name}
                      onChange={e => setCommentForm({ ...commentForm, name: e.target.value })}
                      required
                    />
                    <div className="comment-input-wrapper">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentForm.text}
                        onChange={e => setCommentForm({ ...commentForm, text: e.target.value })}
                        required
                      />
                      <button type="submit" disabled={!commentForm.text.trim() || !commentForm.name.trim()}>Post</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeHighlight && (
        <StoryViewer 
          highlight={activeHighlight} 
          onClose={() => setActiveHighlight(null)} 
        />
      )}
    </main>
  )
}
