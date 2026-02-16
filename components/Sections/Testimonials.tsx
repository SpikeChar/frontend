import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '../Context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

const Testimonials: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { motionEnabled } = useSettings();

    useEffect(() => {
        if (!motionEnabled) return;
        const ctx = gsap.context(() => {
            gsap.from('.testimonial-fade', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                y: 40,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [motionEnabled]);

    const reviews = [
        { text: "Spike Labs drastically reduced our character pipeline time. The assets are clean, optimized, and ready for Unity.", author: "Alex Chen", role: "Art Director, PolyArc" },
        { text: "The modularity is incredible. We built 50 unique NPCs in a single afternoon.", author: "Sarah Jenkins", role: "Indie Developer" },
        { text: "Finally, a character creator that respects topology. No mess, just good quads.", author: "Marcus V.", role: "3D Generalist" },
    ];

    return (
        <section id="testimonials" ref={sectionRef} className="py-24 max-[599px]:py-10 px-6 bg-voxel-950 border-t border-voxel-800">
            <div className="max-w-4xl mx-auto text-center testimonial-fade">
                 <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    className="pb-12"
                 >
                    {reviews.map((review, i) => (
                        <SwiperSlide key={i}>
                            <div className="py-8 px-4">
                                <blockquote className="font-display text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                                    "{review.text}"
                                </blockquote>
                                <div className="flex flex-col items-center">
                                    <cite className="not-italic font-bold text-white mb-1">{review.author}</cite>
                                    <span className="text-xs text-voxel-500 font-mono uppercase tracking-widest">{review.role}</span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                 </Swiper>
            </div>
        </section>
    );
};

export default Testimonials;