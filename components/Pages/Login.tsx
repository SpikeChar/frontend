import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../Context/AuthContext';
import { useSettings } from '../Context/SettingsContext';
import { Wallet, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSettings();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/workspace');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleLogin = () => {
    playSound('click');
    login();
    navigate('/workspace');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-voxel-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-voxel-900 border border-voxel-800 p-8 md:p-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="login-item font-display text-3xl font-bold mb-2">ACCESS TERMINAL</h1>
          <p className="login-item text-voxel-400 text-sm">Authenticate to enter creator workspace.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            className="login-item w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-voxel-200 transition-colors flex items-center justify-center gap-3"
          >
            <Wallet size={18} />
            Connect Wallet
          </button>

          <button 
            onClick={handleLogin}
            className="login-item w-full py-4 border border-voxel-700 text-voxel-300 font-bold uppercase tracking-widest text-xs hover:bg-voxel-800 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <Mail size={18} />
            Continue with Email
          </button>
        </div>

        <div className="login-item mt-8 text-center">
            <p className="text-[10px] text-voxel-600 font-mono uppercase">By connecting, you agree to the protocol terms.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
