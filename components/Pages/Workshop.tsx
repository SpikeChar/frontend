import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChevronRight, Wand2, RefreshCw, Download, Share2, ArrowLeft, Hexagon, Layout, Palette } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';
import Magnetic from '../UI/Magnetic';

type FlowState = 'intro' | 'quiz' | 'generating' | 'editor';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; color?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'feel',
    question: "How should your character feel?",
    options: [
      { label: 'Calm & Stoic', value: 'calm' },
      { label: 'Powerful & Bold', value: 'powerful' },
      { label: 'Futuristic', value: 'futuristic' },
      { label: 'Dark & Mysterious', value: 'dark' },
    ]
  },
  {
    id: 'style',
    question: "What style fits your vision?",
    options: [
      { label: 'Minimalist', value: 'minimal' },
      { label: 'Game-Ready', value: 'game' },
      { label: 'Stylized', value: 'stylized' },
      { label: 'Hyper-Real', value: 'real' },
    ]
  },
  {
    id: 'environment',
    question: "Choose a background setting",
    options: [
      { label: 'Studio Neutral', value: 'studio', color: '#18181b' },
      { label: 'Cyberpunk City', value: 'cyber', color: '#312e81' },
      { label: 'Fantasy Forest', value: 'fantasy', color: '#064e3b' },
      { label: 'Deep Space', value: 'space', color: '#000000' },
    ]
  },
  {
    id: 'lighting',
    question: "Select a lighting mood",
    options: [
      { label: 'Soft Studio', value: 'soft' },
      { label: 'Neon Cyber', value: 'neon' },
      { label: 'Dramatic Rim', value: 'dramatic' },
      { label: 'Natural Day', value: 'natural' },
    ]
  },
  {
    id: 'usecase',
    question: "Primary use case?",
    options: [
      { label: 'Game Character', value: 'game' },
      { label: 'VTuber Avatar', value: 'vtuber' },
      { label: 'Social Profile', value: 'social' },
      { label: 'Digital Mascot', value: 'mascot' },
    ]
  }
];

