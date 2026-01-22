import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import { Avatar } from '../components/Avatar'

const Home = () => {
  return (
    <div className='w-full h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative' >
            <h1 className='text-[15vw] font-bold -translate-y-32'>SPIKE LABS</h1>
            <div className="3d-Scene absolute inset-0">
                <Canvas>
                    <OrbitControls enableDamping/>
                    <Environment preset='sunset'/>
                    <Avatar scale={3} position-y={-5} rotation-y={-Math.PI / 2.5}/>
                </Canvas>
            </div>
    </div>
  )
}

export default Home