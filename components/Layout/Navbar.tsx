import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, Settings, Volume2, VolumeX, Zap, ZapOff, UserCircle, ArrowRight, Wallet } from 'lucide-react';
import Magnetic from '../UI/Magnetic';
import { useSettings } from '../Context/SettingsContext';
import { useAuth } from '../Context/AuthContext';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, motionEnabled, toggleMotion, playSound } = useSettings();
  
  // 2. Initialize AppKit hooks
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  
  const isLoggedIn = isConnected;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
        gsap.fromTo('.workspace-link', 
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
        );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.to(mobileMenuRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' });
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSettingsOpen) {
      gsap.to(settingsMenuRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' });
    } else {
      gsap.to(settingsMenuRef.current, { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [isSettingsOpen]);

  const handleNavClick = (path: string, hash?: string, to?: string) => {
    setIsMobileMenuOpen(false);
    playSound('click');
   
    if (to && !to.startsWith('#')) {
        navigate(to);
        return;
    }
    
    if (path === '/') {
        if (location.pathname !== '/') {
            navigate('/' + (hash || ''));
        }
        else if (hash && location.hash !== hash) {
            navigate(hash);
        }
        else if (hash) {
            const element = document.querySelector(hash);
            element?.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } else {
        navigate(path);
    }
};

  const NavLink = ({ label, hash, to }: { label: string, hash?: string , to?: string }) => {
    return (
        <Magnetic>
            <button 
                onClick={() => handleNavClick('/', hash, to)} 
                className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 px-2 py-1 text-voxel-400 hover:text-white`}
            >
                {label}
            </button>
        </Magnetic>
    );
  };

  return (
    <>
        <nav 
            ref={navRef}
            className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-voxel-950/80 backdrop-blur-md"
        >
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Magnetic>
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} onMouseEnter={() => playSound('hover')} className="font-display font-bold text-xl tracking-tight flex items-center gap-0 text-white">
                            <img src="/nobg_logo.png" alt="spike logo" className="w-16 h-16 object-contain" />
                            <span>SPIKE LABS</span>
                        </Link>
                    </Magnetic>

                    <div className="hidden md:flex gap-6 items-center">
                        <NavLink label="About" hash="#about" />
                        <NavLink label="Specs" hash="#specs"/>
                        <NavLink label="Services" hash="#services" />
                        <NavLink label="Pricing" hash="#pricing" />
                        <NavLink label="Contacts" to='/contact' />
                    </div>
                </div>

                <div className="hidden md:flex gap-4 items-center relative">
                    {isLoggedIn && (
                        <div className="workspace-link flex items-center mr-4">
                            <Magnetic>
                                <button 
                                    onClick={() => handleNavClick('/workshop')}
                                    className="text-sm font-bold uppercase tracking-wider text-green-400 hover:text-green-300 transition-colors px-2 py-1 flex items-center gap-2 border border-green-500/20 rounded bg-green-500/5"
                                >
                                    <Zap size={14} />
                                    Workshop
                                </button>
                            </Magnetic>
                        </div>
                    )}

                    <div className="relative z-50">
                        <Magnetic>
                            <button 
                                onClick={() => { setIsSettingsOpen(!isSettingsOpen); playSound('click'); }}
                                className="w-10 h-10 flex items-center justify-center text-voxel-400 hover:text-white hover:rotate-90 transition-all duration-500"
                            >
                                <Settings size={18} />
                            </button>
                        </Magnetic>
                        
                        <div 
                            ref={settingsMenuRef}
                            className="absolute top-12 right-0 w-48 bg-voxel-900 border border-voxel-800 p-4 rounded shadow-2xl origin-top-right opacity-0 -translate-y-4"
                            style={{ display: isSettingsOpen ? 'block' : 'none' }}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono uppercase text-voxel-400">Sound</span>
                                    <button onClick={toggleSound} className="text-white hover:text-voxel-300">
                                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                    </button>
                                </div>
                                <div className="w-full h-px bg-voxel-800"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono uppercase text-voxel-400">Motion</span>
                                    <button onClick={toggleMotion} className="text-white hover:text-voxel-300">
                                        {motionEnabled ? <Zap size={16} /> : <ZapOff size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <Magnetic>
                                <div 
                                    onClick={() => open()} 
                                    className="px-3 py-1.5 rounded bg-voxel-800 border border-voxel-700 flex items-center gap-2 text-voxel-300 cursor-pointer hover:border-voxel-500 transition-colors"
                                >
                                    <span className="text-xs font-mono">
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                    <UserCircle size={18} />
                                </div>
                            </Magnetic>
                            <button 
                                onClick={() => { disconnect(); playSound('click'); }} 
                                className="text-xs font-bold uppercase tracking-widest text-voxel-400 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Magnetic>
                            <button 
                                onClick={() => open()} 
                                onMouseEnter={() => playSound('hover')} 
                                className="border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 text-white flex items-center gap-2"
                            >
                                <Wallet size={14} />
                                Connect Wallet
                            </button>
                        </Magnetic>
                    )}
                </div>

                <div className="md:hidden z-50 flex gap-4">
                    <button 
                      onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); playSound('click'); }} 
                      className="text-white"
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>

        <div 
            ref={mobileMenuRef}
            className="fixed inset-0 bg-voxel-950 z-40 flex flex-col justify-center items-center gap-8 translate-x-full md:hidden"
        >
            <button onClick={() => handleNavClick('/', '#about')} className="text-2xl font-display font-bold text-white">About</button>
            <button onClick={() => handleNavClick('/', '#specs')} className="text-2xl font-display font-bold text-white">Specs</button>
            <button onClick={() => handleNavClick('/', '#services')} className="text-2xl font-display font-bold text-white">Services</button>
            <button onClick={() => handleNavClick('/', '#pricing')} className="text-2xl font-display font-bold text-white">Pricing</button>
            <button onClick={() => handleNavClick('/contact')} className="text-2xl font-display font-bold text-white">Contact</button>
            
            {isLoggedIn && (
                <button onClick={() => handleNavClick('/workspace')} className="text-2xl font-display font-bold text-green-500 mt-4 flex items-center gap-2">
                    Open Workshop <ArrowRight size={20} />
                </button>
            )}

            <div className="flex gap-8 mt-8 border-t border-voxel-800 pt-8">
                 <button onClick={toggleSound} className="flex flex-col items-center gap-2 text-voxel-400">
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    <span className="text-[10px] uppercase tracking-widest">Sound</span>
                </button>
                <button onClick={toggleMotion} className="flex flex-col items-center gap-2 text-voxel-400">
                    {motionEnabled ? <Zap size={24} /> : <ZapOff size={24} />}
                    <span className="text-[10px] uppercase tracking-widest">Motion</span>
                </button>
            </div>

            {isLoggedIn ? (
                 <button 
                    onClick={() => { disconnect(); setIsMobileMenuOpen(false); }} 
                    className="text-xl font-display font-bold text-voxel-500 mt-4"
                >
                    Disconnect
                </button>
            ) : (
                 <button 
                    onClick={() => { open(); setIsMobileMenuOpen(false); }} 
                    className="text-2xl font-display font-bold text-white mt-4 border border-white/20 px-8 py-3"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    </>
  );
};

export default Navbar;