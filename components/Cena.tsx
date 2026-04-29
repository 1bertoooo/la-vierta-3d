"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Stars, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import Player from "./Player";
import RemoteAvatars from "./RemoteAvatars";
import Praca from "./cenas/Praca";
import Adega from "./cenas/Adega";
import Epilogo from "./cenas/Epilogo";
import { useGame } from "@/lib/store";

/**
 * Cena 3D principal. Câmera isometric top-down, luz amarelada de lanternas,
 * chão que muda dependendo da scene atual.
 */
export default function Cena() {
  const scene = useGame((s) => s.scene);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        position: [12, 14, 12],
        fov: 32,
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Suspense fallback={null}>
        {/* Céu noturno com chuva fina */}
        <color attach="background" args={["#0a0808"]} />
        <fog attach="fog" args={["#1a1208", 8, 35]} />
        <Stars radius={120} depth={50} count={2500} factor={3} fade speed={0.4} />

        {/* Luz da lua + lanternas */}
        <ambientLight intensity={0.25} color="#9fa8c0" />
        <directionalLight
          position={[8, 12, 4]}
          intensity={0.4}
          color="#c5d0e8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Cena ativa */}
        {scene === "praca" && <Praca />}
        {scene === "adega" && <Adega />}
        {scene === "epilogo" && <Epilogo />}

        {/* Sombras de contato sob personagens (suaviza visual) */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.5}
          scale={30}
          blur={2}
          far={4}
        />

        {/* Player local + remotos */}
        <Player />
        <RemoteAvatars />

        {/* Câmera fixa isometric, mas com leve rotação manual permitida */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={22}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 3}
          target={[0, 0.5, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
