import Aurora from './Aurora.jsx'
import wordmark from '../assets/hero-wordmark.webp'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <Aurora />
        <div className="hero__scrim" />
      </div>

      <div className="hero__inner">
        <p className="hero__eyebrow">
          <i />
          数字体验工作室 · EST. 2024
        </p>

        <h1 className="hero__title">
          {/* 标题就是 logo 本身：拿字标的 alpha 当蒙版，填七色渐变。
              星标那点淡蓝会被渐变盖掉，但描边、笔触、字距都是原样的。 */}
          <span
            className="hero__logo"
            role="img"
            aria-label="Ximoyu Studio — 数字体验工作室"
            style={{ '--logo-mask': `url(${wordmark})` }}
          />
          <span className="hero__tagline">
            <i aria-hidden="true" />
            落墨无尽，星海无岸
            <i aria-hidden="true" />
          </span>
        </h1>

        <div className="hero__meta">
          <p className="hero__lede">
            我们做品牌官网、交互体验和视觉实验。
            <br />
            把<strong>光</strong>、<strong>噪点</strong>和一点点<strong>故障感</strong>，
            缝进真正会上线的页面。
          </p>

          <div className="hero__cta">
            <a className="btn" href="#works">
              看作品 <span aria-hidden="true">↘</span>
            </a>
            <a className="btn btn--ghost" href="#contact">
              聊聊想法
            </a>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#works" aria-label="向下滚动">
        <span>Scroll</span>
        <i />
      </a>
    </header>
  )
}
