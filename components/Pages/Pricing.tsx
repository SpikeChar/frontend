import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
             gsap.from('.price-card', {
                scale: 0.95,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const tiers = [
        { name: 'Builder', price: 'Free', desc: 'For testing and prototyping', features: ['Unlimited Drafts', 'Web Preview', 'Community Support', 'Non-Commercial Use'] },
        { name: 'Creator', price: '0.05 ETH', desc: 'For independent artists', features: ['GLB/GLTF Export', 'Commercial Rights', 'High-Res Textures', 'Priority Rendering', 'Wallet Sync'], featured: true },
        { name: 'Studio', price: '2.0 ETH', desc: 'For game teams & DAOs', features: ['API Access', 'White-label Editor', 'Smart Contract Templates', 'Dedicated Support', 'Source Files'] },
    ];

    return (
        <div ref={containerRef} className="pt-40 pb-20 px-6 min-h-screen bg-voxel-950">
            <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-20">
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">MINT PASSES</h1>
                    <p className="text-xl text-voxel-400">Transparent pricing for the decentralized web.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <div key={i} className={`price-card relative p-8 border flex flex-col ${tier.featured ? 'bg-voxel-900 border-white/20' : 'bg-voxel-950 border-voxel-800'}`}>
                            {tier.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 text-xs font-bold uppercase tracking-widest">Best Value</div>}
                            <div className="mb-8">
                                <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
                                <div className="text-4xl font-bold mb-2">{tier.price}<span className="text-sm font-normal text-voxel-500">{tier.price === 'Free' ? '' : '/yr'}</span></div>
                                <p className="text-sm text-voxel-400">{tier.desc}</p>
                            </div>
                            <ul className="flex-grow space-y-4 mb-8">
                                {tier.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-voxel-300">
                                        <Check className="w-4 h-4 text-white" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 font-bold uppercase tracking-widest text-xs transition-colors ${tier.featured ? 'bg-white text-black hover:bg-voxel-200' : 'border border-voxel-700 hover:bg-voxel-900'}`}>
                                {tier.price === 'Free' ? 'Start Building' : 'Purchase Pass'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
