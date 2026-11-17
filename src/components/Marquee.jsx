const ITEMS = [
  'Brand Site',
  'Interaction',
  'Motion',
  'Visual Experiment',
  'WebGL',
  'Typography',
  'Design System',
]

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((dup) => (
          <div className="marquee__item" key={dup}>
            {ITEMS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
