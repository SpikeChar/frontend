import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Box, Code, Cpu, PenTool } from 'lucide-react';

const Services: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
             gsap.from('.service-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const services = [
        { title: 'NFT Collection Generation', icon: Box, desc: 'Procedural generation of 10k+ unique 3D avatars with rarity metadata.' },
        { title: 'Smart Contract Integration', icon: Code, desc: 'Seamlessly link visual assets to Ethereum, Polygon, and Solana contracts.' },
        { title: 'Web3 Game Optimization', icon: Cpu, desc: 'Low-poly, rigged assets ready for browser-based blockchain gaming.' },
        { title: 'Metaverse Architecture', icon: PenTool, desc: 'Custom environments and spaces designed for spatial web experiences.' },
    ];

    return (
        <div ref={containerRef} className="pt-40 pb-20 px-6 min-h-screen bg-voxel-950">
            <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">DEVELOPER SERVICES</h1>
                    <p className="text-xl text-voxel-400 max-w-2xl">
                        We empower Web3 teams to build immersive worlds. From concept to contract.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="service-card p-10 bg-voxel-900 border border-voxel-800 hover:border-voxel-500 transition-colors group">
                                <Icon className="w-10 h-10 text-voxel-500 mb-6 group-hover:text-white transition-colors" />
                                <h3 className="font-display text-2xl font-bold mb-4">{s.title}</h3>
                                <p className="text-voxel-400 leading-relaxed">{s.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Services;
