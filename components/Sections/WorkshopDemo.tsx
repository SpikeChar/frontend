import React, { useState, useRef, Suspense, useEffect, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls, ContactShadows, Environment, Center, Grid } from '@react-three/drei';
import { ChevronRight, RefreshCw, Hexagon, Palette, Component, RotateCcw, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../Context/SettingsContext';
import * as THREE from 'three';
import { useAppKitAccount } from '@reown/appkit/react';

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
        return <primitive object={scene} scale={1} position-y={-1} ref={refGroup} />;
    }
);

GLTFWithCustomizableParts.displayName = "GLTFWithCustomizableParts";

const DEFAULT_PART_COLORS = ['#ffffff', '#3b82f6', '#ef4444', '#18181b', '#10b981', '#f59e0b', '#71717a', '#3f3f46'];

// --- MAIN WORKSHOP COMPONENT ---
const WorkshopDemo: React.FC = () => {
    const { playSound } = useSettings();

    const { scene } = useGLTF("/models/Character2.glb");
    const [availableParts, setAvailableParts] = useState<string[]>([]);
    const [config, setConfig] = useState<Record<string, string>>({});
    const [activePart, setActivePart] = useState<string | undefined>();
    const apeRef = useRef<any>(null);

    // Collect part names and set default config on initial load or when model changes
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

    // Color change + camera focus
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

    const { address, isConnected } = useAppKitAccount();


    return (
        <section className="py-32 max-[599px]:py-10 px-6 bg-voxel-950 border-y border-voxel-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 max-[599px]:gap-8">

                {/* Left Side: Info */}
                <div className="w-full lg:w-1/3">
                    <span className="font-mono text-green-500 text-sm uppercase tracking-widest block mb-4">Interactive Workshop</span>
                    <h2 className="font-display text-5xl font-bold mb-6 text-white">SPIKE LABS <br />CUSTOMIZER</h2>
                    <p className="text-lg text-voxel-300 mb-8 leading-relaxed">
                        Modify textures and materials in real-time. This demo uses the Spike Engine to override baked GLB maps.
                    </p>
                    {isConnected ? <Link to="/workshop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-all rounded-sm">
                        Launch Full Workshop <ChevronRight size={16} />
                    </Link> : <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-all rounded-sm">
                    Launch Full Workshop <ChevronRight size={16} /></Link>}
                </div>

                {/* Right Side: 3D Canvas + Controls */}
                <div className="w-full lg:w-2/3 bg-voxel-900 rounded-xl border border-voxel-800 p-2 shadow-2xl h-[600px] flex flex-col md:flex-row overflow-hidden">

                    {/* Viewport */}
                    <div className="relative flex-grow h-[350px] md:h-full bg-voxel-950 cursor-grab">
                        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 5], fov: 30 }}>
                            <color attach="background" args={['#050505']} />
                            <Environment preset="studio" />
                            <ambientLight intensity={0.4} />

                            {/* <Center> */}
                                <group>
                                    <GLTFWithCustomizableParts
                                        scene={scene}
                                        config={config}
                                        onCollectParts={setAvailableParts}
                                        refGroup={apeRef}
                                    />
                                </group>
                            {/* </Center> */}
                            <Grid
                                renderOrder={-1}
                                position={[0, -1, 0]}
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
                                minDistance={5}
                                maxDistance={5}
                                enableDamping={true}
                                dampingFactor={0.05}
                            />

                            <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={20} blur={2.8} far={4.5} />
                        </Canvas>

                        <div className="absolute top-4 left-4 px-2 py-1 bg-black/40 backdrop-blur border border-white/10 text-[10px] font-mono text-voxel-400 rounded uppercase tracking-tighter">
                            RT_Customizer_v3.0
                        </div>
                    </div>

                    {/* Controls Sidebar */}
                    <div className="w-full md:w-64 bg-voxel-900 border-l border-voxel-800 p-6 flex flex-col gap-8 max-[599px]:gap-0">
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
                                            {isActive && (
                                        <div className="flex flex-wrap gap-2">
                                            {DEFAULT_PART_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelection(part, color)}
                                                    className={`w-8 h-8 rounded-lg border-2 transition-all ${config[part] === color
                                                        ? 'border-white scale-110'
                                                        : 'border-white/5 opacity-40 hover:opacity-100'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
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
                                        </div>
                                            )}
                                    </section>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkshopDemo;