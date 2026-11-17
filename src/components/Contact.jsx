export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact__inner">
        <p className="contact__eyebrow" data-reveal>
          <i />
          有活儿？有话？都可以
        </p>

        <a className="contact__mail" href="mailto:1520312270@qq.com" data-reveal>
          1520312270@qq.com
        </a>

        <div className="contact__qr" data-reveal>
          <img src="./contact/wechat.jpg" width="608" height="608" alt="微信二维码" />
          <p className="contact__qr-note">
            微信
            <em>WECHAT</em>
            <span>扫码加好友</span>
          </p>
        </div>

        <div className="contact__foot" data-reveal>
          <div className="contact__social">
            <a
              href="https://space.bilibili.com/3706994691147883"
              target="_blank"
              rel="noreferrer"
            >
              Bilibili
              <span aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/PatchJudkins" target="_blank" rel="noreferrer">
              GitHub
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact__aside">
            <a className="contact__totop" href="#top">
              回到顶部 <span aria-hidden="true">↑</span>
            </a>
            <span className="contact__loc">兰州 · 远程皆可</span>
          </div>
        </div>

        <a className="contact__logo-link" href="#top" aria-label="回到顶部">
          <img
            className="contact__logo"
            src="./logo/lockup.png"
            width="900"
            height="303"
            alt="XIMOYU STUDIO — 落墨无尽，星海无岸"
          />
          <span className="contact__logo-hint" aria-hidden="true">
            回到顶部 ↑
          </span>
        </a>

        <div className="contact__base">
          <span>© 2026 XIMOYU STUDIO</span>
          <span>Designed &amp; built in-house</span>
        </div>
      </div>
    </footer>
  )
}
