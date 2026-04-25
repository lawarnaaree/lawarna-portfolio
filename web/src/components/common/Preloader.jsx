import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Preloader.css'

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null)
  const counterRef = useRef(null)
  const nameRef = useRef(null)
  const titleRef = useRef(null)
  const overlayRef = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete()
      }
    })

    // Count up animation
    const counter = { val: 0 }
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.floor(counter.val))
    })

    // Fade in name and title
    tl.fromTo(nameRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.3
    )
    tl.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      0.6
    )

    // Exit animation
    tl.to([nameRef.current, titleRef.current, counterRef.current], {
      y: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.05
    }, 2.8)

    tl.to(overlayRef.current, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1,
      ease: 'power4.inOut'
    }, 3.2)

    tl.to(preloaderRef.current, {
      opacity: 0,
      duration: 0.1,
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none'
        }
      }
    })

    return () => tl.kill()
  }, [])

  return (
    <div ref={preloaderRef} className="preloader" id="preloader">
      <div ref={overlayRef} className="preloader__overlay">
        <div className="preloader__content">
          <h1 ref={nameRef} className="preloader__name">Lawarna Aree</h1>
          <p ref={titleRef} className="preloader__title">Cross-Platform Full-Stack Developer</p>
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
