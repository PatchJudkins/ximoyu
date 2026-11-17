import { useCallback, useState } from 'react'
import AuroraGL from './AuroraGL.jsx'

/* 背景：能跑 WebGL 就走 shader（动态 + 跟手），不能就回退到烤好的静态图。 */
export default function Aurora() {
  const [failed, setFailed] = useState(false)
  const onFail = useCallback(() => setFailed(true), [])

  if (failed) {
    return (
      <img
        className="aurora"
        src="./aurora.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        draggable="false"
      />
    )
  }
  return <AuroraGL onFail={onFail} />
}
