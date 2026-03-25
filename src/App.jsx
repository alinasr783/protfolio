import React, { Suspense, lazy, useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './utils/CursorAnimation'
import { LazyMotion, domMax } from 'framer-motion'

// Lazy load components for performance
const Skills = lazy(() => import('./components/Skills'))
const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))

// Helper component to only render sections when they are close to being visible
const LazySection = ({ children }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before the section is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {inView ? children : null}
    </div>
  );
};

export default function App() {
  return (
    <LazyMotion features={domMax}>
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
                    <LazySection><Skills /></LazySection>
                    <LazySection><About /></LazySection>
                    <LazySection><Projects /></LazySection>
                    <LazySection><Contact /></LazySection>
                  </>
                } />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </LazyMotion>
  )
}
