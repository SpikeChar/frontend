import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useForm } from "@formspree/react";
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [state, handleFormSubmit] = useForm("xojnwagk");

    // Reset form on success
    const handleReset = () => {
        setFormData({
            name: "",
            email: "",
            message: "",
        });
        window.location.reload(); // reload to fully reset formspree state
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((fd) => ({
            ...fd,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Only send mapped fields for Formspree
        await handleFormSubmit(
            {
                name: formData.name,
                email: formData.email,
                message: formData.message,
            },
        );
    };

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
        <div ref={containerRef} className="pt-40 max-[599px]:pt-20 max-[599px]:pb-10 pb-20 px-6 min-h-screen bg-voxel-950 flex items-center">
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="contact-anim font-display text-5xl md:text-6xl font-bold mb-12">GET IN TOUCH</h1>

                {state.succeeded ? (
                    <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-8 animate-reveal">
                        <div className="w-24 h-24 bg-green-500 text-white flex items-center justify-center rounded-sm">
                            <Send className="w-10 h-10" />
                        </div>
                        <h3 className="text-4xl  font-black text-white uppercase tracking-tight">
                            Thank you!
                        </h3>
                        <p className="text-white text-lg leading-relaxed">
                            Your message has been sent successfully. We will get back to you soon.
                        </p>
                        <button
                            onClick={handleReset}
                            className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-color"
                        >
                            Reset Form
                        </button>
                    </div>) : (
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="contact-anim grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-mono uppercase text-voxel-500 tracking-widest">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    name="name"
                                    className="bg-transparent border-b border-voxel-700 py-3 text-xl focus:outline-none focus:border-white transition-colors placeholder:text-voxel-700"
                                    placeholder="Sameer Khan"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-mono uppercase text-voxel-500 tracking-widest">Email</label>
                                <input
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    type="email"
                                    name="email"
                                    className="bg-transparent border-b border-voxel-700 py-3 text-xl focus:outline-none focus:border-white transition-colors placeholder:text-voxel-700"
                                    placeholder="sameer@example.com"
                                />
                            </div>
                        </div>

                        <div className="contact-anim flex flex-col gap-2">
                            <label className="text-xs font-mono uppercase text-voxel-500 tracking-widest">Message</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={handleChange}
                                name="message"
                                rows={4}
                                className="bg-transparent border-b border-voxel-700 placeholder:text-voxel-700 py-3 text-xl focus:outline-none focus:border-white transition-colors resize-none"
                                placeholder="Tell us about your project..."
                            />
                        </div>

                        <div className="contact-anim pt-4">
                            <button disabled={state.submitting} className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-voxel-200 transition-colors">
                                {state.submitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Contact;