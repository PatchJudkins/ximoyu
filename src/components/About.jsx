import SectionHead from './SectionHead.jsx'

export default function About() {
  return (
    <section className="sec" id="about">
      <SectionHead num="03" title="关于" en="Studio" />

      <div className="about">
        <p className="about__lede" data-reveal>
          <strong>XIMOYU STUDIO</strong> 是一个小到能听见彼此呼吸的工作室。
          我们相信页面不该只是「能看」，它得有点
          <em className="holo-text">呼吸感</em>
          ——光在动、字在呼吸、鼠标划过时世界会轻轻偏一下。
        </p>

        <p className="about__note" data-reveal>
          落墨无尽，星海无岸。 —— 写在每个项目的第一个 commit 里。
        </p>

        <a className="about__more" href="./about.html" data-reveal>
          关于星墨游 · 成员与来处 <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
