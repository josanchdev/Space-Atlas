import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './styles/header.css'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import SolarSystemPage from './pages/SolarSystemPage'
import PlanetPage from './pages/PlanetPage'
import SolarSystem from './components/SolarSystem'
import NewsPage from './pages/NewsPage'
import ExplorePage from './pages/ExplorePage'
import ScientistsPage from './pages/ScientistsPage'
import SpaceMissionsPage from './pages/SpaceMissionsPage'
import SpaceMissionDetailPage from './pages/SpaceMissionDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="body-with-header">
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
    </BrowserRouter>
  )
}

export default App
