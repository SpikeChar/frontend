import { create } from 'zustand';

export type ModelCategory = 'avatar' | 'animal' | 'weapon';

export interface WizardAnswers {
  [questionId: string]: string;
}

export interface ModelOption {
  id: string;
  name: string;
  category: ModelCategory;
  file: string; // public path to GLB
}

const ALL_MODELS: ModelOption[] = [
  {
    id: 'avatar-1',
    name: 'Spike Character 1',
    category: 'avatar',
    file: '/models/Character1.glb',
  },
  {
    id: 'avatar-2',
    name: 'Spike Character 2',
    category: 'avatar',
    file: '/models/Character2.glb',
  },
  {
    id: 'avatar-3',
    name: 'Spike Character 3',
    category: 'avatar',
    file: '/models/Character3.glb',
  },
  {
    id: 'animal-1',
    name: 'Creature 1',
    category: 'animal',
    file: '/models/animal1.glb',
  },
  {
    id: 'animal-2',
    name: 'Creature 2',
    category: 'animal',
    file: '/models/animal2.glb',
  },
  {
    id: 'animal-3',
    name: 'Creature 3',
    category: 'animal',
    file: '/models/animal3.glb',
  },
  {
    id: 'weapon-1',
    name: 'Weapon Kit 1',
    category: 'weapon',
    file: '/models/home1.glb',
  },
  {
    id: 'weapon-2',
    name: 'Weapon Kit 2',
    category: 'weapon',
    file: '/models/home2.glb',
  },
  {
    id: 'weapon-3',
    name: 'Weapon Kit 3',
    category: 'weapon',
    file: '/models/home3.glb',
  },
];

interface WorkshopState {
  // Wizard
  step: number;
  answers: WizardAnswers;

  // Result
  selectedCategory?: ModelCategory;
  availableModels: ModelOption[];
  selectedModelId?: string;

  // Actions
  setAnswer: (questionId: string, value: string) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  computeCategoryFromAnswers: () => void;
  selectModel: (modelId: string) => void;
  resetAll: () => void;
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  step: 0,
  answers: {},
  selectedCategory: undefined,
  availableModels: [],
  selectedModelId: undefined,

  setAnswer: (questionId, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: value,
      },
    })),

  nextStep: (totalSteps) =>
    set((state) => ({
      step: Math.min(state.step + 1, totalSteps - 1),
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 0),
    })),

  computeCategoryFromAnswers: () => {
    const { answers } = get();

    // Very simple dummy "AI" / rules engine based on answers
    const useCase = answers['useCase'];
    const vibe = answers['vibe'];
    const audience = answers['audience'];

    let category: ModelCategory = 'avatar';

    // If user leans towards creatures / pets / game assets -> animal
    if (useCase === 'game-creature' || audience === 'kids' || vibe === 'playful') {
      category = 'animal';
    }

    // If user wants weapons / props / combat -> weapon
    if (useCase === 'weapon-pack' || vibe === 'aggressive' || audience === 'hardcore-gamers') {
      category = 'weapon';
    }

    const availableModels = ALL_MODELS.filter((m) => m.category === category);

    set({
      selectedCategory: category,
      availableModels,
      selectedModelId: availableModels[0]?.id,
    });
  },

  selectModel: (modelId) => set({ selectedModelId: modelId }),

  resetAll: () =>
    set({
      step: 0,
      answers: {},
      selectedCategory: undefined,
      availableModels: [],
      selectedModelId: undefined,
    }),
}));

