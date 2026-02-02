import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, ContactShadows, Environment, Center, Grid, Stats } from '@react-three/drei';
import { Download, RotateCcw, Box, Palette, Zap, Maximize2 } from 'lucide-react';
import { easing } from 'maath';
import * as THREE from 'three';
import { Ape } from '../Model/Ape';

// Add GLTFExporter - must be installed via three/examples/jsm
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

/**
 * CAMERA RIG COMPONENT
 * Handles smooth zooming and target focusing based on activePart
 */
const CameraRig = ({ activePart }: { activePart: string }) => {
  const { camera, controls } = useThree();
  
  // High-precision camera targets for each mesh group
  const targets = {
    body: { pos: new THREE.Vector3(0, 0, 4.5), lookAt: new THREE.Vector3(0, 0, 0) },
    goggles: { pos: new THREE.Vector3(0, 0.4, 1.4), lookAt: new THREE.Vector3(0, 0.4, 0) },
    outfit: { pos: new THREE.Vector3(0, -0.3, 2.2), lookAt: new THREE.Vector3(0, -0.3, 0) },
  };

  useFrame((state, delta) => {
    const target = targets[activePart as keyof typeof targets] || targets.body;
    
    // Smooth damp camera position
    easing.damp3(state.camera.position, target.pos, 0.3, delta);
    
    // Smooth damp orbit controls target (where the camera looks)
    if (controls) {
      // @ts-ignore
      easing.damp3(controls.target, target.lookAt, 0.3, delta);
      // @ts-ignore
      controls.update();
    }
  });

  return null;
};

const ExportButton: React.FC<{ glbRef: React.RefObject<any>; children?: React.ReactNode }> = ({ glbRef, children }) => {
  const handleExport = useCallback(() => {
    if (!glbRef.current) return;
    let scene = glbRef.current;
    if ('scene' in scene) scene = scene.scene;

    const exporter = new GLTFExporter();
    exporter.parse(scene, (gltf: any) => {
      const blob = gltf instanceof ArrayBuffer 
        ? new Blob([gltf], { type: 'model/gltf-binary' }) 
        : new Blob([JSON.stringify(gltf)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SpikeLabs_Asset.glb';
      link.click();
    }, { binary: true, embedImages: true });
  }, [glbRef]);

  return (
    <button
      className="w-full py-4 bg-white text-black font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all rounded-xl active:scale-95 shadow-xl"
      onClick={handleExport}
      type="button"
    >
      <Download size={12} /> Export glB
    </button>
  );
};

const ApeWithRef = React.forwardRef<any, { config: any }>((props, ref) => (
  <group ref={ref}>
    <Ape {...props} />
  </group>
));
ApeWithRef.displayName = "ApeWithRef";

const Workshop: React.FC = () => {
  const [config, setConfig] = useState({ body: '#ffffff', goggles: '#ffffff', outfit: '#18181b' });
  const [activePart, setActivePart] = useState('body');
  const apeRef = useRef<any>(null);

  // Helper to handle color change and camera focus simultaneously
  const setSelection = (part: string, color?: string) => {
    setActivePart(part);
    if (color) setConfig(prev => ({ ...prev, [part]: color }));
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col pt-16">
      
      {/* 3D VIEWPORT */}
      <div className="absolute inset-0 z-0 top-16">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 5], fov: 30 }}>
          <color attach="background" args={['#050505']} />
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          
          <CameraRig activePart={activePart} />
          
          <Center>
            <ApeWithRef config={config} ref={apeRef} />
          </Center>

          <Grid
            renderOrder={-1}
            position={[0, -0.8, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={1}
            cellColor={'#27272a'}
            sectionSize={2}
            sectionThickness={1}
            sectionColor={'#3f3f46'}
            fadeDistance={30}
          />

          <OrbitControls 
            makeDefault 
            enablePan={false}
            minDistance={1}
            maxDistance={8}
            enableDamping={true}
            dampingFactor={0.05}
          />

          <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={20} blur={2.8} far={4.5} />
        </Canvas>
      </div>

      {/* RIGHT SIDEBAR HUD */}
      <div className="absolute top-32 right-6 bottom-8 w-72 bg-black/40 backdrop-blur-xl border border-white/10 p-6 flex flex-col rounded-[2rem] shadow-2xl z-10">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 font-bold">DNA Config</span>
          <button 
            onClick={() => { setConfig({body:'#ffffff', goggles:'#ffffff', outfit:'#18181b'}); setActivePart('body'); }} 
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors group"
          >
            <RotateCcw size={12} className="text-zinc-600 group-hover:text-white transition-all duration-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1">
          {/* SKIN TONE */}
          <section onPointerDown={() => setActivePart('body')} className={`p-2 rounded-xl transition-colors ${activePart === 'body' ? 'bg-white/5' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={12} className={activePart === 'body' ? "text-white" : "text-zinc-500"} />
              <label className={`text-[9px] font-mono uppercase tracking-[0.2em] ${activePart === 'body' ? "text-white" : "text-zinc-500"}`}>Surface</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#18181b', '#71717a', '#3f3f46'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelection('body', c)} 
                  className={`aspect-square rounded-full border-2 transition-all ${config.body === c ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </section>

          {/* GOGGLE TINT */}
          <section onPointerDown={() => setActivePart('goggles')} className={`p-2 rounded-xl transition-colors ${activePart === 'goggles' ? 'bg-white/5' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={12} className={activePart === 'goggles' ? "text-white" : "text-zinc-500"} />
              <label className={`text-[9px] font-mono uppercase tracking-[0.2em] ${activePart === 'goggles' ? "text-white" : "text-zinc-500"}`}>Optical</label>
            </div>
            <div className="flex gap-2">
              {['#ffffff', '#3b82f6', '#ef4444', '#18181b'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelection('goggles', c)} 
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${config.goggles === c ? 'border-white scale-110' : 'border-white/5 opacity-40'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </section>

          {/* APPAREL */}
          <section onPointerDown={() => setActivePart('outfit')} className={`p-2 rounded-xl transition-colors ${activePart === 'outfit' ? 'bg-white/5' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Box size={12} className={activePart === 'outfit' ? "text-white" : "text-zinc-500"} />
              <label className={`text-[9px] font-mono uppercase tracking-[0.2em] ${activePart === 'outfit' ? "text-white" : "text-zinc-500"}`}>Equipment</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['#ffffff', '#18181b', '#3b82f6', '#ef4444'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelection('outfit', c)} 
                  className={`aspect-square rounded-md border-2 transition-all ${config.outfit === c ? 'border-white scale-110' : 'border-transparent opacity-40'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
          <ExportButton glbRef={apeRef} />
          <p className="text-[7px] font-mono text-zinc-600 text-center uppercase tracking-widest mt-3">Spike Labs Asset Engine</p>
        </div>
      </div>

      {/* FOOTER STATUS */}
      <div className="absolute bottom-6 left-6 right-80 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-black/60 backdrop-blur border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">Workspace Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshop;