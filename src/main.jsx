import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import App from './App.jsx'
import FpsMeter from './components/FpsMeter.jsx'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// ?fps=1 挂一个帧率表，验证动态背景是否稳 60
if (new URLSearchParams(location.search).has('fps')) {
  const box = document.createElement('div')
  document.body.appendChild(box)
  createRoot(box).render(<FpsMeter />)
}
