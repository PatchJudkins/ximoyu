import { useEffect } from 'react'
import Nav from '../components/Nav.jsx'
import Contact from '../components/Contact.jsx'
import Grain from '../components/Grain.jsx'
import CursorLight from '../components/CursorLight.jsx'
import Cursor from '../components/Cursor.jsx'
import { WorkCard } from '../components/Works.jsx'
import { works } from '../data/works.js'

const FACTS = [
  { k: '项目', v: `${works.length} 个` },
  { k: '方向', v: 'AIGC · 交互 · 品牌' },
  { k: '年份', v: '2024 — 2025' },
]

export default function WorksPage() {
  // 和首页/关于页同一套滚动进场
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
    <div id="top" className="wp">
      <Nav home="./index.html" />

      <main>
        <header className="wp-hero">
          <div className="wp-hero__bg" aria-hidden="true" />
          <div className="wp-hero__inner">
            <p className="wp-eyebrow" data-reveal>
              <i />
              作品 · WORKS
            </p>

            <h1 className="wp-title" data-reveal>
              作品集
              <span className="wp-title__en">SELECTED WORK</span>
            </h1>

            <p className="wp-lede" data-reveal>
              做过的、做了一半的、还在长的，都在这儿。每一个都能点进去看结论——
              我们把「上线」当成作品的一部分。
            </p>

            <dl className="wp-facts" data-reveal>
              {FACTS.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section className="wp-list">
          <div className="works__grid">
            {works.map((w, i) => (
              <WorkCard key={w.id} w={w} i={i} />
            ))}

            <article className="wp-pending" data-reveal>
              <span className="wp-pending__plus" aria-hidden="true">
                +
              </span>
              <div className="wp-pending__left">
                <p className="wp-pending__title">更多作品录入中</p>
                <p className="wp-pending__en">More coming soon</p>
              </div>
              <div className="wp-pending__right">
                <p className="wp-pending__note">
                  新的项目会陆续放到这里。想先看某个方向的东西，写信问我们要。
                </p>
                <a className="wp-pending__mail" href="mailto:hi@ximoyu.studio">
                  hi@ximoyu.studio <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Contact />
      <Grain />
      <CursorLight />
      <Cursor />
    </div>
  )
}
