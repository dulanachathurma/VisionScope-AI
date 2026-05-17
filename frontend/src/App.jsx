import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Scanline from './components/Scanline'
import Home from './pages/Home'
import LiveDetection from './pages/LiveDetection'
import UploadDetection from './pages/UploadDetection'
import About from './pages/About'
import Attendance from './pages/Attendance'

// Inner component so it can access ThemeContext
function AppInner() {
  const { dark } = useTheme()

  // Apply light/dark class to <body>
  useEffect(() => {
    if (dark) {
      document.body.classList.remove('light')
    } else {
      document.body.classList.add('light')
    }
  }, [dark])

  return (
    <Router>
      <Scanline />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/live"       element={<LiveDetection />} />
          <Route path="/upload"     element={<UploadDetection />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/about"      element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
