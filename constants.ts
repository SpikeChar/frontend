import { Product, NavItem, Feature } from './types';
import { Box, Layers, Zap, Grid, Cpu, Globe } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'Preview', href: '#preview' },
  { label: 'Technology', href: '#technology' },
];

export const PRODUCTS: Product[] = [
  {
    id: '001',
    name: 'Ronin Alpha',
    category: 'Avatar',
    price: '0.8 ETH',
    image: 'https://picsum.photos/seed/ronin/800/800',
    stats: { polys: '12k', format: '.GLB', texture: '4K' }
  },
  {
    id: '002',
    name: 'Neon District',
    category: 'Environment',
    price: '1.2 ETH',
    image: 'https://picsum.photos/seed/neondistrict/800/800',
    stats: { polys: '45k', format: '.USDZ', texture: '8K' }
  },
  {
    id: '003',
    name: 'Cyber Katana',
    category: 'Asset',
    price: '0.15 ETH',
    image: 'https://picsum.photos/seed/katana/800/800',
    stats: { polys: '2k', format: '.FBX', texture: '2K' }
  },
  {
    id: '004',
    name: 'Mech Suit X1',
    category: 'Wearable',
    price: '0.5 ETH',
    image: 'https://picsum.photos/seed/mech/800/800',
    stats: { polys: '18k', format: '.GLB', texture: '4K' }
  }
];

export const FEATURES: Feature[] = [
  {
    title: 'Modular Architecture',
    description: 'Every asset is built on a 16px voxel grid system for perfect interoperability.',
    icon: Box
  },
  {
    title: 'Optimized Runtimes',
    description: 'LOD systems built-in. Ready for Unity, Unreal, and WebGL instantly.',
    icon: Zap
  },
  {
    title: 'Layered Customization',
    description: 'Non-destructive material layers allow infinite variation without texture bloat.',
    icon: Layers
  }
];
