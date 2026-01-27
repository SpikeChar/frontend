import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Contact: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
             gsap.from('.contact-anim', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
         <div ref={containerRef} className="pt-40 pb-20 px-6 min-h-screen bg-voxel-950 flex items-center">
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="contact-anim font-display text-5xl md:text-6xl font-bold mb-12">GET IN TOUCH</h1>
                
                <form className="space-y-8">
                    <div className="contact-anim grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase text-voxel-500 tracking-widest">Name</label>
                            <input type="text" className="bg-transparent border-b border-voxel-700 py-3 text-xl focus:outline-none focus:border-white transition-colors" placeholder="John Doe" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase text-voxel-500 tracking-widest">Email</label>
                            <input type="email" className="bg-transparent border-b border-voxel-700 py-3 text-xl focus:outline-none focus:border-white transition-colors" placeholder="john@example.com" />
                        </div>
                    </div>
                    
                    <div className="contact-anim flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase text-voxel-500 tracking-widest">Message</label>
                        <textarea rows={4} className="bg-transparent border-b border-voxel-700 py-3 text-xl focus:outline-none focus:border-white transition-colors resize-none" placeholder="Tell us about your project..." />
                    </div>

                    <div className="contact-anim pt-4">
                        <button className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-colors">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
         </div>
    );
};

export default Contact;