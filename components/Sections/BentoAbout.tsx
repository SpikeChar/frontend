import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box, Layers, Zap, Globe, Users, Cpu } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const BentoAbout: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { motionEnabled } = useSettings();

    useEffect(() => {
        if (!motionEnabled) return;

        const ctx = gsap.context(() => {
            gsap.from('.bento-item', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, [motionEnabled]);

    return (
        <section id="about" ref={containerRef} className="py-32 px-6 bg-voxel-950">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">THE CHARACTER ENGINE</h2>
                    <p className="text-voxel-400 max-w-2xl text-lg">
                        We build the tools that power the next generation of digital identity. 
                        From indie games to massive metaverse platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                    {/* Main Large Block */}
                    <div className="bento-item md:col-span-2 md:row-span-2 bg-voxel-900 border border-voxel-800 p-8 md:p-12 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black mb-8">
                                <Box size={24} />
                            </div>
                            <div>
                                <h3 className="font-display text-3xl font-bold mb-4">Unified 3D Pipeline</h3>
                                <p className="text-voxel-400 leading-relaxed">
                                    Forget fragmented workflows. Voxel Studios provides a single, cohesive environment to rig, texture, and optimize your characters. Export directly to Unity, Unreal, or WebGL with zero friction.
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Top Right Block */}
                    <div className="bento-item bg-voxel-900 border border-voxel-800 p-8 rounded-2xl flex flex-col justify-center group hover:border-voxel-700 transition-colors">
                        <Users className="text-voxel-400 mb-4 group-hover:text-white transition-colors" size={28} />
                        <h4 className="font-display text-xl font-bold mb-2">Team Ready</h4>
                        <p className="text-sm text-voxel-500">
                            Multi-seat licenses and collaborative cloud workspaces for studios.
                        </p>
                    </div>

                    {/* Bottom Right Block */}
                    <div className="bento-item bg-voxel-900 border border-voxel-800 p-8 rounded-2xl flex flex-col justify-center group hover:border-voxel-700 transition-colors">
                        <Cpu className="text-voxel-400 mb-4 group-hover:text-white transition-colors" size={28} />
                        <h4 className="font-display text-xl font-bold mb-2">Performance First</h4>
                        <p className="text-sm text-voxel-500">
                            Automated LOD generation and texture atlasing for any platform.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BentoAbout;