import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment, Center, Grid } from '@react-three/drei';
import { Download, RotateCcw, Box } from 'lucide-react';
// import { easing } from 'maath';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { useWorkshopStore, ALL_MODELS, ModelOption } from '../Context/WorkshopStore';

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

// Questions configuration - models question will be handled separately
const QUESTIONS: QuestionConfig[] = [
  {
    id: 'what',
    title: 'What Brings You Here?',
    description: 'Ye sirf dummy questions hain – later yahi data AI ko jayega.',
    options: [
      { value: 'Defi Game Dev', label: 'Defi Game Dev', hint: 'Player characters, NPCs, VTuber rigs' },
      { value: 'Random Model', label: 'Random Model', hint: 'Pets, monsters, stylized animals' },
      // { value: 'weapon-pack', label: 'Weapon / Prop Pack', hint: 'Swords, guns, melee kits' },
    ],
  },
  {
    id: 'gennre',
    title: 'Game Genre',
    description: 'Style pick karein jo aapke project ke mood ko match kare.',
    options: [
      { value: 'Defi War', label: 'Defi War', hint: 'Cute, round, friendly' },
      { value: 'Escape Game', label: 'Escape Game', hint: 'Sharp, dangerous, combat-heavy' },
      { value: 'Battle Royale', label: 'Battle Royale', hint: 'Balanced, clean, flexible' },
      { value: 'Dungeon Siege', label: 'Dungeon Siege', hint: 'Balanced, clean, flexible' },
      { value: 'Cyber Sport', label: 'Cyber Sport', hint: 'Balanced, clean, flexible' },
      { value: 'Eco Utopia', label: 'Eco Utopia', hint: 'Balanced, clean, flexible' },
      { value: 'Space Obyssey', label: 'Space Obyssey', hint: 'Balanced, clean, flexible' },
      { value: 'Shadow Stealth', label: 'Shadow Stealth', hint: 'Balanced, clean, flexible' },
      { value: 'Wild West', label: 'Wild West', hint: 'Balanced, clean, flexible' },
      { value: 'Ancient Samurai', label: 'Ancient Samurai', hint: 'Balanced, clean, flexible' },
    ],
  },
  {
    id: 'graphic',
    title: 'Model Graphics',
    description: 'Isse hum guess karenge ki kaunsi category best fit hai.',
    options: [
      { value: 'Voxel', label: 'Voxel', hint: 'Simple, friendly shapes' },
      { value: 'Low Poly', label: 'Low Poly', hint: 'Flexible, reusable assets' },
      { value: 'High Poly', label: 'High Poly', hint: 'Detail heavy, combat focused' },
      { value: 'Cartoon', label: 'Cartoon', hint: 'Detail heavy, combat focused' },
      { value: 'Clay Motion', label: 'Clay Motion', hint: 'Detail heavy, combat focused' },
    ],
  },
  {
    id: 'refrenece',
    title: 'Add a Refrence of a Game or a WhitePaper',
    description: 'Optional - Performance aur poly-count tuning ke liye. (Not considered in answer for now)',
    options: [
      { value: 'mobile', label: 'Mobile', hint: 'Lower poly, lighter textures' },
      { value: 'pc', label: 'PC / Console', hint: 'Higher fidelity allowed' },
      { value: 'web', label: 'WebGL', hint: 'Balanced for browsers' },
    ],
  },
  {
    id: 'models',
    title: 'Avialable Models?',
    description: 'Bas meta data ke liye – AI ko realtime prompt milega.',
    options: [{ value: 'select', label: 'Select Models', hint: 'Click to choose models' }],
  },
];

