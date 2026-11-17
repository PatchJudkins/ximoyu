import { useEffect, useMemo, useRef, useState } from 'react'
import { works } from '../data/works.js'

// 首页作品区：一行不停往前走的胶片。
//
// 只放 5 个作品：从作品集里随机挑 4 张图 + 1 个视频（视频位随批次轮换），
// 顺序也打乱。这 5 个首尾相接循环播放，整条复制一份接在后面，
// 位移正好是一份的宽度，所以走到结尾会无缝接上开头。
//
// 卡片按各自比例算宽度（行高 × ratio），5 张正好铺满一屏。

const GAP = 16
const SPEED = 52 // px / 秒
const COUNT = 5 // 同时只放 5 个作品，就这 5 个循环

function shuffled(list) {
  const out = list.slice()
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function buildPlaylist() {
  const videos = works.filter((w) => w.kind === 'video')
  const images = works.filter((w) => w.kind !== 'video')
  const tall = images.filter((w) => w.ratio <= 1.2)
  const wide = images.filter((w) => w.ratio > 1.2)
  // 视频随机挑一条，这样多刷几次不会总是同一支
  const video = videos[Math.floor(Math.random() * videos.length)]
  // 横版最多 2 张，否则 5 张里塞 3 张 16:9 会把竖版挤成一条缝
  const wideCount = Math.min(wide.length, 2)
  const picked = [
    ...shuffled(tall).slice(0, COUNT - 1 - wideCount),
    ...shuffled(wide).slice(0, wideCount),
  ]
  return shuffled([video, ...picked])
}

function StripVideo({ src, poster }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setLive(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLive(true)
        else el.pause()
      },
      { rootMargin: '240px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!live) return
    const el = ref.current
    el?.play?.().catch(() => {})
  }, [live])

  return (
    <video
      ref={ref}
      className="wr__media"
      src={live ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  )
}

export default function WorksStrip() {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const [box, setBox] = useState({ h: 0, w: 0 })
  const [paused, setPaused] = useState(false)
  const playlist = useMemo(buildPlaylist, [])

  useEffect(() => {
    const el = trackRef.current
    const wrap = wrapRef.current
    if (!el || !wrap) return
    const read = () => setBox({ h: el.clientHeight, w: wrap.clientWidth })
    read()
    if (!('ResizeObserver' in window)) return
    const ro = new ResizeObserver(read)
    ro.observe(el)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // 宽屏按各自比例排（横竖混排不变形）；手机上统一成 58vw 的方卡，
  // 不然一张横版卡就把整行占满，看不出在走。58vw 也刚好卡进「窄卡只留标题」的容器查询
  const narrow = box.w > 0 && box.w < 560
  const natural = playlist.map((w) => Math.max(72, Math.round(box.h * w.ratio)))
  // 5 张要正好铺满一屏：比例算出来比容器宽时整组等比收一点（高度不变，图片多裁一点），
  // 这样不会出现「第 5 个被切掉一半」
  const room = box.w - GAP * (playlist.length - 1)
  const total = natural.reduce((a, b) => a + b, 0)
  const fit = room > 0 && total > room ? Math.max(0.62, room / total) : 1
  const widths = narrow
    ? playlist.map(() => Math.round(box.w * 0.58))
    : natural.map((w) => Math.max(72, Math.round(w * fit)))
  const shift = widths.reduce((a, b) => a + b, 0) + GAP * playlist.length
  const duration = Math.max(30, shift / SPEED)

  const row = (copy) =>
    playlist.map((w, i) => (
      <a
        className="wr__card"
        key={`${copy}-${i}-${w.id}`}
        href={w.href}
        style={{ width: box.h ? widths[i] : undefined }}
        tabIndex={copy === 1 ? -1 : 0}
        aria-hidden={copy === 1 ? 'true' : undefined}
        aria-label={`${w.title} ${w.en} — ${w.tags.join('、')}`}
      >
        {w.kind === 'video' ? (
          <StripVideo src={w.video} poster={w.poster} />
        ) : (
          <img
            className="wr__media"
            src={w.img || w.poster}
            alt={w.title}
            loading={copy === 0 && i < 6 ? 'eager' : 'lazy'}
            decoding="async"
          />
        )}

        <span className="wr__scrim" aria-hidden="true" />
        {w.kind === 'video' && (
          <span className="wr__play" aria-hidden="true">
            ▶
          </span>
        )}
        <span className="wr__info">
          <span className="wr__title">
            {w.title}
            <em>{w.en}</em>
          </span>
          <span className="wr__meta">
            {w.tags.join(' · ')} · {w.year}
          </span>
        </span>
      </a>
    ))

  return (
    <div
      className="wr"
      ref={wrapRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="wr__track wr__track--marquee"
        ref={trackRef}
        style={{
          '--shift': `${shift}px`,
          '--dur': `${duration}s`,
          '--wr-play': paused ? 'paused' : 'running',
        }}
      >
        {row(0)}
        {row(1)}
      </div>
    </div>
  )
}
