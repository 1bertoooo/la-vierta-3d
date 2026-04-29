"use client";

import { useGame } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Adega do Sérgio — subterrâneo. Garrafas que sussurram nomes.
 * Player precisa interagir com a garrafa central pra coletar o Coração.
 *
 * Mecânica simples:
 *  - Aproxima da garrafa central → aparece prompt "E pra abrir"
 *  - Apertar E → triggers combate (sombra_adega) E em paralelo dá o coração
 *  - Sombra de Bruna ataca durante combate; após vitória, retorna pra Praça
 */
export default function Adega() {
  return (
    <group>
      {/* Chão de terra batida */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1208" roughness={1} />
      </mesh>
      {/* Paredes (4 boxes finos) */}
      <Parede position={[0, 2, -10]} size={[20, 4, 0.4]} />
      <Parede position={[0, 2, 10]} size={[20, 4, 0.4]} />
      <Parede position={[-10, 2, 0]} size={[0.4, 4, 20]} />
      <Parede position={[10, 2, 0]} size={[0.4, 4, 20]} />

      {/* Prateleiras com garrafas (procedural) */}
      {[-6, -3, 0, 3, 6].map((x) =>
        [-7, -4, 4, 7].map((z) => <GarrafaSibilo key={`${x}-${z}`} position={[x, 0.5, z]} />)
      )}

      {/* Garrafa central — o Coração */}
      <GarrafaCoracao position={[0, 0.6, 0]} />

      {/* Luz baixa quentinha */}
      <pointLight position={[0, 4, 0]} intensity={0.6} distance={12} color="#f4a854" />
      <ambientLight intensity={0.1} color="#3a2818" />

      {/* Escada de saída visível */}
      <mesh position={[8, 0.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#5a4a38" />
      </mesh>
    </group>
  );
}

function Parede({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#2a1a0a" roughness={1} />
    </mesh>
  );
}

function GarrafaSibilo({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  // pulsação leve aleatória
  const offset = position[0] + position[2];
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const v = (Math.sin(t * 1.3 + offset) + 1) * 0.5;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.05 + v * 0.15;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.15, 0.18, 0.7, 8]} />
      <meshStandardMaterial color="#1a1a3a" emissive="#3a3a7a" emissiveIntensity={0.1} roughness={0.6} />
    </mesh>
  );
}

function GarrafaCoracao({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  const myX = useGame((s) => s.myX);
  const myZ = useGame((s) => s.myZ);
  const addPedaco = useGame((s) => s.addPedaco);
  const setScene = useGame((s) => s.setScene);
  const pedacos = useGame((s) => s.pedacosColetados);
  const [proximo, setProximo] = useState(false);
  const [coletado, setColetado] = useState(pedacos.includes("coracao"));

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.5;
    const v = (Math.sin(clock.getElapsedTime() * 2) + 1) * 0.5;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + v * 0.4;
    const dx = position[0] - myX;
    const dz = position[2] - myZ;
    setProximo(Math.hypot(dx, dz) < 1.5);
  });

  // Listener pra E → coleta + dispara combate
  useEffect(() => {
    if (coletado) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e") return;
      const dx = position[0] - useGame.getState().myX;
      const dz = position[2] - useGame.getState().myZ;
      if (Math.hypot(dx, dz) > 1.5) return;
      addPedaco("coracao");
      setColetado(true);
      // Dispara sombra de Bruna
      window.dispatchEvent(new CustomEvent("vierta:start-combat", { detail: "sombra_adega" }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coletado]);

  if (coletado) {
    // Após coletar, garrafa some e player pode voltar
    return (
      <group position={position}>
        <mesh
          position={[0, 0, 0]}
          onClick={() => setScene("praca")}
        >
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#a52a2a" emissive="#a52a2a" emissiveIntensity={0.4} />
        </mesh>
        {proximo && (
          <pointLight position={[0, 0.5, 0]} intensity={0.8} distance={3} color="#a52a2a" />
        )}
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#a52a2a" emissive="#a52a2a" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={proximo ? 1.5 : 0.8} distance={4} color="#a52a2a" />
    </group>
  );
}
