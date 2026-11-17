import SectionHead from './SectionHead.jsx'
import WorksStrip from './WorksStrip.jsx'

export function WorkCard({ w, i }) {
  const cls = ['work', w.wide ? 'work--wide' : '', w.type === 'typo' ? 'work--typo' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={cls}
      href={w.href}
      data-reveal
      style={{ '--delay': `${i * 90}ms` }}
      aria-label={`${w.title} ${w.en}`}
    >
      <div className="work__cover">
        {w.video ? (
          <video
            className="work__img"
            src={w.video}
            poster={w.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : w.img || w.poster ? (
          <img
            className="work__img"
            src={w.img || w.poster}
            alt={w.title}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="work__typo" aria-hidden="true">
            <span>星</span>
            <em>SEA</em>
          </div>
        )}
        <span className="work__grain" aria-hidden="true" />
        <span className="work__sheen" aria-hidden="true" />
        <span className="work__index">{w.id}</span>
        <span className="work__open" aria-hidden="true">
          查看 ↘
        </span>
      </div>

      <div className="work__meta">
        <h3 className="work__title">
          {w.title}
          <span className="work__en">{w.en}</span>
        </h3>
        <p className="work__tags">
          {w.tags.join(' · ')}
          <span className="work__year">{w.year}</span>
        </p>
      </div>
    </a>
  )
}

export default function Works() {
  return (
    <section className="sec" id="works">
      <SectionHead num="01" title="作品" en="Selected Work" more={{ href: './works.html', label: '更多' }} />
      <WorksStrip />
    </section>
  )
}
