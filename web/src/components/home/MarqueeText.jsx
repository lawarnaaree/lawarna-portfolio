import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './MarqueeText.css'

export default function MarqueeText() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: 'linear',
      })
    })

    return () => ctx.revert()
  }, [])

  const items = [
    'Full-Stack Developer',
    'React',
    'Node.js',
    'React Native',
    'Flutter',
    'MySQL',
    'UI/UX',
    'Creative Thinker',
    'C',
    'C++',
    'DevOPs',
    'System Design'
  ]

  const renderItems = () => items.map((item, i) => (
    <span key={i} className="marquee__item">
      {item}
      <span className="marquee__separator">◆</span>
    </span>
  ))

  return (
    <div className="marquee section" id="marquee-strip">
      <div ref={trackRef} className="marquee__track">
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  )
}
