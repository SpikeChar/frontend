import { create } from 'zustand';

export type ModelCategory = 'avatar' | 'animal' | 'building';

export interface WizardAnswers {
  [questionId: string]: string;
}

export interface ModelOption {
  id: string;
  name: string;
  category: ModelCategory;
  file: string; // public path to GLB
  image: string;
}

export const ALL_MODELS: ModelOption[] = [
  {
    id: 'avatar-1',
    name: 'Spike Character 1',
    category: 'avatar',
    file: '/models/Character1.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'avatar-2',
    name: 'Spike Character 2',
    category: 'avatar',
    file: '/models/Character2.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'avatar-3',
    name: 'Spike Character 3',
    category: 'avatar',
    file: '/models/Character3.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'animal-1',
    name: 'Creature 1',
    category: 'animal',
    file: '/models/animal1.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'animal-2',
    name: 'Creature 2',
    category: 'animal',
    file: '/models/animal2.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'animal-3',
    name: 'Creature 3',
    category: 'animal',
    file: '/models/animal3.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'weapon-1',
    name: 'Weapon Kit 1',
    category: 'building',
    file: '/models/home1.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'weapon-2',
    name: 'Weapon Kit 2',
    category: 'building',
    file: '/models/home2.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
  },
  {
    id: 'weapon-3',
    name: 'Weapon Kit 3',
    category: 'building',
    file: '/models/home3.glb',
    image: 'https://picsum.photos/seed/ronin/800/800',
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
  selectedModels: string[]; // Array of selected model IDs for multi-select

  // Actions
  setAnswer: (questionId: string, value: string) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  computeCategoryFromAnswers: () => void;
  computeAvailableModels: () => void; // Compute available models without setting category
  selectModel: (modelId: string) => void;
  toggleModelSelection: (modelId: string) => void;
  setSelectedModels: (modelIds: string[]) => void;
  resetAll: () => void;
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  step: 0,
  answers: {},
  selectedCategory: undefined,
  availableModels: [],
  selectedModelId: undefined,
  selectedModels: [],

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

  computeAvailableModels: () => {
    const { answers } = get();

    // Very simple dummy "AI" / rules engine based on answers
    const useCase = answers['what'];
    const genre = answers['gennre'];
    const style = answers['graphic'];

    let category: ModelCategory = 'avatar';

    // If else statment for showing model 

    if (useCase === 'Random Model') {
      category = 'avatar';
    } else if (style === 'Voxel' || style === 'Cartoon') {
      category = 'avatar';
    } else if (style === 'Low Poly' || style === 'Clay Motion') {
      category = 'animal';
    } else if (style === 'High Poly') {
      category = 'building';
    } else {
      switch (genre) {
        case 'Defi War':
        case 'Escape Game':
        case 'Battle Royale':
        case 'Dungeon Siege':
        case 'Cyber Sport':
        case 'Eco Utopia':
        case 'Space Obyssey':
        case 'Shadow Stealth':
        case 'Wild West':
        case 'Ancient Samurai':
          category = 'avatar';
          break;
        default:
          category = 'avatar';
      }
    }

    const availableModels = ALL_MODELS.filter((m) => m.category === category);

    set({
      availableModels,
    });
  },

  computeCategoryFromAnswers: () => {
    const { answers } = get();

    // Very simple dummy "AI" / rules engine based on answers
    const useCase = answers['what'];
    const genre = answers['gennre'];
    const style = answers['graphic'];

    let category: ModelCategory = 'avatar';

    // If else statment for showing model 

    if (useCase === 'Random Model') {
      category = 'avatar';
    } else if (style === 'Voxel' || style === 'Cartoon') {
      category = 'avatar';
    } else if (style === 'Low Poly' || style === 'Clay Motion') {
      category = 'animal';
    } else if (style === 'High Poly') {
      category = 'building';
    } else {
      switch (genre) {
        case 'Defi War':
        case 'Escape Game':
        case 'Battle Royale':
        case 'Dungeon Siege':
        case 'Cyber Sport':
        case 'Eco Utopia':
        case 'Space Obyssey':
        case 'Shadow Stealth':
        case 'Wild West':
        case 'Ancient Samurai':
          category = 'avatar';
          break;
        default:
          category = 'avatar';
      }
    }

    const availableModels = ALL_MODELS.filter((m) => m.category === category);

    set({
      selectedCategory: category,
      availableModels,
      selectedModelId: availableModels[0]?.id,
    });
  },

  selectModel: (modelId) => set({ selectedModelId: modelId }),

  toggleModelSelection: (modelId) =>
    set((state) => {
      const isSelected = state.selectedModels.includes(modelId);
      return {
        selectedModels: isSelected
          ? state.selectedModels.filter((id) => id !== modelId)
          : [...state.selectedModels, modelId],
      };
    }),

  setSelectedModels: (modelIds) => set({ selectedModels: modelIds }),

  resetAll: () =>
    set({
      step: 0,
      answers: {},
      selectedCategory: undefined,
      availableModels: [],
      selectedModelId: undefined,
      selectedModels: [],
    }),
}));

