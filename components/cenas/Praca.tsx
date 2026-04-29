"use client";

import { useRef } from "react";
import * as THREE from "three";
import NPC from "../NPC";

/**
 * Lista pública dos NPCs da Praça.
 * InteractKey usa pra achar NPC mais próximo quando aperta E.
 */
export const NPCS_NA_PRACA: { id: string; position: [number, number, number] }[] = [
  { id: "sergio", position: [-9.5, 0, 0] },     // entrada da Taverna
  { id: "anderson", position: [0, 0, -9] },      // pé da Torre
  { id: "walber", position: [9.5, 0, 0] },       // entrada do Mercado
  { id: "bia", position: [11.5, 0, 3] },         // atrás do mercado
  { id: "diego", position: [7, 0, -2] },         // mercado, encostado em poste
  { id: "leticia", position: [4, 0, 6] },        // sul da praça (move ao longo da sessão)
  { id: "janaina", position: [10, 0, 5] },       // mercado lateral
];

/**
 * Praça Central de Velreth. Chão, fonte, lanternas, prédios + NPCs.
 */
export default function Praca() {
  return (
    <group>
      {/* Chão da praça */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#3a2e22" roughness={0.95} />
      </mesh>
      {/* Caminho de pedra em cruz */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 28]} />
        <meshStandardMaterial color="#5a4a38" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
        <planeGeometry args={[4, 28]} />
        <meshStandardMaterial color="#5a4a38" roughness={0.85} />
      </mesh>
      {/* Fonte central */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.8, 12]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#1a3050" emissive="#2a4060" emissiveIntensity={0.3} />
      </mesh>
      {/* 4 lanternas */}
      {([
        [-8, 0, -8],
        [8, 0, -8],
        [-8, 0, 8],
        [8, 0, 8],
      ] as [number, number, number][]).map((pos, i) => (
        <Lanterna key={i} position={pos} />
      ))}
      {/* Taverna do Amarelinho (oeste) */}
      <Predio position={[-12, 0, 0]} size={[5, 4, 5]} cor="#3a2418" telhaCor="#722f37" />
      {/* Torre da Vierta (norte) */}
      <Torre position={[0, 0, -12]} />
      {/* Mercado (leste) */}
      <Predio position={[12, 0, 0]} size={[6, 3, 5]} cor="#2e2418" telhaCor="#5a3a28" />

      {/* NPCs */}
      <NPC id="sergio" nome="Seu Sérgio" position={[-9.5, 0, 0]} cor="#5a3a28" />
      <NPC id="anderson" nome="Mestre Anderson" position={[0, 0, -9]} cor="#3a3a4a" />
      <NPC id="walber" nome="Walber" position={[9.5, 0, 0]} cor="#4a3a2a" />
      <NPC id="bia" nome="Bia" position={[11.5, 0, 3]} cor="#7a3a5a" />
      <NPC id="diego" nome="Diego" position={[7, 0, -2]} cor="#1a1a2a" />
      <NPC id="leticia" nome="Letícia" position={[4, 0, 6]} cor="#a52a2a" />
      <NPC id="janaina" nome="Janaína" position={[10, 0, 5]} cor="#4a2a4a" />
    </group>
  );
}

function Lanterna({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#3a2818" emissive="#f4a854" emissiveIntensity={0.6} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 3, 0]} intensity={1.2} distance={9} color="#f4a854" castShadow />
    </group>
  );
}

function Predio({
  position, size, cor, telhaCor,
}: { position: [number, number, number]; size: [number, number, number]; cor: string; telhaCor: string }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={cor} roughness={0.9} />
      </mesh>
      <mesh position={[0, h + 0.7, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.75, 1.4, 4]} />
        <meshStandardMaterial color={telhaCor} roughness={0.85} />
      </mesh>
      {/* Janela glow */}
      <mesh position={[0, h * 0.55, d / 2 + 0.01]}>
        <planeGeometry args={[w * 0.25, h * 0.25]} />
        <meshStandardMaterial emissive="#f4a854" emissiveIntensity={0.8} color="#3a2818" />
      </mesh>
    </group>
  );
}

function Torre({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 2.0, 8, 8]} />
        <meshStandardMaterial color="#2a2018" roughness={0.92} />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow>
        <coneGeometry args={[1.8, 2, 8]} />
        <meshStandardMaterial color="#3a1a2a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 7, 1.6]}>
        <planeGeometry args={[0.6, 0.9]} />
        <meshStandardMaterial emissive="#7a3aa0" emissiveIntensity={1.0} color="#1a0a1a" />
      </mesh>
      <pointLight position={[0, 7, 1.7]} intensity={0.6} distance={5} color="#9a5ac0" />
    </group>
  );
}
