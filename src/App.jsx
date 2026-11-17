import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Works from './components/Works.jsx'
import Services from './components/Services.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Grain from './components/Grain.jsx'
import CursorLight from './components/CursorLight.jsx'
import Cursor from './components/Cursor.jsx'

export default function App() {
  // 滚动进场：统一在这里挂，组件里只写 data-reveal
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { rootMargin: '-6% 0px -10% 0px', threshold: 0.04 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Works />
        <Services />
        <About />
        <Contact />
      </main>
      <Grain />
      <CursorLight />
      <Cursor />
    </>
  )
}
