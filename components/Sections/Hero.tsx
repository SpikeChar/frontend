import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline();

      tl.from(textRef.current?.querySelectorAll('.hero-line'), {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      })
      .from(cubeRef.current, {
        scale: 0,
        rotation: 45,
        opacity: 0,
        duration: 2,
        ease: 'expo.out'
      }, '-=1.2')
      .to('.scroll-cue', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5');

      // Parallax on Scroll
      gsap.to(cubeRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 200,
        rotation: 90,
        scale: 0.8
      });

      gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
        y: 100,
        opacity: 0
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-voxel-950">
      
      {/* Background Grid - Subtle */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-voxel-950/20 to-voxel-950 pointer-events-none"></div>

      {/* Abstract Voxel Visual */}
      <div ref={cubeRef} className="absolute w-[60vh] h-[60vh] md:w-[80vh] md:h-[80vh] border border-voxel-800/30 rounded-full flex items-center justify-center opacity-80 blur-[100px] bg-indigo-900/10 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-voxel-700/20 opacity-40 rotate-45 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[480px] md:h-[480px] border border-voxel-700/20 opacity-30 -rotate-12 z-0"></div>

      {/* Main Content */}
      <div ref={textRef} className="relative z-10 text-center flex flex-col items-center max-w-5xl px-6">
        <div className="overflow-hidden mb-2">
            <p className="hero-line font-mono text-sm md:text-base text-voxel-400 tracking-[0.2em] uppercase mb-4">
            System Online • Version 2.4
            </p>
        </div>
        
        <div className="overflow-hidden">
            <h1 className="hero-line font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-white mb-6">
            BUILD YOUR <br />
            <span className="text-voxel-500">DIGITAL</span> REALITY
            </h1>
        </div>

        <div className="overflow-hidden max-w-2xl">
            <p className="hero-line text-lg md:text-xl text-voxel-300 font-light leading-relaxed">
            A curated collection of modular, high-fidelity voxel assets engineered for the next generation of spatial experiences.
            </p>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className="scroll-cue absolute bottom-12 flex flex-col items-center gap-2 opacity-0 translate-y-4">
        <span className="text-[10px] font-mono text-voxel-500 uppercase tracking-widest">Scroll to Explore</span>
        <ArrowDown className="w-4 h-4 text-voxel-400 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;