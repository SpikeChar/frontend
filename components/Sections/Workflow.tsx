import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Workflow: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.workflow-step', {
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
            title: 'Browse & Select',
            desc: 'Explore our curated library of modular assets. Filter by category, polygon count, or compatibility.'
        },
        {
            num: '02',
            title: 'Configure',
            desc: 'Use the interactive inspector to toggle layers, adjust materials, and preview animations in real-time.'
        },
        {
            num: '03',
            title: 'Export & Deploy',
            desc: 'Download optimized files (GLB, FBX, USDZ) ready for Unity, Unreal Engine 5, or React Three Fiber.'
        }
    ];

    return (
        <section ref={sectionRef} className="py-32 px-6 bg-voxel-950 border-t border-voxel-800">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 max-w-2xl">
                    <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-2">Process</span>
                    <h2 className="font-display text-4xl font-bold">STREAMLINED WORKFLOW</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="workflow-step relative p-8 border border-voxel-800 bg-voxel-900/50 hover:bg-voxel-900 transition-colors duration-300">
                            <div className="font-display text-6xl font-bold text-voxel-800 mb-8 absolute top-4 right-4 opacity-50 select-none">
                                {step.num}
                            </div>
                            <div className="relative z-10 pt-4">
                                <div className="w-12 h-1 bg-white mb-8"></div>
                                <h3 className="font-display text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-voxel-400 text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Workflow;