import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Navbar.css'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/journey', label: 'Journey' },
  { path: '/lifestyle', label: 'Lifestyle' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const location = useLocation()
  const lastScroll = useRef(0)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  // Hide/show navbar on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > 100 && currentScroll > lastScroll.current) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScroll.current = currentScroll
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate menu overlay
  useEffect(() => {
    if (!menuRef.current) return

    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.8,
        ease: 'power4.inOut',
      })
      gsap.fromTo('.nav-menu__link', 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.4 }
      )
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        duration: 0.6,
        ease: 'power4.inOut',
      })
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <nav ref={navRef} className={`navbar ${hidden ? 'navbar--hidden' : ''} ${menuOpen ? 'navbar--open' : ''}`} id="main-nav">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo" data-cursor="Home">
            <span className="navbar__logo-text">LA</span>
            <span className="navbar__logo-dot" />
          </Link>

          <div className="navbar__links">
            {NAV_LINKS.filter(l => l.path !== '/').map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className={`navbar__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            id="menu-toggle"
          >
            <span className="navbar__burger-line" />
            <span className="navbar__burger-line" />
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <div ref={menuRef} className="nav-menu" id="nav-menu-overlay">
        <div className="nav-menu__inner">
          <div className="nav-menu__links">
            {NAV_LINKS.map((link, i) => (
              <div className="nav-menu__item" key={link.path}>
                <span className="nav-menu__number">{String(i + 1).padStart(2, '0')}</span>
                <Link
                  to={link.path}
                  className={`nav-menu__link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  data-cursor="Go"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="nav-menu__footer">
            <div className="nav-menu__social">
              <a href="https://github.com/lawarnaaree" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/lawarnaaree" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:hello@lawarnaaree.com">Email</a>
            </div>
            <p className="nav-menu__copy">© {new Date().getFullYear()} Lawarna Aree</p>
          </div>
        </div>
      </div>
    </>
  )
}