// ---------- Reference Uploader -----------
interface ReferenceUploaderProps {
  value: string | undefined;
  setValue: (src: string) => void;
  onClose: () => void;
}
const ReferenceUploader: React.FC<ReferenceUploaderProps> = ({ value, setValue, onClose }) => {
  const [uploadSrc, setUploadSrc] = useState<string | undefined>(value);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadSrc(reader.result as string);
        setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Allow paste image from clipboard
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setUploadSrc(reader.result as string);
            setValue(reader.result as string);
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    }
  };

  // To enter a reference URL
  // CHANGE -- Use textarea change event (fixes lint error)
  const handleUrl = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUploadSrc(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className="absolute flex items-center justify-center z-30 inset-0 h-screen w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75">
      <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl w-[340px] max-w-[90vw] flex flex-col gap-4">
        <h2 className="font-bold text-lg text-white mb-1">Upload Game or Idea Image</h2>
        <p className="text-xs text-zinc-400">
          You can upload a screenshot, concept art, or whitepaper illustration to guide the engine. Or, paste a link to an image/reference.
        </p>
        {uploadSrc ? (
          <div className="flex flex-col items-center gap-2">
            {/* If image, show preview */}
            {uploadSrc.startsWith('data:image') || uploadSrc.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={uploadSrc} className="h-32 max-w-full object-scale-down mb-2 rounded-lg border border-white/10" alt="Reference preview" />
            ) : (
              <span className="break-all text-xs text-zinc-400 truncate">{uploadSrc}</span>
            )}
            <button className="bg-zinc-700 text-white py-1 px-3 rounded text-xs mt-2 mb-2 hover:bg-zinc-600" onClick={() => { setUploadSrc(undefined); setValue(""); }}>Remove</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-xs text-zinc-300 mt-2">Upload image file:</label>
            <input
              type="file"
              accept="image/*"
              className="text-xs text-zinc-500"
              onChange={handleFile}
            />
            <label className="text-xs text-zinc-300 mt-2">Or paste an image or URL:</label>
            <textarea
              className="w-full px-3 py-2 rounded border border-white/10 bg-zinc-950/40 text-xs text-white focus:border-white/40 focus:outline-none resize-none"
              placeholder="Paste or type image url here (ctrl+v to paste image)"
              rows={2}
              value={uploadSrc || ""}
              onChange={handleUrl}
              onPaste={handlePaste}
            />
          </div>
        )}
        <div className="flex justify-end mt-1">
          <button
            onClick={onClose}
            type="button"
            className="bg-zinc-700 text-white py-2 px-4 rounded-lg hover:bg-zinc-600 uppercase text-xs font-mono tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Model Selection Modal Component
interface ModelSelectionModalProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({ onCancel, onSubmit }) => {
  const { selectedModels, toggleModelSelection } = useWorkshopStore();

  // Group ALL models by category and limit to 1-2 per category for preview
  const modelsByCategory = ALL_MODELS.reduce((acc, model) => {
    if (!acc[model.category]) {
      acc[model.category] = [];
    }
    acc[model.category].push(model);
    return acc;
  }, {} as Record<string, ModelOption[]>);

  // Limit each category to show 1-2 models as preview
  const previewModelsByCategory = Object.entries(modelsByCategory).reduce((acc, [category, models]) => {
    acc[category] = models.slice(0, 3); // Show first 1-2 models from each category
    return acc;
  }, {} as Record<string, ModelOption[]>);

  const categoryNames: Record<string, string> = {
    avatar: 'Avatars',
    animal: 'Animals',
    building: 'Buildings',
  };

  const hasSelection = selectedModels.length > 0;

