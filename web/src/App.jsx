import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Hooks
import useLenis from './hooks/useLenis'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import CustomCursor from './components/common/CustomCursor'
import Preloader from './components/common/Preloader'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Journey from './pages/Journey'
import Lifestyle from './pages/Lifestyle'
import Contact from './pages/Contact'

import './App.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const lenisRef = useLenis()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
    // Refresh ScrollTrigger on route change
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }, [location.pathname])

  const handlePreloaderComplete = () => {
    setLoading(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <CustomCursor />

      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`app ${loading ? 'app--loading' : 'app--loaded'}`}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </>
  )
}