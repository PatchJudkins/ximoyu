# XIMOYU STUDIO — 工作室站（v0.1 大概版）

第二个站，视觉语言直接沿用 `paqi-site`（近黑底 + 七色虹彩 + 大字号），
首屏背景换成**实时 WebGL**：光带自己会流，鼠标划过会被搅动。

## 跑起来

```powershell
cd E:\work\DSHworks\ximoyu-studio
npm run dev      # http://127.0.0.1:5179/
npm run build    # 产物在 dist/，base: './' 所以 file:// 双击也能开
```

注意：本机 PowerShell 禁止运行 `npm.ps1`，要用 `npm.cmd`，或者直接 `npm run dev` 从别的终端进。

## 目录

```
index.html
vite.config.js          # 端口 5179，base './'
src/
  main.jsx              # 挂 App；?fps=1 额外挂一个帧率表
  App.jsx               # 页面骨架 + 滚动进场（data-reveal 统一在这里观察）
  components/
    Aurora.jsx          # 背景入口：能跑 GL 就 canvas，不能就回退静态图
    AuroraGL.jsx        # ★ WebGL 光带（VERT / FRAG 两个字符串 + 渲染循环）
    Hero.jsx  Nav.jsx  Marquee.jsx
    Works.jsx  Services.jsx  About.jsx  Contact.jsx
    SectionHead.jsx  Grain.jsx  CursorLight.jsx  Cursor.jsx  FpsMeter.jsx
  data/works.js         # 作品数据（现在是占位）
  styles/
    tokens.css          # 设计变量，从 paqi-site 原样搬来
    global.css          # reset / 按钮 / .holo / 噪点 / 滚动进场
    components.css      # 导航、首屏、作品、服务、关于、联系
  assets/
    hero-wordmark.webp  # 首屏标题的蒙版（logo 的 alpha，裁到 1248×343）
public/
  aurora.webp           # 静态回退图（也是原来那张烤好的虹彩）
  works/*.jpg           # 作品配图（占位）
  favicon.png           # 由 logo 里那颗四角星合成的 512 图标
  logo/
    lockup.png          # 完整锁定版（字标 + STUDIO + 落墨无尽，星海无岸）
    wordmark.png        # 只有字标 + STUDIO（切掉了标语）
    star.png            # 四角星，导航用
    mark.png            # 四角星放大版
scripts/shoot.mjs       # Edge CDP 截图（含 hover 注入）
```

## logo 从哪来、怎么用的

源文件：`E:\work\DSHworks\工作室网站\工作室logo\透明logo白.png`（1296×424 透明底）。
另外两张 `logo白.jpg` / `logo黑.jpg` 是带底色的版本，网页里不用。

这套字标是**细描边**的，缩到 100px 宽以下描边就糊成一团灰，
所以按用途分了三档尺寸：

- **首屏标题**：直接用 logo 当蒙版（`src/assets/hero-wordmark.webp`，39 KB），
  底下铺 `--holo` 七色渐变 + 64s `hueCycle` 色相漂移。星标那点淡蓝会被渐变盖掉，
  但字形、笔触、字距都是品牌原件。宽度 `min(940px, 88vw)`，手机上 92vw。
  为什么要 webp：同一张 PNG 做蒙版 360 KB，webp 只有 39 KB，蒙版只看 alpha。
  标语「落墨无尽，星海无岸」不走蒙版，是下面一行真文字 + 两侧短线，
  居中压在与字标同宽的容器里（`min(940px, 88vw)`），字号 `clamp(12px, 1.22vw, 15px)`、字距 0.5em。
- **导航**：只取那颗四角星（`star.png`，17px 高），后面跟 `XIMOYU / STUDIO` 文字（CSS 字体，小字号下更锐利）
- **页脚**：整套锁定版 420px 宽，标语也能看清

`assets` 是脚本从源 PNG 裁的，换 logo 的话重跑一次生成（Pillow）即可；
裁切边界靠 alpha 行分布算的：字标 + STUDIO 占 y 0–343，标语带在 y 372–423。

## 鼠标与滚动条

**自定义光标**（`src/components/Cursor.jsx`）：一个 26px 的圆环 + 4px 实心点，
rAF 里用 `x += (tx - x) * 0.42` 追指针，所以跟手但有一点延迟。

- 命中 `.btn / .nav__cta / a / button / .work / .marquee__track / [data-cursor]`
  时环放大到 58px、填一层 7% 白、点缩没（`html.is-hit`）。
- 按钮磁吸：`.btn / .nav__cta / .contact__mail` 在离中心 56px（x）/ 48px（y）内
  偏移 `dx * 0.16`、`dy * 0.22`，写在独立的 `translate` 属性上，
  不跟按钮自己的 `transform: translateY(-2px)` 打架。
- 只有 `(hover: hover) and (pointer: fine)` 才隐藏系统光标，触屏不受影响；
  `input / textarea / [contenteditable]` 保留 text 光标，不然没法编辑。

