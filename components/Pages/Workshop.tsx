import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment, Center, Grid } from '@react-three/drei';
import { Download, RotateCcw, Box } from 'lucide-react';
// import { easing } from 'maath';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';


const ExportButton: React.FC<{ glbRef: React.RefObject<any>; children?: React.ReactNode }> = ({ glbRef, children }) => {
  const handleExport = useCallback(() => {
    if (!glbRef.current) return;
    let scene = glbRef.current;
    if ('scene' in scene) scene = scene.scene;

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf: any) => {
        const blob =
          gltf instanceof ArrayBuffer
            ? new Blob([gltf], { type: 'model/gltf-binary' })
            : new Blob([JSON.stringify(gltf)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'SpikeLabs_Asset.glb';
        link.click();
      },
      { binary: true, embedImages: true }
    );
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

const GLTFWithCustomizableParts = memo(
  ({
    scene,
    config,
    onCollectParts,
    refGroup,
  }: {
    scene: THREE.Group;
    config: Record<string, string>;
    onCollectParts?: (names: string[]) => void;
    refGroup?: React.RefObject<THREE.Group>;
  }) => {
    useEffect(() => {
      if (!scene) return;
      const names: string[] = [];

      // Traverse and apply color
      scene.traverse((obj) => {
        // @ts-ignore
        if (obj.isMesh) {
          names.push(obj.name);
          // update mesh color if given in config
          if (
            config &&
            Object.prototype.hasOwnProperty.call(config, obj.name) &&
            obj.material &&
            obj.material.color
          ) {
            // @ts-ignore
            obj.material.color.set(config[obj.name]);
            // Ensure material updates in real time
            obj.material.needsUpdate = true;
          }
        }
      });
      if (onCollectParts) onCollectParts(Array.from(new Set(names)));
    }, [scene, config, onCollectParts]);
    if (!scene) return null;
    return <primitive object={scene} scale={0.5} ref={refGroup} />;
  }
);

GLTFWithCustomizableParts.displayName = "GLTFWithCustomizableParts";

const DEFAULT_PART_COLORS = ['#ffffff', '#3b82f6', '#ef4444', '#18181b', '#10b981', '#f59e0b', '#71717a', '#3f3f46'];

const Workshop: React.FC = () => {
  const { scene } = useGLTF("/models/animal2.glb");
  const [availableParts, setAvailableParts] = useState<string[]>([]);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [activePart, setActivePart] = useState<string | undefined>();
  const apeRef = useRef<any>(null);

  useEffect(() => {
    if (!scene) return;
    const partNames: Set<string> = new Set();
    const initial: Record<string, string> = { ...(config || {}) };
    scene.traverse((obj) => {
      // @ts-ignore
      if (obj.isMesh) {
        partNames.add(obj.name);
        if (!(obj.name in initial) && obj.material && obj.material.color) {
          // @ts-ignore
          initial[obj.name] = '#' + obj.material.color.getHexString();
        }
      }
    });
    setAvailableParts(Array.from(partNames));
    setConfig((prev) => {
      // Merge previous config (user changes) and initial config
      return { ...initial, ...prev };
    });
    // Default active part
    setActivePart((prev) => prev ?? Array.from(partNames)[0]);
    // eslint-disable-next-line
  }, [scene]);

  // Color change
  const setSelection = (part: string, color?: string) => {
    setActivePart(part);
    if (color)
      setConfig((prev) => ({
        ...prev,
        [part]: color,
      }));
  };

  const handleReset = () => {
    setConfig({});
  };


  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col pt-16 ">
      {/* 3D VIEWPORT */}
      <div className="absolute inset-0 z-0 top-16">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 5], fov: 30 }}>
          <color attach="background" args={['#050505']} />
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <Center>
            <group>
              <GLTFWithCustomizableParts
                scene={scene}
                config={config}
                onCollectParts={setAvailableParts}
                refGroup={apeRef}
              />
            </group>
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
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 font-bold">
            DNA Config
          </span>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors group"
          >
            <RotateCcw size={12} className="text-zinc-600 group-hover:text-white transition-all duration-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-1">
          {availableParts.map((part) => {
            const isActive = activePart === part;
            return (
              <section
                key={part}
                onPointerDown={() => setActivePart(part)}
                className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/5' : ''}`}
              >
                <div className="flex items-center gap-2 mb-4 cursor-pointer">
                  <Box size={12} className={isActive ? 'text-white' : 'text-zinc-500'} />
                  <label
                    className={`text-[9px] font-mono uppercase tracking-[0.2em] cursor-pointer ${isActive ? 'text-white' : 'text-zinc-500'}`}
                  >
                    {part}
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* {DEFAULT_PART_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelection(part, color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${config[part] === color
                        ? 'border-white scale-110'
                        : 'border-white/5 opacity-40 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))} */}
                  {isActive && (
                    <div className="mt-3 w-full flex items-center">
                      {/* Color wheel (using input type color for simplicity) */}
                      <input
                        type="color"
                        value={config[part] || "#ffffff"}
                        onChange={(e) => setSelection(part, e.target.value)}
                        className="w-12 h-12 p-0 border-0 bg-transparent cursor-pointer"
                        aria-label="Custom color picker"
                      />
                      <span className="ml-2 text-xs text-zinc-400 font-mono uppercase">
                        Pick Color
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
          <ExportButton glbRef={apeRef} />
          <p className="text-[7px] font-mono text-zinc-600 text-center uppercase tracking-widest mt-3">
            Spike Labs Asset Engine
          </p>
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