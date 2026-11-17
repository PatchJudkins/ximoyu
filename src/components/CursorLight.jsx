import { useEffect, useRef } from 'react'

/* 跟随鼠标的一团柔光。只改 transform（合成层），不改布局属性。
   触屏设备没有指针，直接不挂。 */
export default function CursorLight() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    if (!el) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty
    let raf = 0

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      el.classList.add('is-on')
    }

    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <i ref={ref} className="cursor-light" aria-hidden="true" />
}
