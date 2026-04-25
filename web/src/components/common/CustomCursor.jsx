import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './CustomCursor.css'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    const follower = followerRef.current
    let mouseX = 0, mouseY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' })
      gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power2.out' })
    }

    const onMouseEnterLink = (e) => {
      setIsHovering(true)
      const text = e.target.closest('[data-cursor]')?.getAttribute('data-cursor') || ''
      setCursorText(text)
    }

    const onMouseLeaveLink = () => {
      setIsHovering(false)
      setCursorText('')
    }

    window.addEventListener('mousemove', onMouseMove)

    // Observe for interactive elements
    const interactiveEls = document.querySelectorAll('a, button, [data-cursor], input, textarea, select')
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterLink)
      el.addEventListener('mouseleave', onMouseLeaveLink)
    })

    // Use MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      const newEls = document.querySelectorAll('a, button, [data-cursor], input, textarea, select')
      newEls.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterLink)
        el.removeEventListener('mouseleave', onMouseLeaveLink)
        el.addEventListener('mouseenter', onMouseEnterLink)
        el.addEventListener('mouseleave', onMouseLeaveLink)
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnterLink)
        el.removeEventListener('mouseleave', onMouseLeaveLink)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'is-hovering' : ''}`} />
      <div ref={followerRef} className={`cursor-follower ${isHovering ? 'is-hovering' : ''}`}>
        {cursorText && <span className="cursor-text">{cursorText}</span>}
      </div>
    </>
  )
}
