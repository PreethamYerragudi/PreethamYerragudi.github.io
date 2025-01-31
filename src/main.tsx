import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PortfolioFrontPage from './PortfolioFrontPage'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioFrontPage />
  </StrictMode>,
)
