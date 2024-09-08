import HouseGLB from "../assets/house.glb?url";
import { useGLTF } from "@react-three/drei";

const House = ({ count }: { count: number }) => {
  const { scene } = useGLTF(HouseGLB);
  return (
    <>
      <directionalLight position={[0, -10, 10]} intensity={2.5} />
      <ambientLight intensity={1} />
      {Array.from(Array(count)).map((_i, i) => (
        <primitive
          object={scene.clone()}
          scale={[0.085, 0.085, 0.085]}
          rotation={[0, i % 2 === 0 ? -Math.PI / 10 : -Math.PI / 6, 0]}
          position={[(i % 2) * 4 - 4, i < 2 ? 1 : -2, 0]}
        />
      ))}
    </>
  );
};

export default House;
