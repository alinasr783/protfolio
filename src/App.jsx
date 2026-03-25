import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './utils/CursorAnimation'

// Lazy load components for performance
const Skills = lazy(() => import('./components/Skills'))
const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))

export default function App() {
  return (
    <Router>
      <div className='font-sora scroll-smooth overflow-x-hidden'>
        <CustomCursor/>
        <Navbar />
        
        <main>
          <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={
                <>
                  <Home />
                  <Skills />
                  <About />
                  <Projects />
                  <Contact />
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  )
}
