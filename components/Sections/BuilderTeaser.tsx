import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '../Context/SettingsContext';
import { Hexagon, Component, Palette, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const BuilderTeaser: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { playSound, motionEnabled } = useSettings();
    const [selectedAttr, setSelectedAttr] = useState(0);

    const attributes = [
        { label: 'Base Mesh', icon: Hexagon, value: 'Humanoid_01' },
        { label: 'Attire', icon: Component, value: 'Cyber_V2' },
        { label: 'Palette', icon: Palette, value: 'Neon_Dusk' }
    ];

    useEffect(() => {
        if (!motionEnabled) return;
        
        const ctx = gsap.context(() => {
            gsap.from('.teaser-anim', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%'
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
        <section id="builder" ref={containerRef} className="py-32 px-6 bg-voxel-950 border-b border-voxel-800 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                
                {/* Left: Content */}
                <div className="w-full md:w-1/2">
                    <span className="teaser-anim font-mono text-green-500 text-sm tracking-widest uppercase block mb-4">Web3 Ready</span>
                    <h2 className="teaser-anim font-display text-5xl md:text-6xl font-bold mb-6">
                        BUILD YOUR <br />
                        <span className="text-voxel-400">ON-CHAIN IDENTITY</span>
                    </h2>
                    <p className="teaser-anim text-xl text-voxel-300 mb-8 leading-relaxed">
                        Create interoperable NFT avatars directly in your browser. Export GLB/GLTF files optimized for the open metaverse and decentralized games.
                    </p>
                    
                    <div className="teaser-anim flex flex-col gap-4">
                        {attributes.map((attr, idx) => {
                            const Icon = attr.icon;
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => { setSelectedAttr(idx); playSound('click'); }}
                                    className={`p-4 border cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                                        selectedAttr === idx ? 'bg-voxel-900 border-white' : 'bg-transparent border-voxel-800 hover:border-voxel-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded ${selectedAttr === idx ? 'bg-white text-black' : 'bg-voxel-800 text-voxel-400'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-mono uppercase text-voxel-500 tracking-wider">{attr.label}</span>
                                            <span className={`font-bold transition-colors ${selectedAttr === idx ? 'text-white' : 'text-voxel-300 group-hover:text-white'}`}>{attr.value}</span>
                                        </div>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${selectedAttr === idx ? 'bg-green-500' : 'bg-voxel-800'}`}></div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="teaser-anim mt-10">
                        <Link to="/login" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-green-400 hover:border-green-400 transition-all">
                            Enter Workspace <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Right: Visual Teaser */}
                <div className="teaser-anim w-full md:w-1/2 relative aspect-square md:aspect-[4/5] bg-voxel-900 rounded-lg overflow-hidden border border-voxel-800 flex items-center justify-center">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    
                    {/* Simulated 3D Character Placeholder */}
                    <div className="relative z-10 w-64 h-96 transition-all duration-500">
                         {/* This represents the character changing based on selection */}
                         <div className={`w-full h-full bg-voxel-800 relative flex items-center justify-center border-2 border-white/10 transition-all duration-500 ${selectedAttr === 1 ? 'scale-105' : 'scale-100'}`}>
                            {/* Abstract Body */}
                            <div className="w-32 h-64 bg-voxel-700 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 transition-opacity duration-500 ${selectedAttr === 2 ? 'opacity-100' : 'opacity-0'}`}></div>
                                {/* Highlight based on selection */}
                                {selectedAttr === 0 && <div className="absolute inset-0 border-2 border-green-500/50 animate-pulse"></div>}
                            </div>
                            
                            {/* Floating UI Elements */}
                            <div className="absolute top-4 right-4 space-y-2">
                                <div className="w-20 h-2 bg-voxel-600 rounded animate-pulse"></div>
                                <div className="w-12 h-2 bg-voxel-600 rounded animate-pulse delay-75"></div>
                            </div>

                            {/* Export Badge */}
                            <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/50 backdrop-blur border border-white/20 text-[10px] font-mono uppercase text-green-400">
                                GLB Ready
                            </div>
                         </div>
                    </div>

                    {/* Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                </div>
            </div>
        </section>
    );
};

export default BuilderTeaser;
