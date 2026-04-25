import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Contact.css'

export default function Contact() {
  const pageRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact__heading',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      )
      gsap.fromTo('.contact__left > *',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
      )
      gsap.fromTo('.contact__form',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Will connect to API later
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setStatus(null), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <main ref={pageRef} className="contact-page">
      <section className="contact__hero section">
        <div className="container">
          <h1 className="contact__heading">Get in Touch<span className="text-accent">.</span></h1>
        </div>
      </section>

      <section className="contact__content section">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__left">
              <p className="contact__intro">
                Have a project idea, a question, or just want to say hello?
                I'd love to hear from you.
              </p>

              <div className="contact__info">
                <div className="contact__info-item">
                  <span className="contact__info-label">Email</span>
                  <a href="mailto:hello@lawarnaaree.com" className="contact__info-value">hello@lawarnaaree.com</a>
                </div>
                <div className="contact__info-item">
                  <span className="contact__info-label">Location</span>
                  <span className="contact__info-value">Nepal 🇳🇵</span>
                </div>
              </div>

              <div className="contact__socials">
                <span className="contact__info-label">Follow Me</span>
                <div className="contact__social-links">
                  <a href="https://github.com/lawarnaaree" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="https://linkedin.com/in/lawarnaaree" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://x.com/lawarnaaree" target="_blank" rel="noopener noreferrer">X / Twitter</a>
                </div>
              </div>
            </div>

            <form className="contact__form" onSubmit={handleSubmit} id="contact-form">
              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="contact-name">Name *</label>
                  <input type="text" id="contact-name" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                </div>
                <div className="contact__field">
                  <label htmlFor="contact-email">Email *</label>
                  <input type="email" id="contact-email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
                </div>
              </div>

              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="contact-phone">Phone</label>
                  <input type="tel" id="contact-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+977 ..." />
                </div>
                <div className="contact__field">
                  <label htmlFor="contact-subject">Subject</label>
                  <input type="text" id="contact-subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry" />
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message">Message *</label>
                <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required rows="6" placeholder="Tell me about your project..." />
              </div>

              <button
                type="submit"
                className={`contact__submit ${status === 'sending' ? 'is-sending' : ''} ${status === 'success' ? 'is-success' : ''}`}
                disabled={status === 'sending'}
                id="contact-submit"
              >
                {status === 'sending' ? 'Sending...' : status === 'success' ? '✓ Sent!' : 'Send Message'}
              </button>

              {status === 'error' && <p className="contact__error">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
