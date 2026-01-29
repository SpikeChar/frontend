import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box, Layers, Zap, Globe, Users, Cpu } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';
import MagicBento from '../Layout/Bento';

gsap.registerPlugin(ScrollTrigger);

const BentoAbout: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { motionEnabled } = useSettings();

    useEffect(() => {
        if (!motionEnabled) return;

        const ctx = gsap.context(() => {
            gsap.from('.bento-item', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, [motionEnabled]);

    return (
        <section id="about" ref={containerRef} className="py-32 max-w-7xl mx-auto w-full flex flex-col items-start justify-center px-6 bg-voxel-950">
                               <div className="mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">THE CHARACTER ENGINE</h2>
                    <p className="text-voxel-400 max-w-2xl text-lg">
                        We build the tools that power the next generation of digital identity. 
                        From indie games to massive metaverse platforms.
                    </p>
                </div>
            <div className="w-full h-full flex items-center justify-center">
            <MagicBento 
  textAutoHide={true}
  enableStars
  enableSpotlight
  enableBorderGlow={true}
  enableTilt={true}
  enableMagnetism={true}
  clickEffect
  spotlightRadius={400}
  particleCount={12}
  glowColor="24, 24, 27"
  disableAnimations={false}
/>
            </div>
        </section>
    );
};

export default BentoAbout;