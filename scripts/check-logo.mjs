// 一次性校验：logo 资源是否真加载、favicon 链接是否指向 png、控制台有没有报错
const list = await (await fetch('http://127.0.0.1:9223/json/list')).json()
const page = list.find((t) => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const send = (method, params = {}) =>
  new Promise((res) => {
    const mid = ++id
    pending.set(mid, res)
    ws.send(JSON.stringify({ id: mid, method, params }))
  })

ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result)
    pending.delete(m.id)
  }
}
await new Promise((r) => (ws.onopen = r))

await send('Page.enable')
await send('Runtime.enable')
await send('Page.navigate', { url: 'http://127.0.0.1:5179/' })
await new Promise((r) => setTimeout(r, 2500))

const probe = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    logos: [...document.images].filter(i => i.src.includes('/logo/') || i.src.includes('favicon'))
      .map(i => ({ file: i.src.split('/').pop(), ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth })),
    icon: document.querySelector("link[rel=icon]")?.getAttribute('href'),
    canvas: document.querySelectorAll('canvas').length,
  })`,
  returnByValue: true,
})
console.log(probe.result.value)
ws.close()
