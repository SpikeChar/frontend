export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  stats: {
    polys: string;
    format: string;
    texture: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface SettingsContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  motionEnabled: boolean;
  toggleMotion: () => void;
  playSound: (type: 'hover' | 'click' | 'switch') => void;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: { name: string; wallet?: string } | null;
}
