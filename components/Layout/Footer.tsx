import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitter, Instagram, Github, Disc } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-voxel-950 border-t border-voxel-800 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-display font-bold text-2xl tracking-tight block mb-6">SPIKE LABS</Link>
            <p className="text-voxel-400 text-sm leading-relaxed max-w-xs">
              Premium modular digital assets for the next generation of spatial experiences. Built for performance, designed for impact.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-voxel-500 tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium text-voxel-300">
              <li><Link to="/about" className="hover:text-white transition-colors">About Studio</Link></li>
              <li><Link to="/work" className="hover:text-white transition-colors">Selected Work</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-mono text-xs uppercase text-voxel-500 tracking-widest mb-6">Resources</h4>
             <ul className="space-y-4 text-sm font-medium text-voxel-300">
               <li><Link to="/workshop" className="hover:text-white transition-colors">Workshop</Link></li>
               <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
               <li><a href="#" className="hover:text-white transition-colors">License</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
             </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-voxel-500 tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
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
            <Link to="/contact" className="text-sm border-b border-voxel-700 pb-1 hover:border-white hover:text-white transition-all text-voxel-400 inline-block">
                Start a project
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-voxel-900 flex flex-col md:flex-row justify-between items-center text-xs text-voxel-600 font-mono uppercase tracking-wider">
            <p>© 2026 Spike Labs. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
                <a href="#" className="hover:text-voxel-400">Privacy Policy</a>
                <a href="#" className="hover:text-voxel-400">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;