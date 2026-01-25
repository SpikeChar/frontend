import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import { Avatar } from '../components/Avatar'
import CameraController from '../components/CameraMove'
import LightRays from '../components/Spotlight'

const Home = () => {
  return (
    <div className='w-full h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative' >
      <h1 className='text-[15vw] font-bold -translate-y-32'>SPIKE LABS</h1>

      <div className='w-full h-screen absolute top-0 left-0 inset-0 z-9'>
        <LightRays
          raysOrigin="top-center"
          raysColor="#E5CD4E"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
    <div className="absolute inset-0 flex items-end py-20 justify-center z-10">
<div className="flex flex-col items-center gap-6">
<p className='text-4xl font-semibold w-[60%] text-center'>Thousands of developers use Ready Player Me to power cross-platform avatars</p>
<div className="btn cursor-pointer text-xl font-semibold rounded-full px-6 py-2 border border-white">TRY NOW</div>
</div>
    </div>
      <div className="3d-Scene absolute inset-0 z-9">
        <Canvas>
          {/* <OrbitControls enableDamping/> */}
          <CameraController />
          <Environment preset='sunset' />
          <Avatar scale={3} position-y={-5} rotation-y={-Math.PI / 2.5} rotation-x={0.1} />
        </Canvas>
      </div>
    </div>
  )
}

export default Home