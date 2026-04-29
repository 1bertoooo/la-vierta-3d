"use client";

import { useGame } from "@/lib/store";
import { CLASSES } from "@/lib/classes";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Avatar } from "./Player";

/**
 * Renderiza todos os outros jogadores conectados.
 * Posição vem do broadcast (ver lib/usePresence.ts).
 * Lerp suave pra esconder jitter.
 */
export default function RemoteAvatars() {
  const remotes = useGame((s) => s.remotes);
  const scene = useGame((s) => s.scene);

  const list = Object.values(remotes).filter((r) => r.scene === scene);

  return (
    <>
      {list.map((r) => (
        <RemoteAvatar key={r.user_id} remote={r} />
      ))}
    </>
  );
}

function RemoteAvatar({ remote }: { remote: ReturnType<typeof useGame.getState>["remotes"][string] }) {
  const ref = useRef<THREE.Group>(null!);
  const cls = CLASSES[remote.classe];

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, remote.x, 0.25);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, remote.z, 0.25);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, remote.rotation, 0.18);
  });

  return (
    <group ref={ref}>
      <Avatar cor={cls.color} emoji={cls.emoji} nome={remote.nome} />
    </group>
  );
}
