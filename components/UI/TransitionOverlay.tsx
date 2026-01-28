import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useSettings } from '../Context/SettingsContext';

const TransitionOverlay: React.FC = () => {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentGroupRef = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useSettings();

  useEffect(() => {
    if (!motionEnabled) {
      window.scrollTo(0, 0);
      return;
    }

    // Detect screen width for responsive distances
    const isMobile = window.innerWidth < 768;
    const moveDist = isMobile ? 80 : 180; // Shorter slide on mobile
    const textOffset = isMobile ? 60 : 120; // Tighter text gap on mobile

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onStart: () => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch((error) => console.warn(error));
          }
        },
        onComplete: () => {
          gsap.set(overlayRef.current, { yPercent: 100 });
        }
      });

      // --- INITIAL STATES ---
      gsap.set(overlayRef.current, { yPercent: 0, opacity: 1 });
      
      // Video starts dead center
      gsap.set(videoRef.current, { 
        scale: isMobile ? 1.4 : 2.2, 
        opacity: 0, 
        x: 0 
      }); 

      // Text tucked behind video center
      gsap.set(textRef.current, { 
        opacity: 0, 
        x: moveDist, 
        clipPath: 'inset(0 100% 0 0)' 
      });

      // --- 10-SECOND SIDE-BY-SIDE TIMELINE ---
      
      // 1. Cinematic Fade-In (2.5s)
      tl.to(videoRef.current, {
        opacity: 1,
        duration: 2.5,
        ease: "power2.inOut"
      })
      
      // 2. The Horizontal Split (2.0s)
      .to(videoRef.current, {
        scale: isMobile ? 0.7 : 1, // Smaller logo on mobile to fit text
        x: -moveDist, 
        duration: 2.0,
        ease: "expo.inOut"
      }, "+=0.5")

      // 3. The Text Reveal (2.0s)
      .to(textRef.current, {
        opacity: 1,
        x: textOffset, 
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.0,
        ease: "expo.out"
      }, "-=1.0") 

      // 4. The Long Hold (3.0s)
      .to(contentGroupRef.current, {
        scale: 1.05,
        duration: 3.0,
        ease: "sine.inOut"
      }, "-=0.5")

      // 5. Exit (1.5s)
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 1.5,
        ease: "expo.inOut"
      });

    }, overlayRef);

    return () => ctx.revert();
  }, [location.pathname, motionEnabled]);

  if (!motionEnabled) return null;

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] bg-voxel-950 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      <div 
        ref={contentGroupRef} 
        className="relative flex flex-row items-center justify-center w-full h-full px-4"
      >
          {/* Logo Video */}
          <div className="relative z-30 w-24 h-24 md:w-44 md:h-44 flex items-center justify-center">
              <video
                ref={videoRef}
                src="/loader3.mp4"
                playsInline
                muted
                preload="auto"
                className="w-full h-full object-contain mix-blend-screen" 
              />
          </div>

          {/* Text Content */}
          <div 
              ref={textRef} 
              className="absolute flex flex-col whitespace-nowrap z-20"
          >
              <span className="font-display font-bold text-2xl md:text-6xl text-white tracking-tighter leading-none">
                  SPIKE LABS
              </span>
              <span className="font-mono text-[7px] md:text-[11px] text-voxel-400 uppercase tracking-[0.3em] md:tracking-[0.6em] mt-1">
                  System Intelligence Active
              </span>
          </div>
      </div>
    </div>
  );
};

export default TransitionOverlay;