**滚动条**：`::-webkit-scrollbar` 宽 5px，拇指是 180deg 的七色渐变 +
两面辉光，hover 时更亮。注意别再写 `scrollbar-color`——Chromium 一旦看到它
就会转头用标准那套，`::-webkit-scrollbar` 全部失效。

**元素悬停**：作品卡整体上浮 4px + 描边高亮 + 「查看」浮出，位移动词一律用
`translate` 属性而不是 `transform`，避免和 `data-reveal` 的进场 transform 抢。

## 菜单

右上角是三条横线的按钮（`src/components/Nav.jsx`），点开是全屏菜单（`src/components/Menu.jsx`）。

**往菜单里加东西**：改 `Menu.jsx` 顶部的 `LINKS` 数组，加一行就多一项：

```js
{ href: '#works', num: '01', label: '作品', en: 'Selected Work' },
```

`num` 是左边的小号数字，`label` 是大字，`en` 是右侧的英文小标（手机上自动隐藏）。
加完不用动 CSS，但要顺手把 `num` 重编号。

其他内容在 `<div className="menu__col menu__col--side">` 里：邮箱、社交链接。
底部一条是 CTA + 回到顶部。

行为：Esc 关、点背景关、点任一项关且跳转、打开时锁滚动、焦点困在面板里、关闭后焦点还给按钮。
按钮打开时三条线会转成 X（`.nav__menu.is-open`）。

## 关于页（独立页面）

`about.html` + `src/pages/AboutPage.jsx` + `src/styles/about.css`，是多页构建的第二个入口
（`vite.config.js` 里 `build.rollupOptions.input` 同时列了 index.html 和 about.html）。

- 内容来自工作室的成员名单文档：成立 2026.10.25、隶属兰州文理学院数字媒体学院、四个方向、11 位成员。
- 改成员：`AboutPage.jsx` 顶部的 `TEAM` 数组，`role` 是角色（指导老师 / 负责人 / 成员），
  `href` 有值就把角色变成外链。`tag: 'mentor' | 'lead'` 决定配色。
- 改方向：同文件的 `WHAT` 数组。
- 从子页面回首页：`<Nav home="./index.html" />`，这个 prop 会给所有锚点加前缀。
  新增子页面时也要这样传，否则 `#works` 会指向子页面自己。
- 校区照片：`public/photos/lanzhou.webp`（1200×1848，284 KB，源图在桌面）。
  滤镜在 `about.css` 的 `.ab-figure img` + `.ab-figure::after`：
  压亮度 → `mix-blend-mode: color` 叠一层「品红→紫→青」渐变 → 底部再压暗一条放图注。
  想让它更还原，把 `::after` 的 `opacity` 从 0.62 调低；想更"赛博"，调高。
- 这一页没有第二块 WebGL 画布（省一个 GL 上下文），首屏光雾是 `.ab-hero__bg` 的三个径向渐变 + blur。

## 作品集页（works.html）

第三个入口，`works.html` + `src/pages/WorksPage.jsx` + `src/styles/works.css`。
首屏（标题 / 一段话 / 三个数字）+ 完整的作品网格 + 一个虚线占位卡收尾。

- **作品数据只有一份**：`src/data/works.js` 的 `works` 数组。首页的作品区和作品集页都读它。
- 加一个作品 = 往数组里 push 一个对象：
  ```js
  { id: '04', title: '新作品', en: 'Title', year: '2026',
    tags: ['品牌官网', '交互'],
    img: './works/04-xxx.jpg',   // 放在 public/works/
    href: '#contact' }           // 之后有详情页就换成链接
  ```
  `wide: true` 让这张卡通栏（首页第一张就是），`type: 'typo'` 是不放图片的纯字卡
  （现在「星海」那张，字是 `--holo` 渐变裁出来的）。
- 图片建议 1400px 宽以上、横图；竖卡是 4/5、通栏卡是 16/8.6，会被 `object-fit: cover` 裁。
- 入口有两处：首页作品区标题右侧的「更多」（亮黄色），和右上角菜单里的「作品」。

## 首页作品：一行走马灯

首页作品区不是网格，是**一条不停往前走的胶片**（`src/components/WorksStrip.jsx`）：

- 只放 **5 个**（`COUNT`）：从作品集里随机挑 4 张图 + 1 个视频，顺序也打乱；
  刷新页面重新随机。就这 5 个首尾相接循环，整条再复制一份接在后面，
  位移正好等于一份的宽度，所以走到结尾会**无缝接回开头**，中间没有停顿也没有淡出。
- 卡片宽度 = 行高 × 该项的 `ratio`，横版 16/9、竖版 9/16、方图 1 能并排站着，谁也不变形；
  要是 5 张加起来比容器宽，整组等比收一点（高度不变、图片多裁一点），保证 5 张正好铺满一屏。
- 横版最多挑 2 张，否则 5 张里塞 3 张 16:9 会把竖版挤成一条缝。
- 速度 `SPEED = 52`（px / 秒，`WorksStrip.jsx` 顶部）；鼠标停在上面暂停，
  键盘焦点进入也暂停；系统开了「减少动态效果」就不动。
