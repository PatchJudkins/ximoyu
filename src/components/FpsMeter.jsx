import { useEffect, useRef } from 'react'

/* ?fps=1 时右下角显示实时帧率，用来验证背景 "光带 + 跟手" 有没有掉帧。
   只在需要时挂载，正常访问零开销。 */
export default function FpsMeter() {
  const ref = useRef(null)
  const num = useRef(null)

  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const tick = (now) => {
      frames++
      const dt = now - last
      if (dt >= 500) {
        const fps = Math.round((frames * 1000) / dt)
        if (num.current) num.current.textContent = String(fps)
        ref.current?.setAttribute('data-bad', fps < 50 ? '1' : '0')
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="fps" ref={ref}>
      <b ref={num}>--</b>
      <span>FPS</span>
    </div>
  )
}
