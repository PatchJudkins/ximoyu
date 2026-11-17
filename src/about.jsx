import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/about.css'
import AboutPage from './pages/AboutPage.jsx'

createRoot(document.getElementById('root')).render(<AboutPage />)
