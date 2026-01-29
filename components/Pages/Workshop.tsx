import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, ContactShadows, Environment, Center, Grid } from '@react-three/drei';
import { Download, RotateCcw, Box, Palette, Zap, Maximize2 } from 'lucide-react';
import { Ape } from '../Model/Ape';
// import { Ape1 } from '../Model/Ape1';
// import { Ape2 } from '../Model/Ap2';

// Add GLTFExporter - must be installed via three/examples/jsm
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const ExportButton: React.FC<{
  glbRef: React.RefObject<any>;
  children?: React.ReactNode;
}> = ({ glbRef, children }) => {
  const handleExport = useCallback(() => {
    if (!glbRef.current) return;

    // Find the mesh/object inside the ref's group
    let scene = glbRef.current;
    // If it's a react-three-fiber group, traverse to find exported scene
    if ('scene' in scene) scene = scene.scene;

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf: ArrayBuffer | object) => {
        let output;
        let blob;
        if (gltf instanceof ArrayBuffer) {
          output = gltf;
          blob = new Blob([output], { type: 'model/gltf-binary' });
        } else {
          output = JSON.stringify(gltf, null, 2);
          blob = new Blob([output], { type: 'application/json' });
        }
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'Ape.glb';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      { 
        binary: true,
        onlyVisible: true,
        forceIndices: false,
        forcePowerOfTwoTextures: false, 
        embedImages: true
      }
    );
  }, [glbRef]);
  return (
    <button
      className="w-full py-4 bg-white text-black font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all rounded-xl active:scale-95 shadow-xl"
      onClick={handleExport}
      type="button"
    >
      <Download size={12} /> Export glB
      {children}
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
  const [config, setConfig] = useState({
    body: '#ffffff',
    goggles: '#ffffff',
    outfit: '#18181b',
  });

  // ref to the main model (Ape)
  const apeRef = useRef<any>(null);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col pt-16">
      
      {/* 3D VIEWPORT */}
      <div className="absolute inset-0 z-0 top-16">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 5], fov: 30 }}>
          <color attach="background" args={['#050505']} />
          <Environment preset="studio" />
          <ambientLight intensity={0.3} />
          <Center>
            <ApeWithRef config={config} ref={apeRef} />
          </Center>
          <Grid
            renderOrder={-1}
            position={[0, -0.7, 0]}
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
            minDistance={3}
            maxDistance={5}
            maxAzimuthAngle={Math.PI}
            minAzimuthAngle={-Math.PI}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            enableDamping={true}
            dampingFactor={0.04}
            rotateSpeed={0.8}
          />

          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={0.6} 
            scale={20} 
            blur={2.8} 
            far={4.5} 
          />
        </Canvas>
      </div>

      {/* RIGHT SIDEBAR HUD - Adjusted for better scaling */}
      <div className="absolute top-32 right-6 bottom-8 w-72 bg-black/40 backdrop-blur-xl border border-white/10 p-6 flex flex-col rounded-[2rem] shadow-2xl z-10 max-h-[calc(100vh-120px)]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 font-bold">DNA Config</span>
          <button 
            onClick={() => setConfig({body:'#ffffff', goggles:'#ffffff', outfit:'#18181b'})} 
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors group"
          >
            <RotateCcw size={12} className="text-zinc-600 group-hover:text-white transition-all duration-500" />
          </button>
        </div>

        {/* Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1">
          {/* SKIN TONE */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={12} className="text-zinc-500" />
              <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-[0.2em]">Surface</label>
            </div>
            <div className="grid grid-cols-4 gap-2 p-2">
              {['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#18181b', '#71717a', '#3f3f46'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setConfig(p => ({...p, body: c}))} 
                  className={`aspect-square rounded-full border-2 transition-all ${config.body === c ? 'border-white scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </section>

          {/* GOGGLE TINT */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={12} className="text-zinc-500" />
              <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-[0.2em]">Optical</label>
            </div>
            <div className="flex gap-2 p-2">
              {['#ffffff', '#3b82f6', '#ef4444', '#18181b'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setConfig(p => ({...p, goggles: c}))} 
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${config.goggles === c ? 'border-white scale-105' : 'border-white/5 opacity-40'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </section>

          {/* APPAREL */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Box size={12} className="text-zinc-500" />
              <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-[0.2em]">Equipment</label>
            </div>
            <div className="grid grid-cols-4 p-2 gap-2">
              {['#ffffff', '#18181b', '#3b82f6', '#ef4444'].map(c => (
                <button 
                  key={c} 
                  onClick={() => setConfig(p => ({...p, outfit: c}))} 
                  className={`aspect-square rounded-md border-2 transition-all ${config.outfit === c ? 'border-white scale-105' : 'border-transparent opacity-40'}`} 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </section>
        </div>

        {/* EXPORT ACTION - Stuck to bottom via shrink-0 */}
        <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
          <ExportButton glbRef={apeRef}>
            {/* Optionally extra children inside button */}
          </ExportButton>
          <p className="text-[7px] font-mono text-zinc-600 text-center uppercase tracking-widest mt-3">Spike Labs Asset Engine</p>
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="absolute bottom-6 left-6 right-80 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-black/60 backdrop-blur border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">Stable</span>
          </div>
          <Maximize2 size={12} className="text-zinc-700 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Workshop;