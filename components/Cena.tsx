"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * MINIMAL TEST — só pra confirmar que R3F renderiza nesse projeto.
 * Padrão direto da documentação oficial: https://docs.pmnd.rs/react-three-fiber
 *
 * Se isso renderizar uma caixa laranja, o problema estava em Praca/Player/NPC.
 * Depois reintroduzimos cena gradualmente.
 */
export default function Cena() {
  return (
    <Canvas
      style={{
        position: "absolute",
        inset: 0,
        background: "#1a1208",
      }}
      camera={{ position: [3, 3, 5], fov: 50 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      {/* Caixa laranja (proof of life) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>

      {/* Cubo de referência (segundo cubo, vermelho) */}
      <mesh position={[2, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <OrbitControls />
    </Canvas>
  );
}
