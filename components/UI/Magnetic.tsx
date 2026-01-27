import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSettings } from '../Context/SettingsContext';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
  active?: boolean;
}

const Magnetic: React.FC<MagneticProps> = ({ children, strength = 30, active = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { playSound, motionEnabled } = useSettings();

  useEffect(() => {
    if (!active || !motionEnabled) return;

    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", {duration: 1, ease: "elastic.out(1, 0.3)"});
    const yTo = gsap.quickTo(element, "y", {duration: 1, ease: "elastic.out(1, 0.3)"});

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * (strength / 100)); // normalized strength
      yTo(y * (strength / 100));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    const handleMouseEnter = () => {
        playSound('hover');
    }

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [active, strength, motionEnabled, playSound]);

  return React.cloneElement(children as React.ReactElement<any>, { ref });
};

export default Magnetic;