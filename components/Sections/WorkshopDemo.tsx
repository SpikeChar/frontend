import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, RefreshCw, Wand2, Hexagon, Palette, Component, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const WorkshopDemo: React.FC = () => {
    const { playSound, motionEnabled } = useSettings();
    const sectionRef = useRef<HTMLElement>(null);
    const characterRef = useRef<HTMLDivElement>(null);
    const [config, setConfig] = useState({
        type: 'Humanoid',
        color: '#3b82f6', // blue-500
        outfit: 'Standard'
    });

    // Entrance Animation
    useEffect(() => {
        if (!motionEnabled) return;
        const ctx = gsap.context(() => {
            gsap.from('.demo-ui', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [motionEnabled]);

    // Character Update Animation
    useEffect(() => {
        if (!characterRef.current) return;
        
        gsap.fromTo(characterRef.current, 
            { scale: 0.95, filter: 'blur(4px)' },
            { scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'back.out(1.5)' }
        );
    }, [config]);

    const handleConfig = (key: string, val: string) => {
        playSound('click');
        setConfig(prev => ({ ...prev, [key]: val }));
    };

    const colors = ['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

    return (
        <section ref={sectionRef} className="py-32 px-6 bg-voxel-950 border-y border-voxel-800 relative overflow-hidden">
             {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                
                {/* Text Content */}
                <div className="w-full lg:w-1/3">
                    <span className="demo-ui font-mono text-green-500 text-sm tracking-widest uppercase block mb-4">Interactive Demo</span>
                    <h2 className="demo-ui font-display text-5xl font-bold mb-6">
                        DESIGN IN <br />
                        REAL-TIME
                    </h2>
                    <p className="demo-ui text-lg text-voxel-300 mb-8 leading-relaxed">
                        Try our engine right here. Modify geometry, material, and assets instantly. This is just a fraction of what's possible in the full Workshop.
                    </p>
                    
                    <div className="demo-ui">
                        <Link to="/workshop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-colors rounded-sm">
                            Launch Full Workshop <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Real-time Canvas */}
                <div className="demo-ui w-full lg:w-2/3 bg-voxel-900 rounded-xl border border-voxel-800 p-2 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row h-[600px] bg-voxel-950 rounded-lg overflow-hidden">
                        
                        {/* 1. Viewport (Left/Top) */}
                        <div className="relative flex-grow h-[350px] md:h-full bg-gradient-to-b from-voxel-900 to-voxel-950 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                            
                            {/* The Character Visual */}
                            <div ref={characterRef} className="relative z-10 w-full max-w-[300px] h-[400px] flex flex-col items-center justify-center transition-all">
                                {/* Aura/Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10" style={{ backgroundColor: `${config.color}20` }}></div>

                                {/* Head */}
                                <div 
                                    className="w-20 h-20 mb-2 relative transition-all duration-300 border border-white/10 shadow-lg"
                                    style={{ 
                                        backgroundColor: config.type === 'Droid' ? '#27272a' : config.color,
                                        borderRadius: config.type === 'blocky' ? '4px' : config.type === 'Droid' ? '50%' : '16px',
                                    }}
                                >
                                    {/* Eyes/Visor */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/4 bg-black/50 backdrop-blur rounded-full"></div>
                                </div>

                                {/* Torso */}
                                <div 
                                    className="w-32 h-40 mb-2 relative transition-all duration-300 flex items-center justify-center border border-white/5 overflow-hidden"
                                    style={{
                                        backgroundColor: '#18181b', // Base dark suit
                                        borderRadius: config.type === 'blocky' ? '4px' : '24px',
                                    }}
                                >
                                    {/* Chest Plate (Color Accent) */}
                                    <div className="w-16 h-20 rounded-b-xl opacity-80" style={{ backgroundColor: config.color }}></div>
                                    
                                    {/* Outfit Details */}
                                    {config.outfit === 'Tactical' && (
                                        <div className="absolute inset-0 border-4 border-voxel-700 m-2 rounded-xl"></div>
                                    )}
                                    {config.outfit === 'Street' && (
                                        <div className="absolute top-4 w-full h-2 bg-white/20 -skew-y-6"></div>
                                    )}
                                </div>

                                {/* Legs */}
                                <div className="flex gap-2">
                                    <div className="w-10 h-32 bg-voxel-800 rounded-b-full border-t border-white/10"></div>
                                    <div className="w-10 h-32 bg-voxel-800 rounded-b-full border-t border-white/10"></div>
                                </div>

                                {/* Platform */}
                                <div className="absolute bottom-0 w-48 h-12 bg-black/40 blur-lg rounded-[100%] translate-y-6"></div>
                            </div>

                            {/* Viewport Overlay UI */}
                            <div className="absolute top-4 left-4 px-2 py-1 bg-black/40 backdrop-blur border border-white/10 text-[10px] font-mono uppercase text-voxel-400 rounded">
                                PREVIEW_MODE
                            </div>
                        </div>

                        {/* 2. Controls (Right/Bottom) */}
                        <div className="w-full md:w-64 bg-voxel-900 border-l border-voxel-800 p-6 flex flex-col gap-8 z-20">
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-voxel-500 mb-3 tracking-widest">
                                    <Hexagon size={12} /> Model Type
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Humanoid', 'Droid', 'Blocky'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => handleConfig('type', t)}
                                            className={`p-2 text-xs border rounded transition-colors ${config.type === t ? 'bg-white text-black border-white' : 'bg-voxel-950 border-voxel-800 text-voxel-400 hover:border-voxel-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-voxel-500 mb-3 tracking-widest">
                                    <Palette size={12} /> Accent Color
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => handleConfig('color', c)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-voxel-500 mb-3 tracking-widest">
                                    <Component size={12} /> Outfit
                                </label>
                                <div className="space-y-2">
                                    {['Standard', 'Tactical', 'Street'].map(o => (
                                        <button
                                            key={o}
                                            onClick={() => handleConfig('outfit', o)}
                                            className={`w-full p-3 text-xs text-left border rounded transition-all flex justify-between items-center ${config.outfit === o ? 'bg-voxel-800 border-voxel-600 text-white' : 'bg-voxel-950 border-voxel-800 text-voxel-400 hover:border-voxel-700'}`}
                                        >
                                            {o}
                                            {config.outfit === o && <Check size={12} className="text-green-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-voxel-800">
                                <div className="flex gap-2 justify-center text-voxel-500">
                                    <button onClick={() => {playSound('click'); setConfig({type: 'Humanoid', color: '#3b82f6', outfit: 'Standard'})}} title="Reset">
                                        <RefreshCw size={16} className="hover:text-white transition-colors" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkshopDemo;