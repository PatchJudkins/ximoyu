import { useEffect, useRef } from 'react'

// 菜单内容都在这里改：加一项就是加一行，onClick 关掉菜单是自动的
const buildLinks = (home) => [
  { href: './works.html', num: '01', label: '作品', en: 'Selected Work' },
  { href: `${home}#services`, num: '02', label: '服务', en: 'What We Do' },
  { href: './about.html', num: '03', label: '关于', en: 'About Studio' },
  { href: `${home}#contact`, num: '04', label: '联系', en: 'Contact' },
]

export default function Menu({ open, onClose, home = '' }) {
  const panel = useRef(null)
  const restoreTo = useRef(null)
  const LINKS = buildLinks(home)

  useEffect(() => {
    if (!open) return

    restoreTo.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // 焦点困在面板里（Tab 循环）
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll('a[href], button:not([disabled])')
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    // 焦点给面板本体，别给第一个链接——否则浏览器会画一圈 focus 描边在「作品」上
    panel.current?.focus({ preventScroll: true })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      restoreTo.current?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <div className={`menu ${open ? 'is-open' : ''}`} id="site-menu" inert={!open}>
      <button className="menu__scrim" onClick={onClose} tabIndex={-1} aria-label="关闭菜单" />

      <div className="menu__panel" ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label="站点菜单">
        <div className="menu__inner">
          <div className="menu__col">
            <p className="menu__label">导航 / INDEX</p>
            <ul className="menu__list">
              {LINKS.map((l, i) => (
                <li key={l.label} style={{ '--i': i }}>
                  <a href={l.href} onClick={onClose}>
                    <span className="menu__num">{l.num}</span>
                    <span className="menu__cn">{l.label}</span>
                    <span className="menu__en">{l.en}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="menu__col menu__col--side">
            <p className="menu__label">联系 / REACH</p>
            <a className="menu__mail" href="mailto:hi@ximoyu.studio">
              hi@ximoyu.studio
            </a>
            <div className="menu__social">
              <a href={`${home}#contact`} onClick={onClose}>
                Bilibili <span aria-hidden="true">↗</span>
              </a>
              <a href={`${home}#contact`} onClick={onClose}>
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="menu__foot">
            <a className="btn menu__cta" href={`${home}#contact`} onClick={onClose}>
              一起做点东西 <span aria-hidden="true">↗</span>
            </a>
            <button
              className="menu__top"
              onClick={() => {
                onClose()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              回到顶部 <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
