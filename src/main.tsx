import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { OrderProvider } from '@/context/OrderContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </LanguageProvider>
  </StrictMode>,
)
