import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Preloader.css'

export default function Preloader({ onReveal, onComplete }) {
  const preloaderRef = useRef(null)
  const contentRef = useRef(null)
  const counterRef = useRef(null)
  const nameRef = useRef(null)
  const titleRef = useRef(null)
  const overlayRef = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (preloaderRef.current) preloaderRef.current.style.display = 'none'
      onReveal?.()
      onComplete?.()
      return undefined
    }

    const ctx = gsap.context(() => {
      const counter = { val: 0 }
      const chars = nameRef.current?.querySelectorAll('.preloader__char')
      const timeline = gsap.timeline({
        onComplete: () => {
          if (preloaderRef.current) preloaderRef.current.style.display = 'none'
          onComplete?.()
        }
      })

      timeline.fromTo(chars,
        { yPercent: 115, rotateX: -35, autoAlpha: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.045,
          ease: 'power4.out'
        },
        0.1
      )
      timeline.fromTo(titleRef.current,
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out' },
        0.65
      )
      timeline.fromTo(counterRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
        0.8
      )
      timeline.to(counter, {
        val: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.floor(counter.val))
      }, 0.3)
      timeline.call(() => onReveal?.(), undefined, 2.15)
      timeline.to(contentRef.current, {
        yPercent: -20,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, 2.3)
      timeline.to(overlayRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut'
      }, 2.45)
    }, preloaderRef)

    return () => ctx.revert()
  }, [onComplete, onReveal])

  return (
    <div ref={preloaderRef} className="preloader" id="preloader">
      <div ref={overlayRef} className="preloader__overlay">
        <div ref={contentRef} className="preloader__content">
          <h1 ref={nameRef} className="preloader__name" aria-label="Lawarna Aree">
            {Array.from('LAWARNA AREE').map((char, index) => (
              <span className="preloader__char" key={`${char}-${index}`}>
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>
          <p ref={titleRef} className="preloader__title">Full-Stack Developer</p>
          <div ref={counterRef} className="preloader__counter">
            <span className="preloader__count">{String(count).padStart(3, '0')}</span>
            <span className="preloader__percent">%</span>
          </div>
          <div className="preloader__progress">
            <div className="preloader__bar" style={{ width: `${count}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
