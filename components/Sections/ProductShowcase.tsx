import React, { useEffect, useRef, useState } from 'react';
import { PRODUCTS } from '../../constants';
import { Product } from '../../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, X, Box, Layers, BarChart } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';
import Magnetic from '../UI/Magnetic';

gsap.registerPlugin(ScrollTrigger);

const ProductShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'specs' | 'wireframe'>('view');
  
  const { playSound, motionEnabled } = useSettings();
  
  // Enter Animation
  useEffect(() => {
    if (!motionEnabled) return;
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.product-card', {
        scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [motionEnabled]);

  // Modal Animation
  useEffect(() => {
    if (selectedProduct) {
        document.body.style.overflow = 'hidden';
        gsap.fromTo(modalRef.current, 
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' }
        );
    } else {
        document.body.style.overflow = '';
    }
  }, [selectedProduct]);

  // Handle Card Interactions
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!motionEnabled) return;
    playSound('hover');
    const target = e.currentTarget;
    const img = target.querySelector('img');
    const overlay = target.querySelector('.overlay');
    const details = target.querySelector('.details');
    
    gsap.to(target, { y: -10, duration: 0.4, ease: 'power2.out', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' });
    gsap.to(img, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    gsap.to(details, { y: 0, opacity: 1, duration: 0.4, delay: 0.05 });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!motionEnabled) return;
    const target = e.currentTarget;
    const img = target.querySelector('img');
    const overlay = target.querySelector('.overlay');
    const details = target.querySelector('.details');

    gsap.to(target, { y: 0, duration: 0.4, ease: 'power2.out', boxShadow: 'none' });
    gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
    gsap.to(overlay, { opacity: 0, duration: 0.3 });
    gsap.to(details, { y: 10, opacity: 0, duration: 0.3 });
  };

  const handleProductClick = (product: Product) => {
    playSound('click');
    setSelectedProduct(product);
    setActiveTab('view');
  };

  const handleCloseModal = () => {
    playSound('click');
    if (modalRef.current) {
        gsap.to(modalRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => setSelectedProduct(null)
        });
    } else {
        setSelectedProduct(null);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    playSound('switch');
    setActiveTab(tab);
  };

  return (
    <section id="showcase" ref={sectionRef} className="py-32 px-6 bg-voxel-950 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-voxel-800 pb-8">
            <div>
                <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-2">01 — Inventory</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold">LATEST MODULES</h2>
            </div>
            <div className="mt-6 md:mt-0 text-right">
                <p className="text-voxel-400 text-sm max-w-xs ml-auto">
                    Authenticated assets. <span className="text-white">Click to inspect</span> metadata and configuration options.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {PRODUCTS.map((product) => (
                <div 
                    key={product.id}
                    className="product-card group relative h-[500px] bg-voxel-900 border border-voxel-800 overflow-hidden cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleProductClick(product)}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="overlay absolute inset-0 bg-gradient-to-t from-voxel-950 via-transparent to-transparent opacity-60 transition-opacity duration-300"></div>

                    {/* Top UI */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
                        <div className="bg-voxel-950/80 backdrop-blur-sm px-3 py-1 border border-white/10 text-xs font-mono uppercase tracking-wider">
                            {product.category}
                        </div>
                        <div className="text-xs font-mono text-voxel-400">
                            ID: {product.id}
                        </div>
                    </div>

                    {/* Bottom Details - Initially Hidden */}
                    <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                        <div className="details translate-y-4 opacity-80">
                            <h3 className="font-display text-3xl font-bold mb-2">{product.name}</h3>
                            <div className="flex justify-between items-end border-t border-white/20 pt-4 mt-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-voxel-400 font-mono">Polys</span>
                                        <span className="text-sm font-medium">{product.stats.polys}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-voxel-400 font-mono">Format</span>
                                        <span className="text-sm font-medium">{product.stats.format}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <span className="block text-[10px] uppercase text-voxel-400 font-mono text-right">Price</span>
                                     <span className="text-xl font-bold">{product.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Center Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Magnetic strength={50}>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                        </Magnetic>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal}>
            <div 
                ref={modalRef} 
                className="bg-voxel-950 border border-voxel-800 w-full max-w-6xl h-[85vh] relative flex flex-col md:flex-row overflow-hidden shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={handleCloseModal}
                    className="absolute top-6 right-6 z-50 w-10 h-10 bg-voxel-900 border border-voxel-700 flex items-center justify-center text-voxel-400 hover:text-white hover:bg-voxel-800 transition-all rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Left: Interactive Preview */}
                <div className="w-full md:w-2/3 bg-voxel-900 relative flex items-center justify-center group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    
                    {/* Mock 3D View */}
                    <div className="relative w-full h-full">
                         <img 
                            src={selectedProduct.image} 
                            className={`w-full h-full object-cover transition-all duration-700 ${activeTab === 'wireframe' ? 'opacity-10 grayscale invert' : 'opacity-100 grayscale-0'}`}
                            alt="preview"
                        />
                         {activeTab === 'wireframe' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border border-green-500/50 rounded-full animate-pulse flex items-center justify-center">
                                    <div className="text-green-500 font-mono text-xs uppercase">Wireframe Mode</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-voxel-950/80 backdrop-blur p-2 rounded-full border border-voxel-800">
                        <button 
                            onClick={() => handleTabChange('view')}
                            className={`p-3 rounded-full transition-all ${activeTab === 'view' ? 'bg-white text-black' : 'text-voxel-400 hover:text-white'}`}
                            title="Render View"
                        >
                            <Box size={18} />
                        </button>
                        <button 
                             onClick={() => handleTabChange('wireframe')}
                            className={`p-3 rounded-full transition-all ${activeTab === 'wireframe' ? 'bg-white text-black' : 'text-voxel-400 hover:text-white'}`}
                            title="Wireframe"
                        >
                            <Layers size={18} />
                        </button>
                         <button 
                             onClick={() => handleTabChange('specs')}
                            className={`p-3 rounded-full transition-all ${activeTab === 'specs' ? 'bg-white text-black' : 'text-voxel-400 hover:text-white'}`}
                            title="Stats"
                        >
                            <BarChart size={18} />
                        </button>
                    </div>
                </div>

                {/* Right: Details Panel */}
                <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col bg-voxel-950 border-l border-voxel-800 relative">
                     <div className="mb-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-2 py-1 bg-voxel-900 border border-voxel-800 text-[10px] font-mono uppercase tracking-widest text-voxel-400 rounded">
                                {selectedProduct.category}
                            </span>
                            <span className="px-2 py-1 bg-green-900/20 border border-green-900/30 text-[10px] font-mono uppercase tracking-widest text-green-500 rounded">
                                In Stock
                            </span>
                        </div>
                        
                        <h2 className="font-display text-4xl font-bold mb-4">{selectedProduct.name}</h2>
                        <p className="text-voxel-400 text-sm leading-relaxed mb-8">
                            High-fidelity asset ready for production. Optimized for real-time rendering engines with clean topology and 4K PBR textures.
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 border-t border-voxel-800 pt-8 mb-8">
                            <div>
                                <span className="block text-[10px] uppercase text-voxel-500 font-mono mb-1">Polygons</span>
                                <span className="text-lg font-medium">{selectedProduct.stats.polys}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase text-voxel-500 font-mono mb-1">Texture</span>
                                <span className="text-lg font-medium">{selectedProduct.stats.texture}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase text-voxel-500 font-mono mb-1">Format</span>
                                <span className="text-lg font-medium">{selectedProduct.stats.format}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase text-voxel-500 font-mono mb-1">License</span>
                                <span className="text-lg font-medium">Standard</span>
                            </div>
                        </div>
                     </div>

                     <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm text-voxel-400">Total Price</span>
                            <span className="text-3xl font-bold font-display">{selectedProduct.price}</span>
                        </div>
                        <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-colors">
                            Acquire Asset
                        </button>
                     </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;