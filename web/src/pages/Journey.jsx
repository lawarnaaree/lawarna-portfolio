import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import api from '../utils/api'
import './Journey.css'

gsap.registerPlugin(ScrollTrigger)

const TYPE_ICONS = {
  work: '💼',
  education: '🎓',
  achievement: '🏆',
  milestone: '🚀',
}

export default function Journey() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const pageRef = useRef(null)

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const response = await api.get('/journey');
        setEntries(response.data.data);
      } catch (error) {
        console.error('Failed to fetch journey:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  useEffect(() => {
    if (loading) return;

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
  }, [loading])

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="journey-loading">
        <div className="loader"></div>
      </div>
    );
  }

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
            {entries.map((entry, i) => (
              <div key={entry.id} className={`journey__card journey__card--${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="journey__card-dot">
                  <span>{TYPE_ICONS[entry.type] || '✨'}</span>
                </div>
                <div className="journey__card-content">
                  <span className="journey__card-period">
                    {formatDate(entry.start_date)} — {entry.is_current ? 'Present' : formatDate(entry.end_date)}
                  </span>
                  <h3 className="journey__card-title">{entry.role}</h3>
                  <p className="journey__card-org">{entry.company} • {entry.title}</p>
                  <p className="journey__card-desc">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
