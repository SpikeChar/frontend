import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment, Center, Grid } from '@react-three/drei';
import { Download, RotateCcw, Box } from 'lucide-react';
// import { easing } from 'maath';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { useWorkshopStore } from '../Context/WorkshopStore';


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

// --------------------
// Questionnaire Wizard
// --------------------

interface QuestionOption {
  value: string;
  label: string;
  hint?: string;
}

interface QuestionConfig {
  id: string;
  title: string;
  description: string;
  options: QuestionOption[];
}

const QUESTIONS: QuestionConfig[] = [
  {
    id: 'useCase',
    title: 'What do you want to generate?',
    description: 'Ye sirf dummy questions hain – later yahi data AI ko jayega.',
    options: [
      { value: 'avatar-rig', label: 'Avatar / Character', hint: 'Player characters, NPCs, VTuber rigs' },
      { value: 'game-creature', label: 'Animal / Creature', hint: 'Pets, monsters, stylized animals' },
      { value: 'weapon-pack', label: 'Weapon / Prop Pack', hint: 'Swords, guns, melee kits' },
    ],
  },
  {
    id: 'vibe',
    title: 'Kaisa vibe chahiye?',
    description: 'Style pick karein jo aapke project ke mood ko match kare.',
    options: [
      { value: 'playful', label: 'Playful', hint: 'Cute, round, friendly' },
      { value: 'aggressive', label: 'Aggressive', hint: 'Sharp, dangerous, combat-heavy' },
      { value: 'neutral', label: 'Neutral', hint: 'Balanced, clean, flexible' },
    ],
  },
  {
    id: 'audience',
    title: 'Primary audience kaun hai?',
    description: 'Isse hum guess karenge ki kaunsi category best fit hai.',
    options: [
      { value: 'kids', label: 'Kids / Casual', hint: 'Simple, friendly shapes' },
      { value: 'indie-devs', label: 'Indie Devs', hint: 'Flexible, reusable assets' },
      { value: 'hardcore-gamers', label: 'Hardcore Gamers', hint: 'Detail heavy, combat focused' },
    ],
  },
  {
    id: 'platform',
    title: 'Target platform kya hai?',
    description: 'Performance aur poly-count tuning ke liye.',
    options: [
      { value: 'mobile', label: 'Mobile', hint: 'Lower poly, lighter textures' },
      { value: 'pc', label: 'PC / Console', hint: 'Higher fidelity allowed' },
      { value: 'web', label: 'WebGL', hint: 'Balanced for browsers' },
    ],
  },
  {
    id: 'timeline',
    title: 'Delivery timeline?',
    description: 'Bas meta data ke liye – AI ko realtime prompt milega.',
    options: [
      { value: 'prototype', label: 'Just prototyping', hint: 'Fast draft assets are okay' },
      { value: 'alpha', label: 'Alpha / Internal', hint: 'Better quality, still flexible' },
      { value: 'production', label: 'Production ready', hint: 'Final quality assets' },
    ],
  },
];

