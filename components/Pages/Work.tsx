import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Work: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
             gsap.from('.work-item', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const projects = [
        { id: '01', title: 'Neon Genesis', cat: 'Environment Kit' },
        { id: '02', title: 'Cyber Samurai', cat: 'Character Series' },
        { id: '03', title: 'Void Walkers', cat: 'Wearable Collection' },
    ];

    return (
        <div ref={containerRef} className="pt-40 pb-20 px-6 min-h-screen bg-voxel-950">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-display text-5xl md:text-8xl font-bold mb-20">SELECTED WORKS</h1>
                
                <div className="space-y-24">
                    {projects.map((project) => (
                        <div key={project.id} className="work-item group cursor-pointer">
                            <div className="w-full h-[60vh] bg-voxel-900 border border-voxel-800 mb-6 overflow-hidden relative">
                                <div className="absolute inset-0 bg-voxel-800/50 group-hover:bg-transparent transition-colors duration-500"></div>
                                {/* Placeholder for project image */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-voxel-700 font-display text-9xl font-bold opacity-20 group-hover:opacity-40 transition-opacity">
                                    {project.id}
                                </div>
                            </div>
                            <div className="flex justify-between items-baseline border-b border-voxel-800 pb-4 group-hover:border-white transition-colors">
                                <h2 className="font-display text-3xl md:text-4xl font-bold">{project.title}</h2>
                                <span className="font-mono text-sm uppercase text-voxel-500">{project.cat}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Work;