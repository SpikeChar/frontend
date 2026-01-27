import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const PricingSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { motionEnabled } = useSettings();

    useEffect(() => {
        if (!motionEnabled) return;
        const ctx = gsap.context(() => {
             gsap.from('.pricing-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out'
            });
             gsap.from('.pricing-header', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [motionEnabled]);

    const tiers = [
        { name: 'Indie', price: 'Free', features: ['Unlimited Drafts', 'Web Preview', 'Standard Resolution', 'CC-BY License'] },
        { name: 'Pro', price: '$29', period: '/mo', features: ['GLB/FBX Export', 'Commercial Rights', '4K Textures', 'Priority Rendering'], featured: true },
        { name: 'Studio', price: 'Custom', features: ['API Access', 'White-label Editor', 'Team Management', 'Source Files'] },
    ];

    return (
        <section id="pricing" ref={sectionRef} className="py-32 px-6 bg-voxel-950">
            <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-16 pricing-header">
                    <h2 className="font-display text-4xl font-bold mb-4">SIMPLE PRICING</h2>
                    <p className="text-voxel-400">Start for free, upgrade when you ship.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {tiers.map((tier, i) => (
                        <div key={i} className={`pricing-card relative p-8 border flex flex-col ${tier.featured ? 'bg-voxel-900 border-white/20' : 'bg-voxel-950 border-voxel-800'}`}>
                            {tier.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">Recommended</div>}
                            <div className="mb-8">
                                <h3 className="font-display text-xl font-bold mb-2">{tier.name}</h3>
                                <div className="text-3xl font-bold mb-2">{tier.price}<span className="text-sm font-normal text-voxel-500">{tier.period}</span></div>
                            </div>
                            <ul className="flex-grow space-y-4 mb-8">
                                {tier.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-voxel-300">
                                        <Check className="w-4 h-4 text-white" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 font-bold uppercase tracking-widest text-xs transition-colors rounded ${tier.featured ? 'bg-white text-black hover:bg-voxel-200' : 'border border-voxel-700 hover:bg-voxel-900'}`}>
                                {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;