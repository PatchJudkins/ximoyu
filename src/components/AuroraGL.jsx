import { useEffect, useRef } from 'react'

/* ============================================================
   虹彩流光背景（WebGL）
   ------------------------------------------------------------
   为什么不用 SVG：feTurbulence + feDisplacementMap 一旦 animate，
   整块画面每帧重算，paqi-site 上实测 3.5fps（见 AuroraSvg.jsx 注释）。
   这里改成一张全屏三角形 + fragment shader：
     · 光带 = 横向场 fract() 到线的距离，用 fbm 做域扭曲让它流动、挤压、打圈
     · 鼠标 = 一个高斯影响圈，把场往径向推 + 绕转 → 光带被"搅动"
     · 渲染分辨率按像素预算降到 ~1.4M，再被 CSS 放大（光带本来就柔）
   ============================================================ */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform vec2  uMouse;   // 0..1，y 向上
uniform float uTime;    // 秒
uniform float uAmp;     // 互动强度（reduced-motion 时为 0）

float hash(vec2 p) {
  p = fract(p * vec2(127.31, 311.7));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p = p * 2.07 + 11.3;
    a *= 0.5;
  }
  return s;
}

const vec3 C0 = vec3(1.000, 0.180, 0.388);
const vec3 C1 = vec3(1.000, 0.478, 0.270);
const vec3 C2 = vec3(1.000, 0.850, 0.239);
const vec3 C3 = vec3(0.490, 1.000, 0.420);
const vec3 C4 = vec3(0.133, 0.878, 1.000);
const vec3 C5 = vec3(0.420, 0.357, 1.000);
const vec3 C6 = vec3(0.780, 0.490, 1.000);

