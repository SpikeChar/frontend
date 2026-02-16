import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileCode, Zap, Layers, Share2 } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const specs = [
    { title: 'Universal Formats', desc: 'Native export to .GLB, .FBX, and .USDZ.', icon: FileCode },
    { title: 'Optimized Topology', desc: 'Quad-based geometry ready for subdivision.', icon: Zap },
    { title: '4K Textures', desc: 'PBR workflows with metallic/roughness maps.', icon: Layers },
    { title: 'Cross-Platform', desc: 'Unity, Unreal, Blender, and WebGL compatible.', icon: Share2 },
];

const Specs: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { motionEnabled } = useSettings();

    useEffect(() => {
        if (!motionEnabled) return;
        
        const ctx = gsap.context(() => {
            gsap.from('.spec-item', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [motionEnabled]);

    return (
        <section id="specs" ref={sectionRef} className="py-24 max-[599px]:py-10 px-6 bg-voxel-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end max-[599px]:items-start mb-16 max-[599px]:mb-6 border-b border-voxel-800 pb-8">
                    <div>
                        <span className="font-mono text-voxel-500 text-sm tracking-widest uppercase block mb-2">Technical</span>
                        <h2 className="font-display text-4xl font-bold">SPECIFICATIONS</h2>
                    </div>
                    <div className="mt- md:mt-0 text-voxel-400 font-mono text-xs uppercase">
                        Spkie Labs v2.4
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-[599px]:gap-4">
                    {specs.map((spec, idx) => {
                        const Icon = spec.icon;
                        return (
                            <div key={idx} className="spec-item p-6 border border-voxel-800 bg-voxel-900/30 hover:bg-voxel-900 transition-colors">
                                <div className="mb-6 text-voxel-400">
                                    <Icon size={24} />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-2">{spec.title}</h3>
                                <p className="text-sm text-voxel-400 leading-relaxed">{spec.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Specs;