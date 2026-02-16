import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitter, Instagram, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use fromTo to ensure consistent starting state
      gsap.fromTo(footerRef.current, 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom', // Start animating when top of footer hits bottom of viewport
            end: 'bottom bottom',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const handleLink = (hash: string) => {
    navigate('/');
    setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer ref={footerRef} className="bg-voxel-950 border-t border-voxel-800 pt-20 max-[599px]:py-10 pb-10 px-6 opacity-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 max-[599px]:mb-10">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-display font-bold text-2xl tracking-tight block mb-6 text-white">SPIKE LABS</Link>
            <p className="text-voxel-400 text-sm leading-relaxed max-w-xs">
              Premium 3D character infrastructure for the next generation of games and virtual experiences.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-voxel-500 tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-voxel-300">
              <li><button onClick={() => handleLink('#about')} className="hover:text-white transition-colors">About</button></li>
              <li><button onClick={() => handleLink('#specs')} className="hover:text-white transition-colors">Specifications</button></li>
              <li><button onClick={() => handleLink('#services')} className="hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => handleLink('#pricing')} className="hover:text-white transition-colors">Pricing</button></li>
            </ul>
          </div>

          <div>
             <h4 className="font-mono text-xs uppercase text-voxel-500 tracking-widest mb-6">Support</h4>
             <ul className="space-y-4 text-sm font-medium text-voxel-300">
               <li><button onClick={() => handleLink('#process')} className="hover:text-white transition-colors">Process</button></li>
               <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
               <li><a href="#" className="hover:text-white transition-colors">License</a></li>
               <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
             </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-voxel-500 tracking-widest mb-6">Social</h4>
            <div className="flex gap-4 mb-6 max-[599px]:mb-0">
                <a href="#" className="w-10 h-10 rounded-full border border-voxel-800 flex items-center justify-center text-voxel-400 hover:text-white hover:bg-voxel-800 transition-all">
                    <Twitter size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-voxel-800 flex items-center justify-center text-voxel-400 hover:text-white hover:bg-voxel-800 transition-all">
                    <Instagram size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-voxel-800 flex items-center justify-center text-voxel-400 hover:text-white hover:bg-voxel-800 transition-all">
                    <Github size={16} />
                </a>
            </div>
          </div>
        </div>

        <div className="pt-8 max-[599px]:pt-0 border-t border-voxel-900 flex flex-col md:flex-row justify-between items-center text-xs text-voxel-600 font-mono uppercase tracking-wider">
            <p>© 2025 SPIKELABS. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
                <a href="#" className="hover:text-voxel-400">Privacy</a>
                <a href="#" className="hover:text-voxel-400">Terms</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;