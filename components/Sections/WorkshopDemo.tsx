import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, ContactShadows } from '@react-three/drei';
import { ChevronRight, RefreshCw, Hexagon, Palette, Component } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../Context/SettingsContext';
import * as THREE from 'three';

// --- 3D MODEL COMPONENT ---
const ApeModel = ({ colors }: { colors: any }) => {
  const { scene } = useGLTF('/ape.glb');

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // 1. CLONE MATERIAL
        // This makes sure each part of the ape can have its own color
        if (!child.userData.isCloned) {
          child.material = child.material.clone();
          child.userData.isCloned = true;
        }

        const meshName = child.name.toLowerCase();
        const matName = child.material.name.toLowerCase();

        // 2. TARGETING LOGIC
        // We use keywords to find the right part of your specific GLB
        
        // APE SKIN (Body/Head/Hands)
        if (meshName.includes('body') || meshName.includes('skin') || meshName.includes('ape') || 
            matName.includes('body') || matName.includes('skin') || matName.includes('ape')) {
          child.material.color.set(colors.body);
        }

        // GOGGLES / GLASSES
        if (meshName.includes('goggle') || meshName.includes('glass') || meshName.includes('eye') || 
            matName.includes('goggle') || matName.includes('glass') || matName.includes('eye')) {
          child.material.color.set(colors.goggles);
        }

        // APPAREL (Shirt/Hoodie/Jackets)
        if (meshName.includes('shirt') || meshName.includes('outfit') || meshName.includes('cloth') || meshName.includes('jacket') ||
            matName.includes('shirt') || matName.includes('outfit') || matName.includes('cloth') || matName.includes('jacket')) {
          child.material.color.set(colors.outfit);
        }
        
        // Force the material to refresh in the GPU
        child.material.needsUpdate = true;
      }
    });
  }, [colors, scene]);

  return <primitive object={scene} />;
};

// --- MAIN WORKSHOP COMPONENT ---
const WorkshopDemo: React.FC = () => {
    const { playSound } = useSettings();
    
    // Initial state matching the "Original" look from your screenshot
    const [config, setConfig] = useState({
        body: '#ffffff',    // White allows the original orange texture to show
        goggles: '#ffffff',
        outfit: '#18181b',
    });

    const handleConfig = (key: string, val: string) => {
        if (typeof playSound === 'function') {
            playSound('click');
        }
        setConfig(prev => ({ ...prev, [key]: val }));
    };

    const colorPalette = ['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#18181b'];

    return (
        <section className="py-32 px-6 bg-voxel-950 border-y border-voxel-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                
                {/* Left Side: Info */}
                <div className="w-full lg:w-1/3">
                    <span className="font-mono text-green-500 text-sm uppercase tracking-widest block mb-4">Interactive Workshop</span>
                    <h2 className="font-display text-5xl font-bold mb-6 text-white">APE <br />CUSTOMIZER</h2>
                    <p className="text-lg text-voxel-300 mb-8 leading-relaxed">
                        Modify textures and materials in real-time. This demo uses the Spike Engine to override baked GLB maps.
                    </p>
                    <Link to="/workshop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-all rounded-sm">
                        Launch Full Workshop <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Right Side: 3D Canvas + Controls */}
                <div className="w-full lg:w-2/3 bg-voxel-900 rounded-xl border border-voxel-800 p-2 shadow-2xl h-[600px] flex flex-col md:flex-row overflow-hidden">
                    
                    {/* Viewport */}
                    <div className="relative flex-grow h-[350px] md:h-full bg-voxel-950">
                        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
                            <Suspense fallback={null}>
                                <Stage intensity={0.6} environment="city" adjustCamera>
                                    <ApeModel colors={config} />
                                </Stage>
                                <OrbitControls makeDefault enableZoom={true} />
                            </Suspense>
                            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                        </Canvas>
                        
                        <div className="absolute top-4 left-4 px-2 py-1 bg-black/40 backdrop-blur border border-white/10 text-[10px] font-mono text-voxel-400 rounded uppercase tracking-tighter">
                            RT_Customizer_v3.0
                        </div>
                    </div>

                    {/* Controls Sidebar */}
                    <div className="w-full md:w-64 bg-voxel-900 border-l border-voxel-800 p-6 flex flex-col gap-8">
                        
                        {/* Body Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-voxel-500 mb-3 tracking-widest">
                                <Palette size={12} /> Ape Skin
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {colorPalette.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => handleConfig('body', c)} 
                                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${config.body === c ? 'border-white scale-110' : 'border-transparent'}`} 
                                        style={{ backgroundColor: c }} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Goggles Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-voxel-500 mb-3 tracking-widest">
                                <Hexagon size={12} /> Goggles
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {colorPalette.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => handleConfig('goggles', c)} 
                                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${config.goggles === c ? 'border-white scale-110' : 'border-transparent'}`} 
                                        style={{ backgroundColor: c }} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Apparel Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-voxel-500 mb-3 tracking-widest">
                                <Component size={12} /> Apparel
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {colorPalette.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => handleConfig('outfit', c)} 
                                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${config.outfit === c ? 'border-white scale-110' : 'border-transparent'}`} 
                                        style={{ backgroundColor: c }} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button 
                            onClick={() => setConfig({body: '#ffffff', goggles: '#ffffff', outfit: '#18181b'})} 
                            className="mt-auto flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase tracking-widest text-voxel-500 hover:text-white border border-voxel-800 hover:border-voxel-600 transition-colors"
                        >
                            <RefreshCw size={14} /> Reset Model
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkshopDemo;