import { useRef, useState, useEffect } from "react";
import DiceGLB from "../assets/dice.glb?url";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Material, Mesh, Vector3 } from "three";

type GLTFResult = {
  nodes: {
    Object_4: Mesh;
  };
  materials: {
    Dice: Material;
  };
};

const Dice = ({
  onFinish,
  randomNumber,
}: {
  onFinish: () => void;
  randomNumber: number;
}) => {
  const { nodes, materials } = useGLTF(DiceGLB) as unknown as GLTFResult;
  const diceRef = useRef<Mesh>(null);
  // Physics parameters
  const gravity = -9.8;
  const bounceDamping = 0.5;
  const initialVelocity = new Vector3(-2.5, 2.5, 3); // Slightly adjusted for new starting position
  const minVelocityThreshold = 0.1;

  // State for position, velocity, and animation control
  const [velocity, setVelocity] = useState(initialVelocity);
  const [position, setPosition] = useState(new Vector3(7, -7, 2)); // Moved further to bottom right
  const [bouncing, setBouncing] = useState(true);
  const [startTime] = useState(Date.now());

  // Predefined rotations
  const rotations = [
    [Math.PI / 2, 0, 0],
    [0, (Math.PI * 3) / 2, 0],
    [Math.PI, 0, 0],
    [0, 0, 0],
    [0, Math.PI / 2, 0],
    [(Math.PI * 3) / 2, 0, 0],
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setBouncing(false);
      if (diceRef.current) {
        const targetRotation = rotations[randomNumber - 1];
        diceRef.current.rotation.set(
          targetRotation[0],
          targetRotation[1],
          targetRotation[2]
        );
      }
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useFrame((_, delta) => {
    if (!diceRef.current || !bouncing) return;

    const clampedDelta = Math.min(delta, 0.05);

    const newPosition = position
      .clone()
      .add(velocity.clone().multiplyScalar(clampedDelta));
    const newVelocity = velocity
      .clone()
      .add(new Vector3(0, 0, gravity * clampedDelta));

    if (newPosition.z <= 0 && newVelocity.z < 0) {
      newVelocity.z = -newVelocity.z * bounceDamping;
      newPosition.z = 0;

      newVelocity.x *= 0.8;
      newVelocity.y *= 0.8;

      if (newVelocity.z < minVelocityThreshold) {
        newVelocity.set(0, 0, 0);
        setBouncing(false);
      }
    }

    diceRef.current.position.copy(newPosition);

    const rotationFactor = 0.5;
    diceRef.current.rotation.x += newVelocity.x * clampedDelta * rotationFactor;
    diceRef.current.rotation.y += newVelocity.y * clampedDelta * rotationFactor;
    diceRef.current.rotation.z += newVelocity.z * clampedDelta * rotationFactor;

    setPosition(newPosition);
    setVelocity(newVelocity);
  });

  return (
    <group dispose={null}>
      <group rotation={[0, 0, 0]} scale={0.423}>
        <mesh
          ref={diceRef}
          geometry={nodes.Object_4.geometry}
          material={materials.Dice}
          castShadow
          scale={[1, 1, 1]}
        />
      </group>
    </group>
  );
};

export default Dice;
