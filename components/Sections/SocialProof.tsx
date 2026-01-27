import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SocialProof: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.quote-fade', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-6 bg-voxel-950 relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
             
             <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="quote-fade mb-12">
                    <span className="font-mono text-voxel-500 text-xs uppercase tracking-[0.2em]">Trusted By Creators</span>
                </div>
                
                <blockquote className="quote-fade font-display text-3xl md:text-5xl font-medium leading-tight mb-12">
                    "Spike Labs has completely redefined our production pipeline. The asset quality is unmatched in the modular space."
                </blockquote>

                <div className="quote-fade flex flex-col items-center gap-2">
                    <cite className="not-italic font-bold text-white">Alex Chen</cite>
                    <span className="text-sm text-voxel-500 font-mono uppercase">Lead Environment Artist, PolyArc</span>
                </div>

                <div className="quote-fade mt-20 pt-10 border-t border-voxel-900 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Logos using text for simplicity */}
                    <span className="text-xl font-display font-bold">UNITY</span>
                    <span className="text-xl font-display font-bold">UNREAL</span>
                    <span className="text-xl font-display font-bold">NVIDIA</span>
                    <span className="text-xl font-display font-bold">BLENDER</span>
                    <span className="text-xl font-display font-bold">POLYGON</span>
                </div>
             </div>
        </section>
    );
};

export default SocialProof;