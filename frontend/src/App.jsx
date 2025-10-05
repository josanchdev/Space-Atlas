import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'
import './styles/header.css'
import Header from './components/Header'
import Footer from './components/Footer'

// Lazy loading de páginas
const LandingPage = lazy(() => import('./pages/LandingPage'))
const PlanetPage = lazy(() => import('./pages/PlanetPage'))
const SolarSystem = lazy(() => import('./components/SolarSystem'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const ScientistsPage = lazy(() => import('./pages/ScientistsPage'))
const SpaceMissionsPage = lazy(() => import('./pages/SpaceMissionsPage'))
const SpaceMissionDetailPage = lazy(() => import('./pages/SpaceMissionDetailPage'))
const SignInPage = lazy(() => import('./pages/SignInPage'))
const ScientistAuthPage = lazy(() => import('./pages/ScientistAuthPage'))
const MyProfilePage = lazy(() => import('./pages/MyProfilePage'))
const MyBookmarksPage = lazy(() => import('./pages/MyBookmarksPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ImageViewerPage = lazy(() => import('./pages/ImageViewerPage'))
const TestCoordinatesPage = lazy(() => import('./pages/TestCoordinatesPage'))

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
        <Suspense fallback={<div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '1.5rem'
        }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/solar-system" element={<SolarSystem />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/space-missions" element={<SpaceMissionsPage />} />
            <Route path="/space-mission/:mission_name" element={<SpaceMissionDetailPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/scientist-auth" element={<ScientistAuthPage />} />
            <Route path="/content-manager" element={<ScientistsPage />} />
            <Route path="/myprofile" element={<MyProfilePage />} />
            <Route path="/mybookmarks" element={<MyBookmarksPage />} />
            <Route path="/image/:image_name" element={<ImageViewerPage />} />
            <Route path="/test-coordinates" element={<TestCoordinatesPage />} />
            <Route path="/:name" element={<PlanetPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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