- 手机上（<560px）统一成 58vw 的方卡，不然一张横版卡就把整行占满，看不出在走。

**加作品**：把图转成 webp 丢进 `public/works/`，然后在 `src/data/works.js` push 一条
（`ratio` 填宽/高；`wide: true` 会让它在作品集页里通栏）。视频作品多填两个字段：

```js
{ id: '24', title: '标题', en: 'Title', year: '2026', tags: ['短片'], kind: 'video',
  ratio: 9 / 16,
  video: './works/v03.mp4',
  poster: './works/v03-poster.jpg' }   // 首帧，加载前和暂停时显示
```

视频是 `muted loop playsInline`、滚到跟前才加载并播放（IntersectionObserver），
`preload="none"`，所以不进视口不花流量。竖版建议 720×1280 或 1080×1920、H.264 mp4。

## 背景怎么调的

是**流光**：横向的细丝光带，被 fbm 域扭曲揉得会挤压、打圈，鼠标划过时被推开。
`src/components/AuroraGL.jsx` 里的 `FRAG`，主要几个旋钮：

| 位置 | 作用 | 现在 |
| --- | --- | --- |
| `f1` 的 `p.y * 4.2` | 主层线密度 | 数字越大线越密 |
| `1.75 * fbm(...)` | 扭曲幅度，**要接近线间距**才会打圈、挤压 | 2.00 |
| `smoothstep(0.0, 0.030, q1)` | 线宽（0.03 ≈ 周期的 3%） | 0.030 |
| `gate` | 沿横向的明暗开合，控制"留白" | 下限 0.34，两个频率取 max |
| `float t = uTime * 0.072` | 主流动速度 | 0.072（越大越躁） |
| `float tf = uTime * 0.19` | 叠加快抖层，光带一直在抖 | 0.19 |
| `uTime * 0.05`（在 `ct` 里） | **颜色循环速度**：0.05 ≈ 20 秒转完一圈七色 | 0.05 |
| `floor(f1) * 0.10` | 每条光带自己的色相偏移，调大更像彩虹条纹 | 0.10 |
| `infl` 里的 `0.095` / `0.82` | 鼠标推开距离 / 绕转角 | 0.095、0.82 |
| `ramp(ct + 0.12) * infl` | 光标处的彩色聚光 | 0.7 |
| `MAX_PIXELS` | 像素预算（1.4M），超出就降采样 | 1_400_000 |

**踩过的坑**：
- `ramp()` 里必须 `fract(t)` 循环取色。原来写的是 `clamp(t,0,1)`，`uTime` 一累积就永远停在最后一个颜色（整屏发紫），看着像"颜色不会变"。
- 鼠标第一帧默认在 `(0.5,0.5)`，如果 `uAmp` 一上来就是 1，首屏正中会莫名亮一团。现在是首次 `pointermove` 后才把强度缓动到 1。
- 明暗门只有一个低频场时，门一关整屏全黑（截图正好抓到全黑那一下）。现在两个频率取 `max` 并抬了下限 0.34。
- 改 shader 后 HMR 会重挂 `useEffect`，cleanup 里如果 `loseContext()` 会让新上下文编译失败、静默回退成静态图；已去掉那次调用。改完一律验 `document.querySelectorAll('canvas').length === 1`。
- 试过把背景改成"熔岩灯"（5 个 metaball 平顶团），参数怎么调都偏散景，最后按用户要求退回流光版。这套流光的参数是逐张截图调过十几轮的，别轻易换算法。

性能兜底：滚出首屏停渲染、切后台停渲染、`prefers-reduced-motion` 只画一帧、
`webglcontextlost` 直接回退成 `<img>`、拿不到 WebGL 也回退。
真实 1080p 下这套是 GPU 友好的（1920 渲染分辨率约 1519×922）。

## 现在还是占位的东西

- 作品标题：23 条都是按画面内容起的，还没跟作者核对过（改 `src/data/works.js` 一处即可）
- 品牌名 XIMOYU STUDIO 已由 logo 确认（不再算占位），标语「落墨无尽，星海无岸」也来自 logo
- 联系方式已经是真的：邮箱 `1520312270@qq.com`、微信二维码 `public/contact/wechat.jpg`、
  B 站（space.bilibili.com/3706994691147883）、GitHub（github.com/PatchJudkins）

## 截图自查

```powershell
# 先开一个带调试口的 Edge（只需一次）
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless=new `
  --remote-debugging-port=9223 --user-data-dir=E:\work\DSHworks\.edge-profile about:blank

node scripts/shoot.mjs            # 全部
node scripts/shoot.mjs 01-hero    # 单张
```

输出在 `E:\work\DSHworks\.shots\ximoyu\`。`02-hero-hover` / `03-hero-hover-2`
会先注入鼠标轨迹，再截图，用来确认光带真的被搅动了。
