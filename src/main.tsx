import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TravelPage from './pages/TravelPage'
import FormPage from './components/Trip/FormPage/FormPage'
import { TravelPageContextProvider } from './pages/TravelPageContextProvider'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TravelPageContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TravelPage />} />
          <Route path='create' element={<FormPage />} />
        </Routes>
      </BrowserRouter>
    </TravelPageContextProvider>
  </StrictMode>,
)
