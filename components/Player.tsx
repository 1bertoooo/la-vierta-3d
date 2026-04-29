"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "@/lib/store";
import { CLASSES, type Classe } from "@/lib/classes";
import { useMyChar } from "@/lib/usePlayer";

/**
 * Avatar do player local. Movimento por WASD ou arrastar no mapa (touch).
 * Posição é predita client-side; broadcast a cada 100ms via Supabase.
 */
const SPEED = 4.5; // m/s
const TICK_MS = 100;

export default function Player() {
  const groupRef = useRef<THREE.Group>(null!);
  const setMy = useGame((s) => s.setMyPosition);
  const myX = useGame((s) => s.myX);
  const myZ = useGame((s) => s.myZ);
  const myRot = useGame((s) => s.myRotation);

  const me = useMyChar();
  const classe: Classe = me?.classe || "guerreira";
  const cls = CLASSES[classe];

  // Estado de teclas
  const keys = useRef<{ [k: string]: boolean }>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Loop de movimento + broadcast
  const lastBroadcast = useRef(0);
  useFrame((_, delta) => {
    let dx = 0, dz = 0;
    const k = keys.current;
    if (k["w"] || k["arrowup"]) dz -= 1;
    if (k["s"] || k["arrowdown"]) dz += 1;
    if (k["a"] || k["arrowleft"]) dx -= 1;
    if (k["d"] || k["arrowright"]) dx += 1;
    if (dx === 0 && dz === 0) return;

    const len = Math.hypot(dx, dz);
    dx /= len; dz /= len;
    const newX = THREE.MathUtils.clamp(myX + dx * SPEED * delta, -14, 14);
    const newZ = THREE.MathUtils.clamp(myZ + dz * SPEED * delta, -14, 14);
    const rot = Math.atan2(dx, dz);

    setMy(newX, newZ, rot);

    // Broadcast a cada TICK_MS
    const now = performance.now();
    if (now - lastBroadcast.current > TICK_MS) {
      lastBroadcast.current = now;
      // useMyChar dispara o broadcast via hook (ver lib/usePlayer.ts)
      window.dispatchEvent(new CustomEvent("vierta:my-position", {
        detail: { x: newX, z: newZ, rotation: rot },
      }));
    }
  });

  // Aplica posição/rotação ao group a cada frame (suave)
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, myX, 0.3);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, myZ, 0.3);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, myRot, 0.2);
  });

  return (
    <group ref={groupRef}>
      <Avatar cor={cls.color} emoji={cls.emoji} nome={me?.nome || cls.defaultName} />
    </group>
  );
}

/**
 * Avatar low-poly: capsule body + sphere head.
 * Quando tiver assets do Quaternius, substituir por GLB.
 * Por enquanto: cápsula colorida + sphere com retrato planar acima.
 */
export function Avatar({ cor, emoji, nome }: { cor: string; emoji: string; nome: string }) {
  return (
    <group>
      {/* Sombra circular sob (já temos ContactShadows global) */}

      {/* Corpo (cápsula) */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.6, 4, 8]} />
        <meshStandardMaterial color={cor} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Cabeça */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#e6c8a0" roughness={0.7} />
      </mesh>
      {/* "Frente" (pequeno cone indicando direção) */}
      <mesh position={[0, 1.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.05, 0.15, 4]} />
        <meshBasicMaterial color="#1a1208" />
      </mesh>
      {/* Tag flutuante */}
      <mesh position={[0, 1.9, 0]}>
        <planeGeometry args={[1.2, 0.3]} />
        <meshBasicMaterial transparent opacity={0.0} />
      </mesh>
    </group>
  );
}
