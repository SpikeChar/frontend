import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Box, PenTool, Layout } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Ecosystem: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.eco-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                scale: 0.95,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const categories = [
        { title: 'Avatars', icon: User, count: '24 Items' },
        { title: 'Environments', icon: Layout, count: '12 Kits' },
        { title: 'Props', icon: Box, count: '156 Assets' },
        { title: 'Tools', icon: PenTool, count: '8 Plugins' },
    ];

    return (
        <section ref={sectionRef} className="py-24 px-6 bg-voxel-950">
            <div className="max-w-7xl mx-auto">
                 <div className="mb-12 flex justify-between items-end">
                    <h2 className="font-display text-3xl font-bold">ECOSYSTEM</h2>
                    <a href="#" className="text-xs font-mono uppercase tracking-widest text-voxel-500 hover:text-white transition-colors">View All Categories</a>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <div key={idx} className="eco-card group bg-voxel-900 border border-voxel-800 p-6 flex flex-col items-center justify-center gap-4 hover:border-voxel-600 transition-all cursor-pointer aspect-square">
                                <div className="p-4 bg-voxel-950 rounded-full text-voxel-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    <Icon size={24} />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-display font-bold text-lg">{cat.title}</h3>
                                    <span className="text-[10px] font-mono uppercase text-voxel-500 tracking-wider">{cat.count}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default Ecosystem;