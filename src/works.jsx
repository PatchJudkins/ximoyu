import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/works.css'
import WorksPage from './pages/WorksPage.jsx'

createRoot(document.getElementById('root')).render(<WorksPage />)
