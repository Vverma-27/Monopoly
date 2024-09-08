import { useRef, useState } from "react";
import HotelGLB from "../assets/hotel.glb?url";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
const Hotel = () => {
  const { scene } = useGLTF(HotelGLB);
  return (
    <>
      <directionalLight position={[0, 10, 100]} intensity={5} />
      {/* <ambientLight intensity={50} /> */}
      <mesh
        scale={[0.04, 0.04, 0.04]}
        rotation={[Math.PI / 6, Math.PI / 12, 0]}
        position={[-1, -3, 0]}
      >
        <primitive object={scene.clone()} />
      </mesh>
    </>
  );
};

export default Hotel;
