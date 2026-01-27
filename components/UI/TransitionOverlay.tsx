import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useSettings } from '../Context/SettingsContext';

const TransitionOverlay: React.FC = () => {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useSettings();

  useEffect(() => {
    // Skip complex animation if reduced motion
    if (!motionEnabled) {
        window.scrollTo(0, 0);
        return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
            gsap.set(overlayRef.current, { yPercent: 100 });
        }
      });

      // Reset
      gsap.set(overlayRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(textRef.current, { opacity: 1, y: 0 });

      // Exit (Reveal new page)
      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.2
      })
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'expo.inOut',
      });

    }, overlayRef);

    return () => ctx.revert();
  }, [location.pathname, motionEnabled]);

  if (!motionEnabled) return null;

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] bg-voxel-950 flex items-center justify-center pointer-events-none"
    >
        <div ref={textRef} className="flex flex-col items-center">
            <span className="font-display font-bold text-4xl text-white tracking-tight">VOXEL</span>
            <span className="font-mono text-xs text-voxel-500 uppercase tracking-[0.3em] mt-2">Loading System...</span>
        </div>
    </div>
  );
};

export default TransitionOverlay;