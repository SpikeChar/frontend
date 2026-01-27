import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RefreshCw, Maximize, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const InteractivePreview: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('wireframe');
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 75%'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="preview" className="py-24 px-6 bg-voxel-900 border-t border-voxel-800">
        <div ref={containerRef} className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
                <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-4">02 — Studio</span>
                <h2 className="font-display text-4xl font-bold text-white mb-4">INTERACTIVE INSPECTOR</h2>
                <p className="text-voxel-400">Analyze topology, material layers, and skeletal rigs in real-time.</p>
            </div>

            {/* Configurator Interface */}
            <div className="relative w-full aspect-video bg-voxel-950 border border-voxel-800 rounded-sm overflow-hidden shadow-2xl">
                
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                
                {/* Center Content Placeholder */}
                <div ref={previewRef} className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64 border border-voxel-700/50 bg-voxel-800/20 backdrop-blur-sm animate-pulse flex items-center justify-center">
                        <div className="text-voxel-600 font-mono text-xs uppercase tracking-widest">[ 3D Viewport ]</div>
                        {/* Fake wireframe lines */}
                        <div className="absolute top-0 left-1/2 w-px h-full bg-voxel-700/30"></div>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-voxel-700/30"></div>
                        <div className="absolute w-full h-full border border-voxel-700/30 rotate-45 scale-75"></div>
                    </div>
                </div>

                {/* UI Overlay: Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-voxel-800 bg-voxel-950/50 backdrop-blur-md">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="font-mono text-xs text-voxel-400">ASSET_ID: #8829A</div>
                    <div className="flex gap-4 text-voxel-400">
                        <RefreshCw className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        <Maximize className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>

                {/* UI Overlay: Sidebar Controls */}
                <div className="absolute top-14 right-4 w-48 flex flex-col gap-2">
                    {['Render', 'Wireframe', 'UV Map', 'Rigging'].map((mode) => (
                        <button 
                            key={mode}
                            onClick={() => setActiveLayer(mode.toLowerCase())}
                            className={`px-4 py-2 text-xs font-mono text-left border transition-all duration-300 ${
                                activeLayer === mode.toLowerCase() 
                                ? 'bg-white text-black border-white' 
                                : 'bg-voxel-900/80 text-voxel-400 border-voxel-700 hover:border-voxel-500'
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                {/* UI Overlay: Bottom Stats */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-voxel-800 bg-voxel-950/50 backdrop-blur-md flex justify-between font-mono text-xs text-voxel-500">
                    <div>Vertices: 24,502</div>
                    <div>Materials: 4</div>
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-3 h-3" /> 
                        <span>Drag to rotate</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default InteractivePreview;