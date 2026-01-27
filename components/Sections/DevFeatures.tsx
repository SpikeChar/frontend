import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Wallet, Gamepad2, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DevFeatures: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.dev-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const features = [
        {
            title: 'On-Chain Identity',
            desc: 'Link avatars directly to wallet addresses. Support for ENS and customized metadata standards.',
            icon: Wallet
        },
        {
            title: 'Game Interoperability',
            desc: 'One asset, infinite worlds. Standardized rigging ensures compatibility across Unity & Unreal.',
            icon: Gamepad2
        },
        {
            title: 'DAO Governance',
            desc: 'Visual representation for voting members. Unique traits linked to governance weight.',
            icon: Users
        },
        {
            title: 'IP Ownership',
            desc: 'Full commercial rights embedded in the smart contract. Monetize your digital likeness.',
            icon: Database
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 px-6 bg-voxel-950 border-t border-voxel-800">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-4">For Developers</span>
                    <h2 className="font-display text-4xl font-bold">INFRASTRUCTURE FOR THE METAVERSE</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feat, idx) => {
                        const Icon = feat.icon;
                        return (
                            <div key={idx} className="dev-card p-8 bg-voxel-900 border border-voxel-800 hover:border-white/20 transition-colors group">
                                <div className="w-12 h-12 bg-voxel-800 rounded flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3">{feat.title}</h3>
                                <p className="text-sm text-voxel-400 leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default DevFeatures;
