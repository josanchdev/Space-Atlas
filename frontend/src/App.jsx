import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './styles/header.css'
import Header from './components/Header'
import SolarSystemPage from './pages/SolarSystemPage'
import PlanetPage from './pages/PlanetPage'
import SolarSystem from './components/SolarSystem'
import NewsPage from './pages/NewsPage'
import ExplorePage from './pages/ExplorePage'
import ScientistsPage from './pages/ScientistsPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="body-with-header">
        <Routes>
          <Route path="/" element={<SolarSystem />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/planets" element={<SolarSystemPage />} />
          <Route path="/solar-system" element={<SolarSystemPage />} />
          <Route path="/:name" element={<PlanetPage />} />
          <Route path="/scientists" element={<ScientistsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
