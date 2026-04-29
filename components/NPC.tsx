"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/lib/store";

/**
 * NPC interativo no mundo 3D.
 * - Capsule colorida com cabeça + label.
 * - Detecta proximidade do player local (raio 2.5m).
 * - Se próximo, mostra "E pra falar" e player pode interagir.
 * - Click direto no NPC também abre diálogo (mais mobile-friendly).
 */
type Props = {
  id: string;
  nome: string;
  position: [number, number, number];
  cor: string;
  emoji?: string;
};

export default function NPC({ id, nome, position, cor, emoji }: Props) {
  // nome/emoji ainda não são renderizados (futura tag flutuante via drei.Text)
  void nome; void emoji;
  const ref = useRef<THREE.Group>(null!);
  const myX = useGame((s) => s.myX);
  const myZ = useGame((s) => s.myZ);
  const abrirDialogo = useGame((s) => s.abrirDialogo);
  const dialogoAtivo = useGame((s) => s.dialogoAtivo);
  const [proximo, setProximo] = useState(false);

  useFrame(() => {
    const dx = position[0] - myX;
    const dz = position[2] - myZ;
    const dist = Math.hypot(dx, dz);
    setProximo(dist < 2.5);
    if (ref.current && dist < 6) {
      const targetRot = Math.atan2(dx, dz);
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        targetRot + Math.PI,
        0.05
      );
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Corpo */}
      <mesh
        position={[0, 0.55, 0]}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          if (proximo && !dialogoAtivo) abrirDialogo(id);
        }}
      >
        <capsuleGeometry args={[0.32, 0.6, 4, 8]} />
        <meshStandardMaterial color={cor} roughness={0.6} />
      </mesh>
      {/* Cabeça */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#e6c8a0" roughness={0.7} />
      </mesh>
      {/* Indicador de interagível: ! flutuante quando próximo */}
      {proximo && !dialogoAtivo && (
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#f4cf8e" />
        </mesh>
      )}
      {/* "Aura" sutil — luz pequena na altura da cabeça */}
      <pointLight position={[0, 1.4, 0]} intensity={0.3} distance={2.5} color={cor} />
    </group>
  );
}

// InteractListener obsoleto — substituído por components/InteractKey.tsx (fora do canvas).
