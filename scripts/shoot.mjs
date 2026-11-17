// 用 CDP 精确截图（视口尺寸 = 图片尺寸，无窗口白边）
// 用法: node scripts/shoot.mjs [name ...]
//   SITE_URL=http://127.0.0.1:5179/  CDP_PORT=9223  SHOT_DIR=E:\work\DSHworks\.shots
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const PORT = Number(process.env.CDP_PORT || 9223)
const OUT = process.env.SHOT_DIR || 'E:\\work\\DSHworks\\.shots\\ximoyu'
const BASE = process.env.SITE_URL || 'http://127.0.0.1:5179/'
const STAMP = Date.now()

const SHOTS = [
  // 首屏：默认光带
  { name: '01-hero', url: `${BASE}?s=${STAMP}`, w: 1440, h: 900, wait: 2600 },
  // 首屏：鼠标停在画面中偏右下，看光带被搅动
  {
    name: '02-hero-hover',
    url: `${BASE}?s=${STAMP}`,
    w: 1440,
    h: 900,
    wait: 2200,
    hover: [900, 620],
    hoverWait: 1400,
  },
  // 首屏：鼠标在左上
  {
    name: '03-hero-hover-2',
    url: `${BASE}?s=${STAMP}`,
    w: 1440,
    h: 900,
    wait: 2200,
    hover: [300, 260],
    hoverWait: 1400,
  },
  // 1080p 全屏，验证真实显示器下的比例
  { name: '04-fhd', url: `${BASE}?s=${STAMP}`, w: 1920, h: 1080, wait: 2600, hover: [1280, 700] },
  // 帧率表（headless 是软件渲染，数值仅供参考）
  { name: '05-fps', url: `${BASE}?fps=1&s=${STAMP}`, w: 1440, h: 900, wait: 4200 },
  // 作品区
  { name: '06-works', url: `${BASE}?s=${STAMP}`, w: 1440, h: 1000, anchor: '#works', wait: 2400 },
  { name: '07-works-b', url: `${BASE}?s=${STAMP}`, w: 1440, h: 1000, anchor: '.work:nth-child(2)', wait: 2200 },
  // 服务区
  { name: '08-services', url: `${BASE}?s=${STAMP}`, w: 1440, h: 1000, anchor: '#services', wait: 2400 },
  // 关于 + 联系
  { name: '09-about', url: `${BASE}?s=${STAMP}`, w: 1440, h: 1000, anchor: '#about', wait: 2400 },
  { name: '10-contact', url: `${BASE}?s=${STAMP}`, w: 1440, h: 1000, anchor: '#contact', wait: 2400 },
  // 手机
  { name: '11-mobile', url: `${BASE}?s=${STAMP}`, w: 390, h: 844, mobile: true, wait: 2400 },
  // 整页
  { name: '12-full', url: `${BASE}?s=${STAMP}`, w: 1440, h: 900, full: true, wait: 3200 },
]

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const wanted = only.length ? SHOTS.filter((s) => only.includes(s.name)) : SHOTS

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function pageTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const list = await res.json()
      const page = list.find((t) => t.type === 'page')
      if (page && page.webSocketDebuggerUrl) return page
    } catch {
      /* not up yet */
    }
    await sleep(300)
  }
  throw new Error(`CDP not reachable on ${PORT}`)
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl)
    const pending = new Map()
    const handlers = new Map()
    let seq = 0

    ws.addEventListener('open', () =>
      resolve({
        send(method, params = {}) {
          const id = ++seq
          ws.send(JSON.stringify({ id, method, params }))
          return new Promise((res, rej) => pending.set(id, { res, rej }))
        },
        on(event, fn) {
          handlers.set(event, fn)
        },
        close() {
          ws.close()
        },
      }),
    )
    ws.addEventListener('error', (e) => {
      console.error('ws error', e?.message || e)
      for (const { rej } of pending.values()) rej(new Error('ws error'))
      pending.clear()
      reject(new Error('ws error'))
    })
    ws.addEventListener('close', (e) => {
      console.error(`ws closed code=${e.code} reason=${e.reason || '-'}`)
      for (const { rej } of pending.values()) rej(new Error('ws closed'))
      pending.clear()
    })
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id)
        pending.delete(msg.id)
        if (msg.error) rej(new Error(`${msg.error.message} (${msg.error.code})`))
        else res(msg.result)
        return
      }
      const fn = handlers.get(msg.method)
      if (fn) fn(msg.params)
    })
  })
}

await mkdir(OUT, { recursive: true })
const target = await pageTarget()
const cdp = await connect(target.webSocketDebuggerUrl)

await cdp.send('Page.enable')
await cdp.send('Runtime.enable')
await cdp.send('Runtime.addBinding', { name: '__cdpNote' }).catch(() => {})

for (const s of wanted) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: s.w,
    height: s.h,
    deviceScaleFactor: 1,
    mobile: Boolean(s.mobile),
    screenWidth: s.w,
    screenHeight: s.h,
  })

  const loaded = new Promise((r) => cdp.on('Page.loadEventFired', r))
  await cdp.send('Page.navigate', { url: s.url })
  await Promise.race([loaded, sleep(9000)])

  if (s.anchor) {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector(${JSON.stringify(s.anchor)});
        if (!el) return 'missing';
        const y = el.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: 'instant' });
        return String(Math.round(y));
      })()`,
      returnByValue: true,
    })
  }

  await sleep(s.wait ?? 1600)

  // 悬停：先移进画面，再小范围拖两下，让 shader 的指针缓动真的跑起来
  if (s.hover) {
    const [x, y] = s.hover
    const steps = [
      [s.w * 0.5, s.h * 0.5],
      [x - 90, y - 60],
      [x - 40, y - 20],
      [x, y],
      [x + 6, y - 4],
      [x, y],
    ]
    for (const [mx, my] of steps) {
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: Math.round(mx),
        y: Math.round(my),
        button: 'none',
        buttons: 0,
      })
      await sleep(90)
    }
    await sleep(s.hoverWait ?? 900)
  }

  const params = { format: 'png', fromSurface: true, captureBeyondViewport: false }
  if (s.full) {
    const { contentSize } = await cdp.send('Page.getLayoutMetrics')
    const height = Math.min(Math.ceil(contentSize.height), 12000)
    params.clip = { x: 0, y: 0, width: s.w, height, scale: 1 }
    params.captureBeyondViewport = true
  }

  const { data } = await cdp.send('Page.captureScreenshot', params)
  const file = path.join(OUT, `${s.name}.png`)
  await writeFile(file, Buffer.from(data, 'base64'))
  const kb = Math.round(Buffer.from(data, 'base64').length / 1024)
  console.log(`shot ${s.name} -> ${kb} KB (${s.w}x${s.full ? 'full' : s.h})`)
}

// 顺手把控制台报错捞出来
const errors = await cdp
  .send('Runtime.evaluate', {
    expression: 'JSON.stringify(window.__errs || [])',
    returnByValue: true,
  })
  .catch(() => null)
if (errors?.result?.value && errors.result.value !== '[]') console.log('page errors:', errors.result.value)

cdp.close()
console.log('done')
