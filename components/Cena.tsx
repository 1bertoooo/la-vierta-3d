"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Player from "./Player";
import RemoteAvatars from "./RemoteAvatars";
import Praca from "./cenas/Praca";
import Adega from "./cenas/Adega";
import Epilogo from "./cenas/Epilogo";
import { useGame } from "@/lib/store";

/**
 * Cena 3D principal — versão simplificada baseada em exemplos
 * open-source do react-three-fiber/drei (sem Stars/Sky/Suspense complexo).
 *
 * Estrutura mínima:
 *  - Canvas com background sólido
 *  - Luzes (ambient + directional)
 *  - Environment "night" para reflexão sutil
 *  - Cena ativa (praca / adega / epilogo)
 *  - Player local + remotos
 *  - OrbitControls limitado
 */
export default function Cena() {
  const scene = useGame((s) => s.scene);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{
        position: [12, 14, 12],
        fov: 35,
        near: 0.1,
        far: 100,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      onCreated={({ scene: threeScene, gl }) => {
        // Garante background renderizado mesmo se outros componentes falharem
        threeScene.background = null;
        gl.setClearColor("#0a0808", 1);
      }}
    >
      {/* Fog atmosférico (próximo, longe) */}
      <fog attach="fog" args={["#1a1208", 12, 40]} />

      {/* Luzes — pattern padrão R3F */}
      <ambientLight intensity={0.4} color="#9fa8c0" />
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.8}
        color="#c5d0e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={["#7ba3d9", "#3a2818", 0.3]} />

      {/* Grid de chão (drei) — pattern de exemplos do drei */}
      <Grid
        position={[0, 0.005, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3a2818"
        sectionSize={4}
        sectionThickness={1}
        sectionColor="#5a3a28"
        fadeDistance={28}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Cena ativa */}
      {scene === "praca" && <Praca />}
      {scene === "adega" && <Adega />}
      {scene === "epilogo" && <Epilogo />}

      {/* Player local + remotos */}
      <Player />
      <RemoteAvatars />

      {/* Câmera isométrica fixa, com leve rotação manual */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={28}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0.5, 0]}
        enableDamping
        dampingFactor={0.08}
      />

    </Canvas>
  );
}
