import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TravelPage from './pages/TravelPage'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<TravelPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
