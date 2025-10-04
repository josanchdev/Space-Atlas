import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './styles/header.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import SolarSystemPage from './pages/SolarSystemPage'
import PlanetPage from './pages/PlanetPage'
import SolarSystem from './components/SolarSystem'
import NewsPage from './pages/NewsPage'
import ExplorePage from './pages/ExplorePage'
import ScientistsPage from './pages/ScientistsPage'
import SpaceMissionsPage from './pages/SpaceMissionsPage'
import SpaceMissionDetailPage from './pages/SpaceMissionDetailPage'

function AppContent() {
  const location = useLocation()
  const isSolarSystemPage = location.pathname === '/solar-system'
  
  // Lista de nombres de planetas y cuerpos celestes
  const celestialBodies = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  const isPlanetPage = celestialBodies.some(body => location.pathname === `/${body}`)
  
  // Ocultar header y footer en solar-system y en páginas de planetas individuales
  const hideHeaderFooter = isSolarSystemPage || isPlanetPage

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <div className={hideHeaderFooter ? '' : 'body-with-header'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/planets" element={<SolarSystemPage />} />
          <Route path="/space-missions" element={<SpaceMissionsPage />} />
          <Route path="/space-mission/:mission_name" element={<SpaceMissionDetailPage />} />
          <Route path="/:name" element={<PlanetPage />} />
          <Route path="/scientists" element={<ScientistsPage />} />
        </Routes>
      </div>
      {!hideHeaderFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
