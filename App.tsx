import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import SmoothScroll from './components/Layout/SmoothScroll';
import TransitionOverlay from './components/UI/TransitionOverlay';
import { SettingsProvider } from './components/Context/SettingsContext';
import { AuthProvider } from './components/Context/AuthContext';

// Pages
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Services from './components/Pages/Services';
import Pricing from './components/Pages/Pricing';
import Contact from './components/Pages/Contact';
import Work from './components/Pages/Work';
import Workshop from './components/Pages/Workshop';
import Login from './components/Pages/Login';
import Workspace from './components/Pages/Workspace';

const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash, try to scroll to it
    if (hash) {
      // Use a small timeout to ensure DOM is ready after route transition
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } 
    // Handled by TransitionOverlay for standard routes if motion enabled, 
    // but good fallback if disabled or if transition doesn't handle scroll reset instantly
  }, [pathname, hash]);

  return null;
};

// Layout wrapper to conditionally show Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isWorkspace = location.pathname === '/workspace';

    return (
        <main className="bg-voxel-950 min-h-screen w-full overflow-hidden flex flex-col">
            <Navbar />
            <div className="flex-grow">
                {children}
            </div>
            {!isWorkspace && <Footer />}
        </main>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <SmoothScroll>
            <TransitionOverlay />
            <ScrollHandler />
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/work" element={<Work />} />
                <Route path="/workshop" element={<Workshop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
              </Routes>
            </MainLayout>
          </SmoothScroll>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
