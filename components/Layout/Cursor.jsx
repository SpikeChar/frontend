
import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      // Inner circle: instant
      gsap.set(innerRef.current, {
        x: clientX - 8,
        y: clientY - 8,
      });

      // Outer circle: smooth
      gsap.to(outerRef.current, {
        duration: 0.4,
        x: clientX - 16,
        y: clientY - 16,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div className="max-[1025px]:hidden">
      {/* Outer Circle */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-5 h-5 border border-white will-change-transform rounded-full z-[1000] pointer-events-none mix-blend-difference"
      ></div>

      {/* Inner Circle */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full will-change-transform z-[1000] pointer-events-none mix-blend-difference"
      ></div>
    </div>
  );
};

export default CustomCursor;