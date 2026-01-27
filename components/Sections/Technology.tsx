import React, { useRef, useEffect } from 'react';
import { FEATURES } from '../../constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const Technology: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useSettings();

  useEffect(() => {
    if (!motionEnabled) return;
    
    const ctx = gsap.context(() => {
        // Only enable horizontal scroll on larger screens
        const mm = gsap.matchMedia();
        
        mm.add("(min-width: 768px)", () => {
            const container = containerRef.current;
            if (!container) return;

            const totalWidth = container.scrollWidth;
            const viewportWidth = window.innerWidth;
            
            gsap.to(container, {
                x: () => -(totalWidth - viewportWidth + 100), // +100 for padding
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + container.scrollWidth,
                }
            });
        });
    }, sectionRef);

    return () => ctx.revert();
  }, [motionEnabled]);

  return (
    <section id="technology" ref={sectionRef} className="bg-voxel-950 relative overflow-hidden flex flex-col justify-center min-h-screen">
      <div className="container mx-auto px-6 mb-12 md:absolute md:top-24 md:left-6 md:mb-0 z-10">
        <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-2">03 — Specs</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold">CORE TECHNOLOGY</h2>
      </div>

      <div ref={containerRef} className={`flex flex-col md:flex-row gap-6 md:gap-20 px-6 md:pl-[20vw] items-center ${!motionEnabled ? 'overflow-x-auto' : ''}`}>
        {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
                <div key={index} className="w-full md:w-[400px] md:h-[500px] flex-shrink-0 bg-voxel-900 border border-voxel-800 p-8 md:p-12 flex flex-col justify-between hover:border-voxel-600 transition-colors duration-500 group">
                    <div className="w-12 h-12 bg-voxel-800 rounded flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-colors duration-500">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-display text-2xl font-bold mb-4">{feature.title}</h3>
                        <p className="text-voxel-400 leading-relaxed border-t border-voxel-800 pt-6">
                            {feature.description}
                        </p>
                    </div>
                    <div className="mt-8 font-mono text-xs text-voxel-600 uppercase tracking-wider">
                        Spec_0{index + 1}
                    </div>
                </div>
            );
        })}
        {/* Extra spacer for scroll end */}
        <div className="w-1 md:w-20 shrink-0"></div>
      </div>
    </section>
  );
};

export default Technology;