const Workshop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSettings();
  
  const [flowState, setFlowState] = useState<FlowState>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Editor State (Post-Generation)
  const [editorConfig, setEditorConfig] = useState({
    bodyType: 'Humanoid',
    outfit: 'Base',
    color: '#ffffff'
  });

  // Intro Animation
  useEffect(() => {
    if (flowState === 'intro') {
      const ctx = gsap.context(() => {
        gsap.from('.intro-anim', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [flowState]);

  const handleStart = () => {
    playSound('click');
    gsap.to('.intro-anim', {
      y: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      onComplete: () => setFlowState('quiz')
    });
  };

  const handleAnswer = (value: string) => {
    playSound('click');
    const currentQ = QUESTIONS[currentQIndex];
    
    // Save answer
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));

    // Animate out current question
    gsap.to('.quiz-content', {
      x: -20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        if (currentQIndex < QUESTIONS.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          // Animate in next
          gsap.fromTo('.quiz-content', 
            { x: 20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4 }
          );
        } else {
          setFlowState('generating');
        }
      }
    });
  };

  // Generation Simulation
  useEffect(() => {
    if (flowState === 'generating') {
      const tl = gsap.timeline({
        onComplete: () => setFlowState('editor')
      });
      
      tl.from('.gen-text', { opacity: 0, y: 10, duration: 0.5 })
        .to('.gen-bar', { width: '100%', duration: 2.5, ease: 'power2.inOut' })
        .to('.gen-container', { opacity: 0, scale: 0.95, duration: 0.5, delay: 0.2 });
        
      // Pre-set editor config based on answers (mock logic)
      if (answers.style === 'voxel') setEditorConfig(prev => ({ ...prev, bodyType: 'Blocky' }));
      if (answers.environment === 'cyber') setEditorConfig(prev => ({ ...prev, color: '#6366f1' }));
    }
  }, [flowState, answers]);

  // Editor Animation
  useEffect(() => {
    if (flowState === 'editor') {
      gsap.from('.editor-ui', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [flowState]);

  // --- RENDER HELPERS ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <div className="intro-anim w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(79,70,229,0.3)]">
        <Wand2 className="w-8 h-8 text-white" />
      </div>
      <h1 className="intro-anim font-display text-5xl md:text-7xl font-bold mb-6">
        AI SCENE BUILDER
      </h1>
      <p className="intro-anim text-xl text-voxel-400 max-w-2xl mb-12">
        Answer 5 simple questions to generate a concept 3D character and environment.
      </p>
      <div className="intro-anim">
        <Magnetic strength={50}>
          <button 
            onClick={handleStart}
            onMouseEnter={() => playSound('hover')}
            className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-colors flex items-center gap-3"
          >
            Start Creation <ChevronRight size={18} />
          </button>
        </Magnetic>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const q = QUESTIONS[currentQIndex];
    const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 max-w-4xl mx-auto w-full">
        {/* Progress */}
        <div className="w-full h-1 bg-voxel-900 rounded-full mb-12 overflow-hidden">
          <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="quiz-content w-full">
          <span className="font-mono text-voxel-500 text-sm uppercase tracking-widest block mb-4 text-center">
            Step 0{currentQIndex + 1} / 0{QUESTIONS.length}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 text-center">{q.question}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                onMouseEnter={() => playSound('hover')}
                className="group relative p-8 border border-voxel-800 bg-voxel-900/50 hover:bg-voxel-800 hover:border-white/30 text-left transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="font-display text-xl font-medium group-hover:text-white transition-colors">{opt.label}</span>
                  <div className="w-6 h-6 rounded-full border border-voxel-600 group-hover:border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={14} />
                  </div>
                </div>
                {opt.color && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" 
                    style={{ backgroundColor: opt.color }}
                  ></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGenerating = () => (
    <div className="gen-container flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-64 mb-8 relative">
        <div className="h-1 w-full bg-voxel-900 rounded-full overflow-hidden">
          <div className="gen-bar h-full bg-green-500 w-0"></div>
        </div>
      </div>
      <h2 className="gen-text font-display text-3xl font-bold animate-pulse">GENERATING ASSETS...</h2>
      <p className="gen-text text-voxel-500 font-mono text-xs uppercase tracking-widest mt-4">Synthesizing Geometry & Textures</p>
    </div>
  );

  const renderEditor = () => {
    // Dynamic styles based on answers
    const bgStyle = 
      answers.environment === 'cyber' ? 'bg-gradient-to-br from-[#0f172a] to-[#312e81]' :
      answers.environment === 'fantasy' ? 'bg-gradient-to-br from-[#022c22] to-[#14532d]' :
      answers.environment === 'space' ? 'bg-black' : 
      'bg-voxel-900'; // studio default

    const lightingStyle = 
      answers.lighting === 'neon' ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' :
      answers.lighting === 'dramatic' ? 'brightness-125 contrast-125' :
      '';

    return (
      <div className="flex flex-col md:flex-row h-screen pt-20 overflow-hidden">
        {/* Left: Viewport */}
        <div className={`editor-ui relative w-full md:w-2/3 h-[50vh] md:h-full ${bgStyle} transition-colors duration-1000 flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          
          {/* AI Badge */}
          <div className="absolute top-6 left-6 px-3 py-1 bg-black/40 backdrop-blur border border-white/10 rounded-full flex items-center gap-2">
            <Wand2 size={12} className="text-purple-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200">AI Generated Preview</span>
          </div>

          {/* Generated Character Proxy */}
          <div className={`relative transition-all duration-500 ${lightingStyle}`}>
            <div className="w-64 h-96 relative">
              {/* Body Shape */}
              <div 
                className="absolute inset-0 bg-voxel-800 border border-white/10 transition-all duration-500"
                style={{ 
                  borderRadius: editorConfig.bodyType === 'Blocky' ? '4px' : '40px',
                  backgroundColor: answers.style === 'minimal' ? '#52525b' : editorConfig.color
                }}
              >
                {/* Outfit Overlay */}
                <div className="absolute bottom-0 w-full h-1/3 bg-black/20 backdrop-blur-sm border-t border-white/5"></div>
                {/* Head */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-24 bg-voxel-700 rounded-full border border-white/10 shadow-2xl"></div>
              </div>

              {/* Effects based on feel */}
              {answers.feel === 'futuristic' && (
                <div className="absolute -inset-4 border border-blue-500/30 rounded-full animate-pulse"></div>
              )}
              {answers.feel === 'dark' && (
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
              )}
            </div>
            
            {/* Ground Shadow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/50 blur-xl rounded-full"></div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-1/3 h-[50vh] md:h-full bg-voxel-950 border-l border-voxel-800 p-8 overflow-y-auto" data-lenis-prevent>
          <div className="editor-ui mb-8 flex justify-between items-center">
            <h2 className="font-display text-2xl font-bold">CONFIGURATION</h2>
            <button 
              onClick={() => setFlowState('intro')}
              className="p-2 hover:bg-voxel-900 rounded-full text-voxel-400 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="editor-ui space-y-8">
            {/* Attribute 1 */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-voxel-500 mb-3">
                <Hexagon size={14} /> Structure
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Humanoid', 'Cyborg', 'Blocky', 'Ethereal'].map(type => (
                  <button
                    key={type}
                    onClick={() => { playSound('click'); setEditorConfig(p => ({...p, bodyType: type})) }}
                    className={`p-3 text-sm border rounded transition-colors ${editorConfig.bodyType === type ? 'bg-white text-black border-white' : 'bg-voxel-900 border-voxel-800 text-voxel-400 hover:border-voxel-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Attribute 2 */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-voxel-500 mb-3">
                <Layout size={14} /> Environment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Studio', 'Cyber', 'Fantasy', 'Space'].map(env => (
                  <button
                    key={env}
                    onClick={() => { playSound('click'); setAnswers(p => ({...p, environment: env.toLowerCase()})) }}
                    className={`p-3 text-sm border rounded transition-colors ${answers.environment === env.toLowerCase() ? 'bg-white text-black border-white' : 'bg-voxel-900 border-voxel-800 text-voxel-400 hover:border-voxel-600'}`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

             {/* Attribute 3 */}
             <div>
              <label className="flex items-center gap-2 text-xs font-mono uppercase text-voxel-500 mb-3">
                <Palette size={14} /> Tint
              </label>
              <div className="flex gap-2">
                {['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
                  <button
                    key={color}
                    onClick={() => { playSound('click'); setEditorConfig(p => ({...p, color: color})) }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${editorConfig.color === color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="editor-ui mt-12 pt-8 border-t border-voxel-800">
            <h3 className="font-mono text-xs uppercase text-voxel-500 mb-4">Export Options</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> Download .GLB
              </button>
              <button className="w-full py-4 bg-voxel-900 border border-voxel-800 text-voxel-300 font-bold uppercase tracking-widest hover:text-white hover:border-voxel-600 transition-colors flex items-center justify-center gap-2">
                <Share2 size={16} /> Share Concept
              </button>
            </div>
            <p className="text-[10px] text-voxel-600 font-mono mt-4 text-center">
              *Export includes geometry, material layers, and scene lighting configuration.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="bg-voxel-950 min-h-screen text-white relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      {flowState !== 'intro' && flowState !== 'editor' && (
        <button 
            onClick={() => setFlowState('intro')}
            className="absolute top-24 left-6 z-50 text-voxel-500 hover:text-white flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors"
        >
            <ArrowLeft size={14} /> Exit Builder
        </button>
      )}

      {flowState === 'intro' && renderIntro()}
      {flowState === 'quiz' && renderQuiz()}
      {flowState === 'generating' && renderGenerating()}
      {flowState === 'editor' && renderEditor()}
    </div>
  );
};

export default Workshop;