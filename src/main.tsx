import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TravelPage from './pages/TravelPage'
import { TravelPageContextProvider } from './pages/TravelPageContextProvider'
import { BrowserRouter, Route, Routes } from 'react-router'
import FormPage from './components/FormPage/FormPage'
import TripInformation from './components/TripInformation/TripInformation'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TravelPageContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TravelPage />} />
          <Route path='create' element={<FormPage />} />
          <Route path='/trip/:id' element={<TripInformation/>} />
        </Routes>
      </BrowserRouter>
    </TravelPageContextProvider>
  </StrictMode>,
)