const QuestionWizard: React.FC = () => {
  const {
    step,
    answers,
    setAnswer,
    nextStep,
    prevStep,
    computeCategoryFromAnswers,
    resetAll,
    selectedCategory,
  } = useWorkshopStore();

  const totalSteps = QUESTIONS.length;

  // Wizard ko sirf tab dikhana hai jab tak category decide nahi hui
  if (selectedCategory) return null;

  const current = QUESTIONS[step];
  const selectedValue = answers[current.id];

  const handleSelect = (value: string) => {
    setAnswer(current.id, value);
  };

  const handleNext = () => {
    if (!selectedValue) return;
    if (step === totalSteps - 1) {
      // Last step -> compute result
      computeCategoryFromAnswers();
    } else {
      nextStep(totalSteps);
    }
  };

  return (
    <div className="absolute flex items-center justify-center z-20 inset-0 h-screen w-full max-[599px]:w-[95%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
            Model Intent Wizard
          </span>
          <button
            type="button"
            onClick={resetAll}
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-white"
          >
            Reset
          </button>
        </div>

        <h2 className="text-sm font-semibold text-white mb-1">{current.title}</h2>
        <p className="text-xs text-zinc-400 mb-4">{current.description}</p>

        <div className="space-y-2 mb-4">
          {current.options.map((opt) => {
            const active = selectedValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all ${
                  active
                    ? 'border-white bg-white/10 text-white'
                    : 'border-white/10 text-zinc-300 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono uppercase tracking-[0.16em] text-[10px]">
                    {opt.label}
                  </span>
                  {opt.hint && (
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.14em]">
                      {opt.hint}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Step {step + 1} / {totalSteps}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-full border border-white/10 text-zinc-400 disabled:opacity-30 hover:border-white/40 hover:text-white transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedValue}
              className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] rounded-full bg-white text-black disabled:bg-zinc-500 disabled:text-zinc-900 transition-all active:scale-95"
            >
              {step === totalSteps - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
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
    return <primitive object={scene} ref={refGroup} />;
  }
);

GLTFWithCustomizableParts.displayName = "GLTFWithCustomizableParts";

const DEFAULT_PART_COLORS = ['#ffffff', '#3b82f6', '#ef4444', '#18181b', '#10b981', '#f59e0b', '#71717a', '#3f3f46'];

const Workshop: React.FC = () => {
  const { selectedCategory, availableModels, selectedModelId, selectModel } = useWorkshopStore();

  const activeModel = availableModels.find((m) => m.id === selectedModelId);
  const modelPath = activeModel?.file || "/models/Character2.glb";
  const showViewer = !!selectedCategory;

  const { scene } = useGLTF(modelPath);
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
      {/* INTENT QUESTIONNAIRE (LEFT) */}
      <QuestionWizard />

      {/* 3D VIEWPORT - only after AI (wizard) has selected a category */}
      {showViewer && (
        <div className="absolute inset-0 z-0 top-16 cursor-grab">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1, 3], fov: 50 }}>
            <color attach="background" args={['#050505']} />
            <Environment preset="studio" />
            <ambientLight intensity={0.4} />
            {/* <Center> */}
              <group position={[0,-1,0]}>
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
              minDistance={1}
              maxDistance={8}
              enableDamping={true}
              dampingFactor={0.05}
            />

            {/* <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={20} blur={2.8} far={4.5} /> */}
          </Canvas>
        </div>
      )}

      {/* LEFT SIDEBAR: AI Answer / Model List */}
      {showViewer && (
        <div className="absolute top-32 left-6 bottom-8 w-72 bg-black/40 backdrop-blur-xl border border-white/10 p-6 flex flex-col rounded-[2rem] shadow-2xl z-10">
          <div className="mb-6 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 font-bold block mb-2">
              AI Result
            </span>
            <div className="mb-4">
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-white mb-2">
                {selectedCategory}
              </div>
              <div className="space-y-2">
                {availableModels.map((model) => {
                  const isActive = model.id === selectedModelId;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => selectModel(model.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-[10px] font-mono uppercase tracking-[0.18em] transition-all ${
                        isActive
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 text-zinc-300 hover:border-white/40 hover:bg-white/5'
                      }`}
                    >
                      {model.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SIDEBAR HUD - Model viewer controls */}
      {showViewer && (
        <div className="absolute top-32 right-6 bottom-8 w-72 bg-black/40 backdrop-blur-xl border border-white/10 p-6 flex flex-col rounded-[2rem] shadow-2xl z-10">
        {/* Part Color Customizer */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-1 border-t border-white/5 pt-4">
          <div className="flex justify-between items-center mb-2 shrink-0">
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

          <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
            <ExportButton glbRef={apeRef} />
            <p className="text-[7px] font-mono text-zinc-600 text-center uppercase tracking-widest mt-3">
              Spike Labs Asset Engine
            </p>
          </div>
        </div>
      )}

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