import { useEffect } from 'react'
import Nav from '../components/Nav.jsx'
import Contact from '../components/Contact.jsx'
import Grain from '../components/Grain.jsx'
import CursorLight from '../components/CursorLight.jsx'
import Cursor from '../components/Cursor.jsx'

const WHAT = [
  {
    num: '01',
    title: 'AIGC 生成式动画',
    en: 'Generative Motion',
    desc: '分镜、动势、转场交给模型跑，人来定风格和节制——生成只是开始，剪掉多余的才叫作品。',
  },
  {
    num: '02',
    title: '生成式图片 · 平面设计',
    en: 'Image & Graphic',
    desc: '海报、视觉系统、社媒物料。从 prompt 到成稿的完整链路，也包括那些没被选中的 300 张。',
  },
  {
    num: '03',
    title: '简单交互',
    en: 'Interaction',
    desc: '网页、小工具、装置里那一下即时反馈。按下去要有回应，划过要有点脾气。',
  },
  {
    num: '04',
    title: '游戏开发',
    en: 'Game Dev',
    desc: '玩法原型、关卡与美术管线。先做能玩的，再做好看的。',
  },
]

const TEAM = [
  { name: '李菀竹', role: '指导老师', tag: 'mentor' },
  { name: '刘朝阳', role: '负责人', tag: 'lead', href: 'https://patchshiyan.pages.dev/' },
  { name: '王玉婷', role: '负责人', tag: 'lead' },
  { name: '鲁伟轩', role: '成员' },
  { name: '马高伟', role: '成员' },
  { name: '苗承鑫', role: '成员' },
  { name: '梁淑萍', role: '成员' },
  { name: '李志云', role: '成员' },
  { name: '杨栋豪', role: '成员' },
  { name: '海玥', role: '成员' },
]

export default function AboutPage() {
  // 滚动进场，和首页同一套 data-reveal
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { rootMargin: '-6% 0px -10% 0px', threshold: 0.04 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div id="top" className="ab">
      <Nav home="./index.html" />

      <main>
        <header className="ab-hero">
          <div className="ab-hero__bg" aria-hidden="true" />
          <img className="ab-hero__star" src="./logo/star.png" alt="" width="192" height="200" aria-hidden="true" />
          <div className="ab-hero__inner">
            <p className="ab-eyebrow" data-reveal>
              <i />
              关于 · ABOUT
            </p>

            <h1 className="ab-title" data-reveal>
              星墨游
              <span className="ab-title__en">XINMOYU STUDIO</span>
            </h1>

            <p className="ab-lede" data-reveal>
              2026 年 10 月 25 日，兰州文理学院数字媒体学院里多了一间小工作室。
              我们叫它<em className="holo-text">星墨游</em>——星是落墨的方向，游是还没想好的那条路。
            </p>

            <dl className="ab-facts" data-reveal>
              <div>
                <dt>成立</dt>
                <dd>2026.10.25</dd>
              </div>
              <div>
                <dt>隶属</dt>
                <dd>兰州文理学院 · 数字媒体学院</dd>
              </div>
              <div>
                <dt>方向</dt>
                <dd>AIGC · 交互 · 游戏</dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="ab-split">
          <figure className="ab-figure" data-reveal>
            <img src="./photos/lanzhou.webp" width="1200" height="1848" alt="兰州文理学院校门，砖红色校名墙与红灯笼" loading="lazy" />
            <figcaption>
              <span className="ab-figure__idx">01</span>
              兰州文理学院 · 数字媒体学院
            </figcaption>
          </figure>

          <div className="ab-story">
            <h2 className="ab-h2" data-reveal>
              一间由学生组成的工作室
            </h2>
            <p data-reveal>
              我们不在写字楼里，在西北的一所学校里。白天上课，晚上在教室里调 prompt、渲片子、改 shader。
              设备不算新，但够用；人手不算多，但愿意磨。
            </p>
            <p data-reveal>
              我们相信「做出来」比「说得好」重要。所以这里的每件作品都上过线、投过展、跑过机——哪怕只是一个能在手机里滑两下的小页面。
            </p>
            <p className="ab-quote" data-reveal>
              落墨无尽，星海无岸。 —— 写在每个项目的第一个 commit 里。
            </p>
          </div>
        </section>

        <section className="ab-what">
          <div className="ab-sec-head" data-reveal>
            <span className="ab-sec-num">02</span>
            <h2 className="ab-h2">我们在做什么</h2>
            <span className="ab-sec-en">What We Do</span>
          </div>

          <ul className="ab-list">
            {WHAT.map((w) => (
              <li key={w.num} data-reveal>
                <span className="ab-list__num">{w.num}</span>
                <div className="ab-list__body">
                  <h3>{w.title}</h3>
                  <span className="ab-list__en">{w.en}</span>
                </div>
                <p className="ab-list__desc">{w.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="ab-team">
          <div className="ab-sec-head" data-reveal>
            <span className="ab-sec-num">03</span>
            <h2 className="ab-h2">成员</h2>
            <span className="ab-sec-en">The Crew · {TEAM.length} 人</span>
          </div>

          <ul className="ab-people" id="team-people">
            {TEAM.map((p, i) => (
              <li key={p.name} className={`ab-person ab-person--${p.tag || 'member'}`} data-reveal>
                <span className="ab-person__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="ab-person__name">{p.name}</span>
                <span className="ab-person__role">{p.role}</span>
                {p.href && (
                  <a className="ab-person__site" href={p.href} target="_blank" rel="noreferrer">
                    个人网页 ↗
                  </a>
                )}
              </li>
            ))}
            <li className="ab-person ab-person--more" data-reveal>
              <span className="ab-person__idx">+</span>
              <span className="ab-person__name">更多</span>
              <span className="ab-person__role">MORE</span>
            </li>
          </ul>
        </section>
      </main>

      <Contact />
      <Grain />
      <CursorLight />
      <Cursor />
    </div>
  )
}
