import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Avatar(props) {
  const { nodes, materials } = useGLTF('/avatr.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.007}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[74.787, 0, 0]} rotation={[-Math.PI / 2, 0, 1.563]}>
            <primitive object={nodes._rootJoint} />
            <skinnedMesh
              geometry={nodes.Object_115.geometry}
              material={materials.Eyes}
              skeleton={nodes.Object_115.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_116.geometry}
              material={materials.Shine}
              skeleton={nodes.Object_116.skeleton}
            />
            <skinnedMesh
              geometry={nodes.Object_118.geometry}
              material={materials.M_Orica}
              skeleton={nodes.Object_118.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/avatr.glb')