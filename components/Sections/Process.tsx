import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Process: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.process-step', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const steps = [
        {
            num: '01',
            title: 'Configure',
            desc: 'Define archetype, body metrics, and style attributes using our parametric builder.'
        },
        {
            num: '02',
            title: 'Refine',
            desc: 'Adjust materials, colors, and accessories in real-time with PBR lighting previews.'
        },
        {
            num: '03',
            title: 'Export',
            desc: 'Download game-ready assets instantly. No manual rigging or retopology required.'
        }
    ];

    return (
        <section id="process" ref={sectionRef} className="py-32 max-[599px]:py-10 px-6 bg-voxel-950 border-t border-voxel-800">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 max-[599px]:mb-6 text-center max-[599px]:text-left">
                    <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-2">Workflow</span>
                    <h2 className="font-display text-4xl font-bold">FROM CONCEPT TO GAME</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-[599px]:gap-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="process-step relative p-8 border-l border-voxel-800 hover:border-white transition-colors duration-500 pl-8">
                            <div className="font-mono text-xs text-voxel-500 mb-6">STEP {step.num}</div>
                            <h3 className="font-display text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-voxel-400 text-sm leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;