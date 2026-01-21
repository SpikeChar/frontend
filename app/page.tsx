'use client'
import React, { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import {EffectComposer, Bloom} from '@react-three/postprocessing'
import { GridScan } from '@/components/Background';

const CameraController = () => {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-1 to 1)
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ camera }) => {
    // Camera position ko smoothly update karo
    const targetX = mousePosition.current.x * 0.3;
    const targetY = mousePosition.current.y * 0.3;

    camera.position.x += (targetX - camera.position.x) * 0.1;
    camera.position.y += (targetY - camera.position.y) * 0.1;

    // Camera ko center ki taraf point karo
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const getTextColor = () => {
  // Use CSS custom property to match UI text (foreground color)
  if (typeof window !== "undefined") {
    return getComputedStyle(document.documentElement).getPropertyValue("--foreground")?.trim() || "#ededed";
  }
  return "#ededed";
};
  
const page = () => {
  // Evaluate text colors only on client
  const mainTextColor = getTextColor();
  const subTextColor = getTextColor();

  return (
    <>
      <Canvas>
        <CameraController />

        <EffectComposer disableNormalPass>
          {/* Bloom makes text glow */}
          <Bloom intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>

        <Text
          fontSize={typeof window !== "undefined" && window.innerWidth < 640 ? 0.7 : typeof window !== "undefined" && window.innerWidth < 1024 ? 1.3 : 2}
          fontWeight={800}
          anchorX="center"
          anchorY="middle"
          maxWidth={typeof window !== "undefined" && window.innerWidth < 640 ? 6 : typeof window !== "undefined" && window.innerWidth < 1024 ? 15 : 15}
          color={mainTextColor}
        >
          SPIKE LABS
        </Text>
        <Text
          position={[
            0, 
            typeof window !== "undefined" && window.innerWidth < 640
              ? -0.8
              : typeof window !== "undefined" && window.innerWidth < 1024
              ? -1
              : -1.5, 
            0
          ]}
          fontWeight={600}
          fontSize={typeof window !== "undefined" && window.innerWidth < 640 ? 0.35 : typeof window !== "undefined" && window.innerWidth < 1024 ? 0.7 : 1}
          anchorX="center"
          anchorY="middle"
          maxWidth={typeof window !== "undefined" && window.innerWidth < 640 ? 5 : 10}
          color={subTextColor}
        >
          COMING SOON
        </Text>
      </Canvas>
      <div className='absolute top-0 left-0 w-full h-screen inset-0 -z-1'>
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>
    </>
  )
}

export default page