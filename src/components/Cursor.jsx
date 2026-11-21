import { useEffect, useRef } from 'react'

/* 自定义光标：外圈 + 实心点，指到可点元素时外圈放大。
   顺带做按钮磁吸（只写 --mg-x/--mg-y，交给 CSS 的 translate 属性，不抢 transform）。
   触屏或粗指针设备直接不挂。 */
export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    if (!el) return

    const root = document.documentElement
    const HIT = 'a, button, .work, .marquee__track, [data-cursor]'
    const magnets = [...document.querySelectorAll('.btn, .nav__menu, .contact__mail, .menu__mail')]

    root.classList.add('has-cursor')

    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let shown = false
    let raf = 0
    let hit = false

    // 磁吸要读 4 个元素的位置，每次 pointermove 都 getBoundingClientRect 会强制排版；
    // 缓存 120ms 刷一次就够（滚动/缩放时跟着变）
    let rects = []
    let measuredAt = 0
    const measure = (force) => {
      const now = performance.now()
      if (!force && now - measuredAt < 120) return
      measuredAt = now
      rects = magnets.map((m) => m.getBoundingClientRect())
    }

    const magnetize = (cx, cy) => {
      measure(false)
      for (let i = 0; i < magnets.length; i++) {
        const m = magnets[i]
        const r = rects[i]
        if (!r) continue
        const dx = cx - (r.left + r.width / 2)
        const dy = cy - (r.top + r.height / 2)
        const near = Math.abs(dx) < r.width / 2 + 56 && Math.abs(dy) < r.height / 2 + 48
        if (!near) {
          m.style.setProperty('--mg-x', '0px')
          m.style.setProperty('--mg-y', '0px')
          continue
        }
        m.style.setProperty('--mg-x', `${(dx * 0.16).toFixed(1)}px`)
        m.style.setProperty('--mg-y', `${(dy * 0.22).toFixed(1)}px`)
      }
    }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      if (!shown) {
        shown = true
        x = tx
        y = ty
        root.classList.add('cursor-on')
      }
      const next = !!e.target.closest?.(HIT)
      if (next !== hit) {
        hit = next
        el.classList.toggle('is-hit', hit)
      }
      magnetize(tx, ty)
    }

    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => {
      shown = false
      root.classList.remove('cursor-on')
      for (const m of magnets) {
        m.style.setProperty('--mg-x', '0px')
        m.style.setProperty('--mg-y', '0px')
      }
    }

    const tick = () => {
      // 0.42 跟手但不硬跟，尾巴刚好能看出"被拽着走"
      const nx = x + (tx - x) * 0.42
      const ny = y + (ty - y) * 0.42
      // 收敛了就不要再写 style：空转每帧都触发一次样式重算，白白占着主线程
      if (Math.abs(nx - x) > 0.02 || Math.abs(ny - y) > 0.02) {
        x = nx
        y = ny
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      root.classList.remove('has-cursor', 'cursor-on')
    }
  }, [])

  return (
    <i ref={ref} className="cursor" aria-hidden="true">
      <b className="cursor__ring" />
      <b className="cursor__dot" />
    </i>
  )
}
