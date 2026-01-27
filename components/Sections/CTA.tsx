import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../UI/Magnetic';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const CTA: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { playSound, motionEnabled } = useSettings();

    useEffect(() => {
        if(!motionEnabled) return;
        const ctx = gsap.context(() => {
            gsap.from('.cta-content', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, [motionEnabled]);

    return (
        <section ref={containerRef} className="py-40 px-6 bg-voxel-950 border-t border-voxel-800 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="cta-content font-display text-5xl md:text-7xl font-bold mb-8 leading-tight">
                    READY TO <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-voxel-500">ASSEMBLE?</span>
                </h2>
                <p className="cta-content text-xl text-voxel-400 mb-12 max-w-2xl mx-auto font-light">
                    Join the closed beta and start building your persistent digital universe today.
                </p>
                <div className="cta-content">
                    <Magnetic strength={60}>
                        <button 
                            onMouseEnter={() => playSound('hover')}
                            onClick={() => playSound('click')}
                            className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:pr-12"
                        >
                            <span className="relative z-10">Start Creating</span>
                            <div className="absolute inset-0 bg-voxel-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">→</span>
                        </button>
                    </Magnetic>
                </div>
            </div>
            
            <div className="absolute bottom-6 left-0 w-full text-center">
                 <p className="text-[10px] text-voxel-600 font-mono uppercase tracking-widest">Spike Labs © 2026</p>
            </div>
        </section>
    );
};

export default CTA;