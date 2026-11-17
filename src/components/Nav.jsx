import { useEffect, useState } from 'react'
import Menu from './Menu.jsx'

/* home：从「关于」这类子页面进来时传 './index.html'，
   这样锚点会跳回首页对应区块，而不是在子页面里找不到目标。 */
export default function Nav({ home = '' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { href: `${home}#works`, label: '作品' },
    { href: `${home}#services`, label: '服务' },
    { href: './about.html', label: '关于' },
    { href: `${home}#contact`, label: '联系' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu' : ''}`}>
        <a className="nav__mark" href={`${home}#top`} aria-label="XIMOYU STUDIO 首页" onClick={() => setOpen(false)}>
          <img className="nav__star" src="./logo/star.png" alt="" width="16" height="17" aria-hidden="true" />
          XIMOYU <span className="nav__mark-sub">/ STUDIO</span>
        </a>

        <div className="nav__links">
          {links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <button
          className={`nav__menu ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <Menu open={open} onClose={() => setOpen(false)} home={home} />
    </>
  )
}
