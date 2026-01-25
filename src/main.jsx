import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
import Noise from './components/Noise.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar/>
    <div className='fixed inset-0 z-999 pointer-events-none'>
    <Noise
    patternSize={250}
    patternScaleX={2}
    patternScaleY={2}
    patternRefreshInterval={2}
    patternAlpha={15}
  />
    </div>
    <App />
  </StrictMode>,
)
