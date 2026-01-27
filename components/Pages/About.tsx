import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.anim-text', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="pt-40 pb-20 px-6 min-h-screen bg-voxel-950">
            <div className="max-w-4xl mx-auto">
                <span className="anim-text font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-6">Why We Build</span>
                <h1 className="anim-text font-display text-5xl md:text-7xl font-bold mb-12">
                    DECENTRALIZED <br />
                    <span className="text-voxel-500">DIGITAL IDENTITY</span>
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="anim-text text-xl text-voxel-200 leading-relaxed font-light">
                        <p className="mb-8">
                            In the era of Web3, ownership is paramount. We believe your digital avatar should be more than a skin in a closed garden—it should be an asset you own, trade, and take with you across the metaverse.
                        </p>
                        <p>
                            Voxel Studios provides the tooling for developers to integrate rich, customizable NFT characters into their DApps without building a 3D engine from scratch.
                        </p>
                    </div>
                    <div className="anim-text">
                        <div className="w-full h-80 bg-voxel-900 border border-voxel-800 relative overflow-hidden">
                             <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-voxel-700 rotate-45"></div>
                             <div className="absolute bottom-4 left-4 text-[10px] font-mono text-green-500 uppercase">Contract Verified</div>
                        </div>
                    </div>
                </div>

                <div className="anim-text mt-32 border-t border-voxel-800 pt-16">
                    <h3 className="font-display text-3xl font-bold mb-8">CORE VALUES</h3>
                    <ul className="space-y-6">
                        {['True Ownership via ERC-721.', 'Cross-Chain Compatibility.', 'Open Source Standards.'].map((item, i) => (
                            <li key={i} className="text-2xl md:text-4xl text-voxel-600 hover:text-white transition-colors cursor-default font-display font-medium">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;
