import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import CustomAnalytics from './components/CustomAnalytics'

// Initialize Stripe once during application startup (não precisa fazer alterações se não tiver código de inicialização global aqui)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CustomAnalytics />
  </StrictMode>,
)
