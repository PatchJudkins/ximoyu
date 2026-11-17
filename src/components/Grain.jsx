/* 全局噪点 + 扫描线：样式全在 global.css 的 .grain 里，
   这里只负责挂一个层，不要再传 background-image 覆盖它。 */
export default function Grain() {
  return <div className="grain" aria-hidden="true" />
}
