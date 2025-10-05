import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './styles/header.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import PlanetPage from './pages/PlanetPage'
import SolarSystem from './components/SolarSystem'
import NewsPage from './pages/NewsPage'
import ExplorePage from './pages/ExplorePage'
import ScientistsPage from './pages/ScientistsPage'
import SpaceMissionsPage from './pages/SpaceMissionsPage'
import SpaceMissionDetailPage from './pages/SpaceMissionDetailPage'
import SignInPage from './pages/SignInPage'
import ScientistAuthPage from './pages/ScientistAuthPage'
import MyProfilePage from './pages/MyProfilePage'
import MyBookmarksPage from './pages/MyBookmarksPage'
import NotFoundPage from './pages/NotFoundPage'
import ImageViewerPage from './pages/ImageViewerPage'

function AppContent() {
  const location = useLocation()
  const isSolarSystemPage = location.pathname === '/solar-system'
  
  // Lista de nombres de planetas y cuerpos celestes
  const celestialBodies = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  const isPlanetPage = celestialBodies.some(body => location.pathname === `/${body}`)
  const isImageViewerPage = location.pathname.startsWith('/image/')
  
  // Ocultar header y footer en solar-system, páginas de planetas y visor de imágenes
  const hideHeaderFooter = isSolarSystemPage || isPlanetPage || isImageViewerPage

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <div className={hideHeaderFooter ? '' : 'body-with-header'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/space-missions" element={<SpaceMissionsPage />} />
          <Route path="/space-mission/:mission_name" element={<SpaceMissionDetailPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/scientist-auth" element={<ScientistAuthPage />} />
          <Route path="/content-manager" element={<ScientistsPage />} />
          <Route path="/myprofile" element={<MyProfilePage />} />
          <Route path="/mybookmarks" element={<MyBookmarksPage />} />
          <Route path="/image/:image_name" element={<ImageViewerPage />} />
          <Route path="/:name" element={<PlanetPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
