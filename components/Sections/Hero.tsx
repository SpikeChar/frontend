import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useSettings();

  useEffect(() => {
    if (!motionEnabled) return;

    const ctx = gsap.context(() => {
      // Intro Animation (Load)
      const tl = gsap.timeline();

      tl.from(videoRef.current, {
        scale: 1.1,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out'
      })
      .from(textRef.current?.querySelectorAll('.hero-line'), {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      }, "-=1.0");

      // Scroll Animation (Parallax)
      if (containerRef.current && videoRef.current && textRef.current) {
        gsap.to(videoRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
          y: 200, // Background moves slower
          scale: 1.1, // Slight zoom out/in effect
          opacity: 0.3
        });

        gsap.to(textRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom center',
            scrub: true,
          },
          y: -200, // Text moves up faster than background
          opacity: 0
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [motionEnabled]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-voxel-950">
      
      {/* Video Background */}
      <div ref={videoRef} className="absolute inset-0 z-0 scale-105">
         <div className="absolute inset-0 bg-voxel-950/50 z-10"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-voxel-950 via-transparent to-voxel-950/20 z-10"></div>
         <video 
            autoPlay 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-80"
         >
            <source src="https://res.cloudinary.com/dgvb4ap8o/video/upload/v1769538179/Untitled_design_pt4xzk.mp4" type="video/mp4" />
         </video>
      </div>

      {/* Main Content */}
      <div ref={textRef} className="relative z-20 text-center flex flex-col items-center max-w-5xl px-6">
        <div className="overflow-hidden mb-6">
            <span className="hero-line inline-block py-1 px-3 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm font-mono text-xs text-voxel-200 uppercase tracking-widest">
              SPIKELABS Suite 2.0
            </span>
        </div>
        
        <div className="overflow-hidden mb-8">
            <h1 className="hero-line font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] text-white">
              DIGITAL <br />
              LIFE FORMS
            </h1>
        </div>

        <div className="overflow-hidden max-w-xl">
            <p className="hero-line text-lg md:text-xl text-voxel-300 font-light leading-relaxed">
              The premium infrastructure for creating, optimizing, and deploying 3D characters across games and virtual worlds.
            </p>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className="absolute bottom-12 z-20 flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono text-voxel-500 uppercase tracking-widest">Explore Platform</span>
        <ArrowDown className="w-4 h-4 text-white" />
      </div>
    </section>
  );
};

export default Hero;