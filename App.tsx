import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import SmoothScroll from './components/Layout/SmoothScroll';
import TransitionOverlay from './components/UI/TransitionOverlay';
import { SettingsProvider } from './components/Context/SettingsContext';
import { AuthProvider } from './components/Context/AuthContext';
import { Web3Provider } from './components/Context/Web3Provider'; 

// Pages
import Home from './components/Pages/Home';
import Contact from './components/Pages/Contact';
import Workshop from './components/Pages/Workshop';
import Login from './components/Pages/Login';
import Workspace from './components/Pages/Workspace';
import CustomCursor from './components/Layout/Cursor';

const ScrollHandler = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } 
  }, [pathname, hash]);

  return null;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const hideFooter = location.pathname === '/workspace' || location.pathname === '/workshop';

    return (
        <main className="bg-voxel-950 min-h-screen w-full overflow-hidden flex flex-col relative">
          <CustomCursor/>
            <Navbar />
            <div className="flex-grow">
                {children}
            </div>
            {!hideFooter && <Footer />}
        </main>
    );
};

const App: React.FC = () => {
  return (
    <Web3Provider>
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <SmoothScroll>
              <TransitionOverlay />
              <ScrollHandler />
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/workshop" element={<Workshop />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/workspace" element={<Workspace />} />
                </Routes>
              </MainLayout>
            </SmoothScroll>
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </Web3Provider>
  );
};

export default App;