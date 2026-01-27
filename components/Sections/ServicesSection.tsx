import React from 'react';
import { Box, PenTool, Cpu, Globe } from 'lucide-react';

const ServicesSection: React.FC = () => {
    const services = [
        { title: 'Character Systems', icon: Box, desc: 'Scalable avatar generation systems for MMOs and social platforms.' },
        { title: 'Custom Rigs', icon: PenTool, desc: 'Bespoke skeleton creation compatible with Mixamo and Unreal Mannequin.' },
        { title: 'Runtime Optimization', icon: Cpu, desc: 'Dynamic LODs and texture streaming solutions for WebGL.' },
        { title: 'World Building', icon: Globe, desc: 'Environment asset kits designed for modular assembly.' },
    ];

    return (
        <section id="services" className="py-24 px-6 bg-voxel-900 border-y border-voxel-800">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-display text-3xl font-bold mb-4">STUDIO SERVICES</h2>
                    <p className="text-voxel-400">Beyond the tool. We help teams build worlds.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="group p-6 bg-voxel-950 border border-voxel-800 hover:border-voxel-600 transition-colors rounded-lg">
                                <Icon className="w-8 h-8 text-voxel-500 mb-4 group-hover:text-white transition-colors" />
                                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                                <p className="text-sm text-voxel-400 leading-relaxed">{s.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;