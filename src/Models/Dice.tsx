import { useRef, useState } from "react";
import DiceGLB from "../assets/dice.glb?url";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

const Dice = ({
  onFinish,
  randomNumber,
}: {
  onFinish: () => void;
  randomNumber: number;
}) => {
  const { nodes, materials } = useGLTF(DiceGLB);
  const diceRef = useRef<Mesh>(null);

  // Physics parameters
  const gravity = -19.6; // Increased gravity acceleration (m/s^2)
  const bounceDamping = 0.6; // Damping factor for each bounce
  const initialVelocity = { x: 2, y: 2, z: 1.5 }; // Reduced initial velocity in z-axis
  const minVelocityThreshold = 0.2; // Minimum velocity to stop bouncing

  // State for position and velocity
  const [velocity, setVelocity] = useState(initialVelocity);
  const [position, setPosition] = useState({ x: 7, y: -7, z: 3 });
  const [bouncing, setBouncing] = useState(true); // State to control animation

  // Predefined rotations
  const rotations = [
    [Math.PI / 2, 0, 0],
    [0, (Math.PI * 3) / 2, 0],
    [Math.PI, 0, 0],
    [0, 0, 0],
    [0, Math.PI / 2, 0],
    [(Math.PI * 3) / 2, 0, 0],
  ];

  useFrame((_state, delta) => {
    if (!diceRef.current || !bouncing) return;

    // Limit the delta to a maximum value to avoid glitches when switching tabs
    const clampedDelta = Math.min(delta, 0.05);

    // Update position based on velocity
    const newPosition = {
      x: position.x - velocity.x * clampedDelta,
      y: position.y + velocity.y * clampedDelta,
      z: position.z + velocity.z * clampedDelta,
    };

    // Apply gravity to the velocity
    const newVelocity = {
      x: velocity.x,
      y: velocity.y,
      z: velocity.z + gravity * clampedDelta,
    };

    // Check for bounce
    if (newPosition.z <= 0 && newVelocity.z < 0) {
      // Invert the velocity and apply damping
      newVelocity.z = -newVelocity.z * bounceDamping;

      // Stop the animation if the bounce is negligible
      if (newVelocity.z < minVelocityThreshold) {
        newVelocity.z = 0;
        newPosition.z = 0;
        setBouncing(false);

        // Snap to the final predefined rotation
        if (diceRef.current) {
          const targetRotation = rotations[randomNumber - 1];
          diceRef.current.rotation.set(
            targetRotation[0],
            targetRotation[1],
            targetRotation[2]
          );
        }
        setTimeout(() => onFinish(), 500);
      }
    }

    // Apply updated position and velocity
    diceRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);

    // Apply random rotation effect while bouncing
    if (diceRef.current) {
      diceRef.current.rotation.x += velocity.x * clampedDelta;
      diceRef.current.rotation.y += velocity.y * clampedDelta;
    }

    // Update state with the new position and velocity
    setPosition(newPosition);
    setVelocity(newVelocity);
  });

  return (
    <group dispose={null}>
      <group rotation={[0, 0, 0]} scale={0.423}>
        <mesh
          ref={diceRef}
          //@ts-ignore
          geometry={nodes.Object_4.geometry}
          material={materials.Dice}
          castShadow
          scale={[1, 1, 1]}
          position={[7, -7, 3]} // Initial position
        />
      </group>
    </group>
  );
};

export default Dice;
