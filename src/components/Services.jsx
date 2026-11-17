import SectionHead from './SectionHead.jsx'

const SERVICES = [
  {
    n: '01',
    title: '品牌官网',
    en: 'Brand Site',
    desc: '从信息架构到上线，一整套。首页能讲清你是谁，二级页能扛住细节。',
    items: ['视觉方向', '响应式实现', 'SEO / 性能'],
  },
  {
    n: '02',
    title: '交互体验',
    en: 'Interaction',
    desc: '滚动、悬停、转场、加载。不做花活，做「刚刚好」的那一下。',
    items: ['动效编排', 'WebGL / Canvas', '可访问性'],
  },
  {
    n: '03',
    title: '视觉实验',
    en: 'Visual Lab',
    desc: '生成图形、字体实验、奇怪的小工具。很多最后变成了正片里的零件。',
    items: ['生成视觉', '标识 / 字体', '原型'],
  },
]

export default function Services() {
  return (
    <section className="sec" id="services">
      <SectionHead num="02" title="服务" en="What We Do" />
      <div className="svc">
        {SERVICES.map((s, i) => (
          <article className="svc__row" key={s.n} data-reveal style={{ '--delay': `${i * 80}ms` }}>
            <span className="svc__n">{s.n}</span>
            <h3 className="svc__title">
              {s.title}
              <span className="svc__en">{s.en}</span>
            </h3>
            <p className="svc__desc">{s.desc}</p>
            <ul className="svc__items">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