vec3 ramp(float t) {
  t = fract(t);  // 循环取色：不 wrap 的话时间一长 ct 会超过 1，被 clamp 死在最后一个颜色
  vec3 c = C0;
  c = mix(c, C1, smoothstep(0.000, 0.167, t));
  c = mix(c, C2, smoothstep(0.167, 0.334, t));
  c = mix(c, C3, smoothstep(0.334, 0.500, t));
  c = mix(c, C4, smoothstep(0.500, 0.667, t));
  c = mix(c, C5, smoothstep(0.667, 0.833, t));
  c = mix(c, C6, smoothstep(0.833, 0.917, t));
  c = mix(c, C0, smoothstep(0.917, 1.000, t));  // 首尾接上，循环处不跳色
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * ar, uv.y);

  // ---- 鼠标：推开 + 绕转 + 局部提亮 ----
  vec2 m = vec2(uMouse.x * ar, uMouse.y);
  vec2 dv = p - m;
  float dist = length(dv) + 1e-4;
  float infl = exp(-dist * dist * 4.2);
  vec2 dir = dv / dist;

  p += dir * infl * 0.095 * uAmp;

  float ang = infl * 0.82 * uAmp;
  vec2 rv = p - m;
  p = m + vec2(rv.x * cos(ang) - rv.y * sin(ang), rv.x * sin(ang) + rv.y * cos(ang));

  float t = uTime * 0.072;   // 主流速
  float tf = uTime * 0.19;   // 更快的抖动层，让光带一直是"活"的

  // ---- 域扭曲：低频噪声把横线揉成会流动的丝 ----
  vec2 w = vec2(
    fbm(p * 1.3 + vec2(t * 1.15, -t * 0.7)),
    fbm(p * 1.3 + vec2(4.1 - t * 0.8, 6.3 + t * 0.95))
  );

  // 明暗门：沿横向慢慢开合，画面才有"有的地方有光、有的地方全黑"
  // 两个频率取 max，再抬一个下限——否则门一关整个首屏会瞬间全黑（截图能抓到）
  float gate = mix(
    0.34,
    1.05,
    max(
      smoothstep(0.20, 0.80, fbm(vec2(p.x * 0.42 - t * 0.55, p.y * 0.8 + t * 0.3))),
      0.85 * smoothstep(0.26, 0.86, fbm(vec2(p.x * 1.1 + t * 0.7, p.y * 1.3 - t * 0.45)))
    )
  );

  // 主层：横向细丝。用 fract 到线的距离做核，宽度可控（pow 做出来太肥）
  // warp 幅度要接近线间距，线才会互相挤压、打圈，而不是一排平行波浪
  float f1 = p.y * 4.2
    + 2.00 * fbm(vec2(p.x * 0.42 + t * 0.34, p.y * 0.55 - t * 0.22))
    + 0.55 * fbm(vec2(p.x * 1.25 - tf * 0.9, p.y * 0.85 + tf * 0.55))
    + 0.95 * (w.x - 0.5)
    + 0.45 * (w.y - 0.5);
  float q1 = abs(fract(f1) - 0.5);
  float line1 = 1.0 - smoothstep(0.0, 0.030, q1);
  float halo1 = exp(-q1 * q1 * 620.0);

  // 副层：更密更细的一层，错开相位，避免出现规整的等距条纹
  float f2 = p.y * 7.1
    + 1.55 * fbm(vec2(p.x * 0.55 - t * 0.26, p.y * 0.8 + t * 0.18))
    + 0.40 * fbm(vec2(p.x * 1.5 + tf * 0.7, p.y * 1.1 - tf * 0.5))
    + 0.70 * (w.y - 0.5)
    + 1.7;
  float q2 = abs(fract(f2) - 0.5);
  float line2 = 1.0 - smoothstep(0.0, 0.022, q2);
  float halo2 = exp(-q2 * q2 * 900.0);

  // ---- 颜色：整体色相实时转动，每条光带再带一点自己的偏移 ----
  float ct = uv.x * 0.75 + uv.y * 0.25 + uTime * 0.05 + floor(f1) * 0.10;

  vec3 col = vec3(0.0);
  col += ramp(ct) * (line1 * 1.62 + halo1 * 0.22);
  col += ramp(ct + 0.38 + floor(f2) * 0.06) * (line2 * 1.12 + halo2 * 0.12);
  col += vec3(1.0) * (line1 * 0.26 + line2 * 0.14);

  // 门控 + 沿线明暗：光带不该是一条亮度均匀的线，得有断续和浓淡
  col *= gate;
  float tex = fbm(p * 2.2 + vec2(t * 1.1, -t * 0.8));
  col *= 0.62 + 0.50 * tex;

  // ---- 环境色雾：压得很低，只负责让黑不死 ----
  vec2 d1 = (uv - vec2(0.78, 0.88)) * vec2(1.0, 1.9);
  vec2 d2 = (uv - vec2(0.55, 0.34)) * vec2(1.0, 1.9);
  vec2 d3 = (uv - vec2(0.16, 0.20)) * vec2(1.0, 1.9);
  vec2 d4 = (uv - vec2(0.30, 0.70)) * vec2(1.0, 1.9);
  col += vec3(1.000, 0.180, 0.388) * 0.10 * exp(-dot(d1, d1) * 13.0);
  col += vec3(0.133, 0.878, 1.000) * 0.08 * exp(-dot(d2, d2) * 15.0);
  col += vec3(0.420, 0.357, 1.000) * 0.09 * exp(-dot(d3, d3) * 16.0);
  col += vec3(0.490, 1.000, 0.420) * 0.05 * exp(-dot(d4, d4) * 18.0);

  // ---- 光标处的聚光 ----
  col += ramp(ct + 0.12) * infl * 0.7 * uAmp;
  col += vec3(1.0) * pow(infl, 4.0) * 0.42 * uAmp;

  // ---- 暗角，压住四个角 ----
  float vig = smoothstep(1.25, 0.30, length((uv - 0.5) * vec2(ar, 1.0)));
  col *= mix(0.32, 1.0, vig);

  // ---- 抖动：大面积渐变不加抖动会出现色带 ----
  col += (hash(gl_FragCoord.xy + uTime * 60.0) - 0.5) * 0.006;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`

// 像素预算：1440×900 ≈ 1.3M、1920×1080 降采样到 ≈ 1.4M，集显也能稳住 60fps
const MAX_PIXELS = 1_400_000
const MAX_DPR = 1.5

export default function AuroraGL({ onFail }) {
  const ref = useRef(null)
  const failRef = useRef(onFail)
  failRef.current = onFail

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const gl =
      canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      }) || canvas.getContext('experimental-webgl')

    if (!gl) {
      failRef.current?.()
      return
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error('[aurora] shader 编译失败\n' + gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      failRef.current?.()
      return
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[aurora] program 链接失败\n' + gl.getProgramInfoLog(prog))
      failRef.current?.()
      return
    }
    gl.useProgram(prog)

    // 一个盖住整个裁剪空间的大三角形，比两个三角形少一次顶点
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uMouse = gl.getUniformLocation(prog, 'uMouse')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uAmp = gl.getUniformLocation(prog, 'uAmp')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // 鼠标还没动过时聚光为 0：否则首屏正中会莫名亮一团（默认 uMouse 是 0.5,0.5）
    let ampTarget = 0
    let amp = 0

    // ---- 尺寸：按像素预算降采样 ----
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      let rw = w * dpr
      let rh = h * dpr
      const over = Math.sqrt(MAX_PIXELS / (rw * rh))
      if (over < 1) {
        rw *= over
        rh *= over
      }
      rw = Math.max(2, Math.round(rw))
      rh = Math.max(2, Math.round(rh))
      if (canvas.width !== rw || canvas.height !== rh) {
        canvas.width = rw
        canvas.height = rh
      }
      gl.viewport(0, 0, rw, rh)
      gl.uniform2f(uRes, rw, rh)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ---- 指针：目标值 + 缓动，跟手但不硬 ----
    const target = { x: 0.5, y: 0.5 }
    const cur = { x: 0.5, y: 0.5 }
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
      if (!reduce) ampTarget = 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // ---- 只在首屏可见时跑 ----
    let raf = 0
    let visible = true
    let last = 0
    const t0 = performance.now() / 1000

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      if (document.hidden) return

      const t = now / 1000
      if (reduce && last) return
      last = 1

      cur.x += (target.x - cur.x) * 0.09
      cur.y += (target.y - cur.y) * 0.09
      amp += (ampTarget - amp) * 0.035

      gl.uniform2f(uMouse, cur.x, cur.y)
      gl.uniform1f(uTime, t - t0)
      gl.uniform1f(uAmp, amp)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting)
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    // 丢失上下文（切显卡 / 休眠唤醒）时让父级回退成静态图
    const onLost = (e) => {
      e.preventDefault()
      failRef.current?.()
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('webglcontextlost', onLost)
      // 故意不调用 loseContext()：HMR 重挂时立刻丢上下文会让新上下文编译失败，
      // 表现为改完 shader 页面悄悄回退成静态图。生产环境不会重挂，泄漏可忽略。
    }
  }, [])

  return <canvas ref={ref} className="aurora aurora--gl" aria-hidden="true" />
}
