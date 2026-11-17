export default function SectionHead({ num, title, en, more }) {
  return (
    <div className="sec__head" data-reveal>
      <span className="sec__num">{num}</span>
      <h2 className="sec__title">{title}</h2>

      <span className="sec__right">
        {more && (
          <a className="sec__more" href={more.href}>
            {more.label || '更多'} <span aria-hidden="true">↗</span>
          </a>
        )}
        <span className="sec__en">{en}</span>
      </span>
    </div>
  )
}
