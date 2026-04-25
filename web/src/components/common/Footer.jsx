import { Link } from 'react-router-dom'
import './Footer.css'

const FOOTER_LINKS = [
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/journey', label: 'Journey' },
  { path: '/lifestyle', label: 'Lifestyle' },
  { path: '/contact', label: 'Contact' },
]

const SOCIAL_LINKS = [
  { url: 'https://github.com/lawarnaaree', label: 'GitHub' },
  { url: 'https://www.linkedin.com/in/lawarna-aree-032180317/', label: 'LinkedIn' },
  { url: 'https://x.com/lawarnaaree', label: 'X / Twitter' },
  { url: 'mailto:lawarnaaree@gmail.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="footer section" id="site-footer">
      <div className="container">
        <div className="footer__cta">
          <p className="footer__cta-label">Have a project in mind?</p>
          <Link to="/contact" className="footer__cta-heading" data-cursor="Let's Talk">
            Let's Work<br />Together<span className="footer__cta-dot">.</span>
          </Link>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            {FOOTER_LINKS.map(link => (
              <Link key={link.path} to={link.path} className="footer__link">{link.label}</Link>
            ))}
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Socials</h4>
            {SOCIAL_LINKS.map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="footer__link">
                {link.label}
              </a>
            ))}
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Get in Touch</h4>
            <a href="mailto:hello@lawarnaaree.com" className="footer__link">lawarnaaree@gmail.com</a>
            <p className="footer__location">Kathmandu,  🇳🇵</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© {new Date().getFullYear()} Lawarna Aree. All rights reserved.</p>
          <p className="footer__built">Designed & Built by Lawarna Aree</p>
        </div>
      </div>
    </footer>
  )
}
