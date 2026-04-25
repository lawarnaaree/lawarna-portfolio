import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hook to run a GSAP animation with automatic cleanup.
 * @param {Function} animationFn - receives (context, ref) and sets up GSAP animations
 * @param {Array} deps - dependency array
 */
export default function useGsap(animationFn, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      animationFn(gsap, ref.current)
    }, ref)

    return () => ctx.revert()
  }, deps)

  return ref
}