  return (
    <div className="absolute flex items-center justify-center z-30 inset-0 h-screen w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75">
      <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl w-[90vw] max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="font-bold text-lg text-white mb-2">Select Models</h2>
        <p className="text-xs text-zinc-400 mb-6">
          Choose one or more models to customize. Models are grouped by category.
        </p>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {Object.entries(previewModelsByCategory).map(([category, models]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-300">
                {categoryNames[category] || category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {models.map((model) => {
                  const isSelected = selectedModels.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => toggleModelSelection(model.id)}
                      className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                        isSelected
                          ? 'border-white bg-white/10 scale-105'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              <span className="text-black font-bold text-sm">✓</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-zinc-950/60">
                        <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-white truncate">
                          {model.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="text-xs text-zinc-400">
            {hasSelection ? `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''} selected` : 'No models selected'}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-zinc-700 text-white py-2 px-4 rounded-lg hover:bg-zinc-600 uppercase text-xs font-mono tracking-widest"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!hasSelection}
              className="bg-white text-black py-2 px-5 rounded-lg font-bold uppercase text-xs font-mono tracking-wider active:scale-95 disabled:bg-zinc-400 disabled:text-zinc-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RandomModelPrompt: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  // You can add more state here if you want to collect data from the prompt, e.g. description, category etc.
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you could pass this input up to global state, call AI etc.
    // For now just close prompt
    onCancel();
  };

  return (
    <div className="absolute flex items-center justify-center z-30 inset-0 h-screen w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75">
      <form
        className="bg-zinc-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl w-[340px] max-w-[90vw] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-lg text-white mb-1">Custom Random Model</h2>
        <p className="text-xs text-zinc-400 mb-3">
          Please provide a short description, name or type for your random model and our engine will generate it!
        </p>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Dragon, Magic Sword, Cute Tiger..."
          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-zinc-950/40 text-sm text-white focus:border-white/40 focus:outline-none"
        />
        <div className="flex items-center justify-between mt-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-zinc-700 text-white py-2 px-4 rounded-lg hover:bg-zinc-600 uppercase text-xs font-mono tracking-widest"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-white text-black py-2 px-5 rounded-lg font-bold uppercase text-xs font-mono tracking-wider active:scale-95 disabled:bg-zinc-400 disabled:text-zinc-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const QuestionWizard: React.FC = () => {
  const {
    step,
    answers,
    setAnswer,
    nextStep,
    prevStep,
    computeCategoryFromAnswers,
    computeAvailableModels,
    resetAll,
    selectedCategory,
    availableModels,
    setSelectedModels,
    selectedModels,
    selectModel,
  } = useWorkshopStore();

  const totalSteps = QUESTIONS.length;

  // Local state for showing prompt if "Random Model" is selected in step 0
  const [showRandomPrompt, setShowRandomPrompt] = useState(false);

  // Local state to show/hide the reference uploader window
  const [showRefUploader, setShowRefUploader] = useState(false);

  // Local state to show/hide the model selection modal
  const [showModelSelection, setShowModelSelection] = useState(false);

  // Local for storing ref image - store as a string (url or data)
  const [referenceImage, setReferenceImage] = useState<string>("");

  // --- NEW: Enable "Next" button if a reference image exists in ref step
  // We'll auto-set the wizard step's selectedValue if a reference is added.
  useEffect(() => {
    // If we're on the reference step, and referenceImage exists, set the step's selected value
    const referenceStepId = QUESTIONS.find(q => q.id === 'refrenece')?.id;
    if (referenceStepId && step === QUESTIONS.findIndex(q => q.id === referenceStepId)) {
      if (referenceImage) {
        setAnswer(referenceStepId, referenceImage);
      } else if (answers[referenceStepId]) {
        // Clear the answer if reference image is removed
        setAnswer(referenceStepId, '');
      }
    }
    // eslint-disable-next-line
  }, [referenceImage, step]);

  const current = QUESTIONS[step];
  const selectedValue = current ? answers[current.id] : undefined;

  // If at first step and option is selected, check if Random Model is selected
  useEffect(() => {
    if (step === 0 && selectedValue === 'Random Model') {
      setShowRandomPrompt(true);
    } else {
      setShowRandomPrompt(false);
    }
  }, [step, selectedValue]);

  // Wizard ko sirf tab dikhana hai jab tak category decide nahi hui
  // IMPORTANT: This must come AFTER all hooks to avoid "Rendered fewer hooks" error
  if (selectedCategory || !current) return null;

  // Custom handler to check for Random Model option
  const handleSelect = (value: string) => {
    setAnswer(current.id, value);
    // If models question, show the selection modal
    if (current.id === 'models') {
      setShowModelSelection(true);
    }
  };

  // Handle model selection modal submit
  const handleModelSelectionSubmit = () => {
    if (selectedModels.length > 0) {
      setAnswer('models', 'selected'); // Mark as answered
      setShowModelSelection(false);
      // Proceed to customizer (compute category and show viewer)
      computeCategoryFromAnswers();
      // Set the first selected model as active
      selectModel(selectedModels[0]);
    }
  };

  // Handle model selection modal cancel
  const handleModelSelectionCancel = () => {
    setShowModelSelection(false);
    // Clear the answer if user cancels
    setAnswer('models', '');
    setSelectedModels([]);
  };

  // Only allow next if not on Random Model on step 0
  const handleNext = () => {
    // If on refrenece step - this is optional, allow proceeding with or without image
    if (current.id === 'refrenece') {
      // Reference step is optional - allow proceeding even without image
      if (step === totalSteps - 1) {
        // Last step -> compute result
        computeCategoryFromAnswers();
      } else {
        nextStep(totalSteps);
      }
      return;
    }
    // If on models step, show the selection modal instead of proceeding
    if (current.id === 'models') {
      if (selectedModels.length > 0) {
        // If models are already selected, proceed to customizer
        computeCategoryFromAnswers();
      } else {
        // Show modal to select models
        setShowModelSelection(true);
      }
      return;
    }
    // For other steps, require selectedValue
    if (!selectedValue) return;
    // If on step 0 and "Random Model" is selected, prevent going forward via next.
    if (step === 0 && selectedValue === 'Random Model') {
      setShowRandomPrompt(true);
      return;
    }
    if (step === totalSteps - 1) {
      // Last step -> compute result
      computeCategoryFromAnswers();
    } else {
      nextStep(totalSteps);
    }
  };

  // Cancel handler for prompt (reset question if user cancels)
  const handlePromptCancel = () => {
    setAnswer(QUESTIONS[0].id, undefined as any);
    setShowRandomPrompt(false);
  };

  // Is this the reference step?
  const isReferenceStep = current.id === 'refrenece';

  return (
    <div className="absolute flex items-center justify-center z-20 inset-0 h-screen w-full max-[599px]:w-[95%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {showModelSelection ? (
        <ModelSelectionModal
          onCancel={handleModelSelectionCancel}
          onSubmit={handleModelSelectionSubmit}
        />
      ) : showRandomPrompt ? (
        <RandomModelPrompt onCancel={handlePromptCancel} />
      ) : (
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
            {step === 0 ? (
              // Show as buttons for the first question
              <>
                {current.options.map((opt) => {
                  const active = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all ${active
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
              </>
            ) : isReferenceStep ? (
              <>
                {/* Remove the select/options for the reference step */}
                <button
                  type="button"
                  className="w-full mt-2 bg-zinc-800 text-white py-2 px-4 rounded-[0.7em] font-mono uppercase text-[10px] tracking-[0.14em] flex justify-center items-center gap-2 hover:bg-zinc-700 shadow active:scale-95"
                  onClick={() => setShowRefUploader(true)}
                >
                  {referenceImage
                    ? "Edit Uploaded Reference"
                    : "Upload / Paste Reference Image"}
                </button>
                {/* If already uploaded, show a tiny preview/label */}
                {referenceImage && (
                  <div className="flex flex-col items-start mt-1 mb-2">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase">Reference:</span>
                    <div className="mt-1">
                      {referenceImage.startsWith('data:image') || referenceImage.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={referenceImage} alt="Reference" className="max-h-12 max-w-full rounded border border-white/10" />
                      ) : (
                        <span className="break-all text-xs text-zinc-400">{referenceImage}</span>
                      )}
                    </div>
                  </div>
                )}
                {/* Uploader Modal */}
                {showRefUploader && (
                  <ReferenceUploader
                    value={referenceImage}
                    setValue={(src) => {
                      setReferenceImage(src);
                      setShowRefUploader(false);
                    }}
                    onClose={() => setShowRefUploader(false)}
                  />
                )}
              </>
            ) : current.id === 'models' ? (
              // Models question: show button to open selection modal
              <>
                <button
                  type="button"
                  className="w-full mt-2 bg-zinc-800 text-white py-3 px-4 rounded-[0.7em] font-mono uppercase text-[10px] tracking-[0.14em] flex justify-center items-center gap-2 hover:bg-zinc-700 shadow active:scale-95"
                  onClick={() => {
                    // First compute available models without setting category
                    computeAvailableModels();
                    // Small delay to ensure availableModels is populated
                    setTimeout(() => {
                      setShowModelSelection(true);
                    }, 100);
                  }}
                >
                  {selectedModels.length > 0
                    ? `${selectedModels.length} Model${selectedModels.length > 1 ? 's' : ''} Selected`
                    : 'Select Models'}
                </button>
                {selectedModels.length > 0 && (
                  <div className="mt-2 text-[9px] text-zinc-500 font-mono uppercase">
                    {selectedModels.length} model{selectedModels.length > 1 ? 's' : ''} ready
                  </div>
                )}
              </>
            ) : (
              // Other questions: show as dropdown
              <select
                value={selectedValue || ''}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-xs bg-black/60 text-zinc-300 border-white/10 focus:outline-none focus:border-white/40 transition-all"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {current.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {typeof opt.label === 'string' ? opt.label : 'Select Models'} {opt.hint ? `(${opt.hint})` : ''}
                  </option>
                ))}
              </select>
            )}
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
                // Reference step is optional - always enabled
                // Models step is enabled if models are selected or if we need to show modal
                disabled={
                  (!selectedValue && !isReferenceStep && current.id !== 'models') ||
                  (step === 0 && selectedValue === 'Random Model')
                }
                className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.25em] rounded-full bg-white text-black disabled:bg-zinc-500 disabled:text-zinc-900 transition-all active:scale-95"
              >
                {step === totalSteps - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
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
    const { selectedCategory, availableModels, selectedModelId, selectModel, selectedModels } = useWorkshopStore();

  // Get selected models from ALL_MODELS (to show models from all categories), or fallback to availableModels if none selected
  const modelsToShow = selectedModels.length > 0
    ? ALL_MODELS.filter(m => selectedModels.includes(m.id))
    : availableModels;
  
  const activeModel = modelsToShow.find((m) => m.id === selectedModelId) || modelsToShow[0];
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
            <group position={[0, -1, 0]}>
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
                {modelsToShow.map((model) => {
                  const isActive = model.id === selectedModelId;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => selectModel(model.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-[10px] font-mono uppercase tracking-[0.18em] transition-all ${isActive
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
      {/* <div className="absolute bottom-6 left-6 right-80 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-black/60 backdrop-blur border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-400">Workspace Active</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Workshop;