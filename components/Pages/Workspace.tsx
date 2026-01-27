import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuth } from '../Context/AuthContext';
import { useSettings } from '../Context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { Box, Layers, Zap, Download, Save, RefreshCw, Hexagon, Component, Palette } from 'lucide-react';
import Magnetic from '../UI/Magnetic';

const Workspace: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { playSound, motionEnabled } = useSettings();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'body' | 'outfit' | 'colors'>('body');
  const [viewState, setViewState] = useState<'draft' | 'nft' | 'game'>('draft');
  
  // Mock Customization State
  const [config, setConfig] = useState({
    bodyType: 'Humanoid',
    outfit: 'Explorer',
    primaryColor: '#ffffff',
    secondaryColor: '#52525b'
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.workspace-ui', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out'
      });
      
      gsap.from(characterRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        delay: 0.3
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Character State Transition
  useEffect(() => {
    if (!motionEnabled || !characterRef.current) return;
    
    // Animate character based on viewState
    if (viewState === 'draft') {
        gsap.to(characterRef.current, { filter: 'grayscale(100%) opacity(0.8)', scale: 0.95, duration: 0.5 });
    } else if (viewState === 'nft') {
        gsap.to(characterRef.current, { filter: 'grayscale(0%) opacity(1)', scale: 1, duration: 0.5 });
    } else if (viewState === 'game') {
        gsap.to(characterRef.current, { filter: 'contrast(120%) saturate(110%)', scale: 1.05, duration: 0.5 });
    }
  }, [viewState, motionEnabled]);

  const handleConfigChange = (key: string, value: string) => {
    playSound('click');
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    playSound('switch');
    // Mock export
    alert(`Exporting ${config.bodyType} - ${config.outfit} configuration as GLB...`);
  };

  return (
    <div ref={containerRef} className="pt-24 h-screen bg-voxel-950 overflow-hidden flex flex-col">
      {/* Header / Toolbar */}
      <div className="h-16 border-b border-voxel-800 px-6 flex justify-between items-center bg-voxel-950 z-20">
        <div className="workspace-ui flex items-center gap-4">
            <h2 className="font-display font-bold text-lg">WORKSPACE</h2>
            <span className="text-xs font-mono text-voxel-500 bg-voxel-900 px-2 py-1 rounded">v2.4.0</span>
        </div>

        <div className="workspace-ui flex items-center bg-voxel-900 p-1 rounded-lg border border-voxel-800">
            {['draft', 'nft', 'game'].map((state) => (
                <button
                    key={state}
                    onClick={() => { setViewState(state as any); playSound('switch'); }}
                    className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all ${
                        viewState === state ? 'bg-white text-black shadow-sm' : 'text-voxel-400 hover:text-white'
                    }`}
                >
                    {state === 'nft' ? 'Mint-Ready' : state}
                </button>
            ))}
        </div>

        <div className="workspace-ui flex gap-3">
             <button className="p-2 text-voxel-400 hover:text-white" title="Save Draft">
                <Save size={18} />
             </button>
             <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-voxel-200 transition-colors">
                <Download size={14} />
                <span>Export GLB</span>
             </button>
        </div>
      </div>

      <div className="flex-grow flex relative">
        {/* Left Panel: Tools */}
        <div className="w-16 md:w-20 border-r border-voxel-800 bg-voxel-950 flex flex-col items-center py-6 gap-6 z-10">
             {[
                { id: 'body', icon: Hexagon, label: 'Body' },
                { id: 'outfit', icon: Component, label: 'Outfit' },
                { id: 'colors', icon: Palette, label: 'Paint' },
             ].map((tool) => {
                const isActive = activeTab === tool.id;
                const Icon = tool.icon;
                return (
                    <button
                        key={tool.id}
                        onClick={() => { setActiveTab(tool.id as any); playSound('click'); }}
                        className={`workspace-ui w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            isActive ? 'bg-white text-black' : 'bg-voxel-900 text-voxel-400 hover:text-white hover:bg-voxel-800'
                        }`}
                        title={tool.label}
                    >
                        <Icon size={20} />
                    </button>
                )
             })}
        </div>

        {/* Middle: Config Panel */}
        <div className="w-64 border-r border-voxel-800 bg-voxel-900/50 p-6 z-10 overflow-y-auto hidden md:block" data-lenis-prevent>
            <h3 className="workspace-ui font-mono text-xs uppercase text-voxel-500 mb-6 tracking-widest">
                {activeTab} Settings
            </h3>
            
            <div className="space-y-6">
                {activeTab === 'body' && (
                    <div className="workspace-ui space-y-2">
                        <label className="text-sm font-medium">Archetype</label>
                        {['Humanoid', 'Cyborg', 'Ethereal'].map(type => (
                            <button 
                                key={type}
                                onClick={() => handleConfigChange('bodyType', type)}
                                className={`w-full text-left px-4 py-3 border text-sm transition-all ${
                                    config.bodyType === type ? 'border-white bg-voxel-800' : 'border-voxel-800 text-voxel-400 hover:border-voxel-600'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'outfit' && (
                    <div className="workspace-ui space-y-2">
                         <label className="text-sm font-medium">Collection</label>
                         {['Explorer', 'Ronin', 'Netrunner', 'Vanguard'].map(item => (
                            <button 
                                key={item}
                                onClick={() => handleConfigChange('outfit', item)}
                                className={`w-full text-left px-4 py-3 border text-sm transition-all ${
                                    config.outfit === item ? 'border-white bg-voxel-800' : 'border-voxel-800 text-voxel-400 hover:border-voxel-600'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'colors' && (
                    <div className="workspace-ui space-y-4">
                        <div>
                             <label className="text-sm font-medium block mb-2">Primary Material</label>
                             <div className="grid grid-cols-4 gap-2">
                                {['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#18181b'].map(color => (
                                    <button 
                                        key={color}
                                        onClick={() => handleConfigChange('primaryColor', color)}
                                        style={{ backgroundColor: color }}
                                        className={`w-full aspect-square rounded-sm border transition-transform hover:scale-110 ${
                                            config.primaryColor === color ? 'border-white scale-110' : 'border-transparent'
                                        }`}
                                    />
                                ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Center: Viewport */}
        <div className="flex-grow relative bg-voxel-950 flex items-center justify-center overflow-hidden">
             {/* 3D Environment Background */}
             <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" style={{ backgroundPosition: 'center' }}></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-voxel-900/50 via-voxel-950 to-voxel-950 pointer-events-none"></div>
             
             {/* Abstract Character Representation */}
             <div ref={characterRef} className="relative w-[300px] h-[500px] md:w-[400px] md:h-[600px] flex items-center justify-center transition-all duration-500">
                {/* Simulated "Hologram" Character */}
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {/* Head */}
                    <div 
                        className="w-24 h-24 mb-2 relative transition-all duration-500"
                        style={{ 
                            backgroundColor: config.primaryColor, 
                            borderRadius: config.bodyType === 'Humanoid' ? '12px' : config.bodyType === 'Cyborg' ? '2px' : '50%',
                            opacity: 0.9,
                            boxShadow: `0 0 40px ${config.primaryColor}40`
                        }}
                    >
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-black/20"></div>
                    </div>

                    {/* Body */}
                    <div 
                        className="w-40 h-56 mb-2 relative transition-all duration-500 flex items-center justify-center overflow-hidden"
                         style={{ 
                            backgroundColor: config.bodyType === 'Ethereal' ? `${config.primaryColor}80` : '#27272a',
                            borderRadius: config.outfit === 'Ronin' ? '4px' : '16px',
                            border: `2px solid ${config.primaryColor}40`
                        }}
                    >
                         <span className="font-mono text-xs uppercase text-white/50 tracking-widest rotate-90">{config.outfit}</span>
                         {config.outfit === 'Netrunner' && <div className="absolute inset-0 bg-white/5 skew-y-12"></div>}
                    </div>

                    {/* Legs */}
                    <div className="flex gap-2">
                        <div className="w-16 h-48 bg-voxel-800 rounded-b-lg border-t border-white/10"></div>
                        <div className="w-16 h-48 bg-voxel-800 rounded-b-lg border-t border-white/10"></div>
                    </div>
                    
                    {/* Platform */}
                    <div className="absolute bottom-0 w-64 h-64 bg-white/5 rounded-full blur-xl -z-10 scale-y-25 translate-y-24"></div>
                </div>

                {/* Web3 Indicators */}
                {viewState === 'nft' && (
                    <div className="absolute top-10 right-0 bg-black/80 backdrop-blur border border-green-500/30 px-3 py-1 rounded text-[10px] text-green-400 font-mono uppercase tracking-widest animate-pulse">
                        Verified Contract
                    </div>
                )}
             </div>
             
             {/* View Controls */}
             <div className="absolute bottom-8 flex gap-4">
                 <button className="workspace-ui p-3 bg-voxel-900 rounded-full text-voxel-400 hover:text-white border border-voxel-800 hover:border-voxel-600 transition-all">
                    <RefreshCw size={16} />
                 </button>
                 <div className="workspace-ui px-4 py-3 bg-voxel-900 rounded-full text-xs font-mono text-voxel-400 border border-voxel-800">
                    POLY_COUNT: {config.bodyType === 'Humanoid' ? '12,400' : '24,800'}
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;