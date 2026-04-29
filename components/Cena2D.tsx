"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/store";
import { useMyChar } from "@/lib/usePlayer";
import { CLASSES, type Classe } from "@/lib/classes";

/**
 * Cena 2D top-down — pattern de RPGs em browser (delaford/game, RPG-JS).
 * Funciona em qualquer browser sem WebGL nem R3F.
 *
 * Player anda clicando/tocando no mapa. NPCs são clicáveis.
 * Câmera = CSS transform que centraliza o player na tela.
 *
 * Mundo é um div 1200x1200 com prédios/elementos posicionados em px.
 */

const TILE = 40; // px por unidade de mundo
const WORLD = 1200;
const SPEED = 220; // px por segundo

type Pos = { x: number; y: number };

const NPCS = [
  { id: "sergio", nome: "Seu Sérgio", emoji: "👨‍🍳", pos: { x: 200, y: 600 }, label: "Taverna" },
  { id: "anderson", nome: "Mestre Anderson", emoji: "🧙‍♂️", pos: { x: 600, y: 200 }, label: "Torre" },
  { id: "walber", nome: "Walber", emoji: "🧔", pos: { x: 1000, y: 600 }, label: "Mercado" },
  { id: "bia", nome: "Bia", emoji: "🧝‍♀️", pos: { x: 1080, y: 720 }, label: "Atrás do mercado" },
  { id: "diego", nome: "Diego", emoji: "🧛", pos: { x: 880, y: 480 }, label: "Sombras" },
  { id: "leticia", nome: "Letícia", emoji: "🧚", pos: { x: 720, y: 880 }, label: "Sul da praça" },
  { id: "janaina", nome: "Janaína", emoji: "🧞‍♀️", pos: { x: 1040, y: 800 }, label: "Mercado" },
] as const;

const PREDIOS = [
  { x: 100, y: 500, w: 220, h: 220, label: "Taverna do Amarelinho", emoji: "🍻" },
  { x: 540, y: 100, w: 220, h: 220, label: "Torre da Vierta", emoji: "🌑" },
  { x: 940, y: 500, w: 220, h: 220, label: "Mercado", emoji: "🏛️" },
];

export default function Cena2D() {
  const myX = useGame((s) => s.myX);
  const myZ = useGame((s) => s.myZ);
  const setMy = useGame((s) => s.setMyPosition);
  const abrirDialogo = useGame((s) => s.abrirDialogo);
  const dialogoAtivo = useGame((s) => s.dialogoAtivo);

  const me = useMyChar();
  const classe: Classe = (me?.classe as Classe) || "guerreira";
  const cls = CLASSES[classe];

  // Player position em px (não unidades) — converter de myX/myZ
  const [playerPx, setPlayerPx] = useState<Pos>({
    x: WORLD / 2 + myX * TILE,
    y: WORLD / 2 + myZ * TILE,
  });
  // Target onde o player tá indo
  const targetRef = useRef<Pos>(playerPx);
  const lastTickRef = useRef<number>(performance.now());

  // Loop de movimento
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      setPlayerPx((cur) => {
        const tx = targetRef.current.x;
        const ty = targetRef.current.y;
        const dx = tx - cur.x;
        const dy = ty - cur.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 1) return cur;
        const step = Math.min(dist, SPEED * dt);
        const nx = cur.x + (dx / dist) * step;
        const ny = cur.y + (dy / dist) * step;
        // Sincroniza store (em unidades)
        setMy(
          (nx - WORLD / 2) / TILE,
          (ny - WORLD / 2) / TILE,
          Math.atan2(dx, -dy)
        );
        // Broadcast multiplayer
        window.dispatchEvent(
          new CustomEvent("vierta:my-position", {
            detail: {
              x: (nx - WORLD / 2) / TILE,
              z: (ny - WORLD / 2) / TILE,
              rotation: Math.atan2(dx, -dy),
            },
          })
        );
        return { x: nx, y: ny };
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [setMy]);

  // Click/tap no mapa → seta target
  const onMapPointerDown = (e: React.PointerEvent) => {
    if (dialogoAtivo) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const tx = e.clientX - rect.left;
    const ty = e.clientY - rect.top;
    targetRef.current = {
      x: Math.max(40, Math.min(WORLD - 40, tx)),
      y: Math.max(40, Math.min(WORLD - 40, ty)),
    };
  };

  // Câmera: o div .camera é o viewport (toda a tela). Dentro dele tem o .world
  // posicionado pra centralizar o player.
  const cameraOffsetX =
    typeof window !== "undefined"
      ? window.innerWidth / 2 - playerPx.x
      : -playerPx.x;
  const cameraOffsetY =
    typeof window !== "undefined"
      ? window.innerHeight / 2 - playerPx.y
      : -playerPx.y;

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(ellipse at center, #2a1a0a 0%, #0a0808 80%)",
      }}
    >
      <div
        className="absolute"
        style={{
          width: WORLD,
          height: WORLD,
          transform: `translate(${cameraOffsetX}px, ${cameraOffsetY}px)`,
          transition: "transform 0.08s linear",
        }}
        onPointerDown={onMapPointerDown}
      >
        {/* Chão da praça (textura procedural via gradient repetido) */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, #5a4a38 0%, #3a2e22 60%, #2a1e12 100%),
              repeating-linear-gradient(45deg, transparent 0 20px, rgba(0,0,0,0.05) 20px 40px)
            `,
          }}
        />

        {/* Caminhos em cruz */}
        <div
          className="absolute"
          style={{
            left: WORLD / 2 - 40,
            top: 0,
            width: 80,
            height: WORLD,
            background: "rgba(218, 178, 122, 0.12)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: 0,
            top: WORLD / 2 - 40,
            width: WORLD,
            height: 80,
            background: "rgba(218, 178, 122, 0.12)",
          }}
        />

        {/* Fonte central */}
        <div
          className="absolute flex items-center justify-center text-5xl"
          style={{
            left: WORLD / 2 - 50,
            top: WORLD / 2 - 50,
            width: 100,
            height: 100,
            background:
              "radial-gradient(circle, rgba(70,90,140,0.4) 0%, rgba(40,60,90,0.1) 70%)",
            borderRadius: "50%",
            border: "2px solid rgba(218, 178, 122, 0.3)",
          }}
        >
          ⛲
        </div>

        {/* Lanternas (luz amarelada) */}
        {[
          [120, 120],
          [WORLD - 120, 120],
          [120, WORLD - 120],
          [WORLD - 120, WORLD - 120],
        ].map(([lx, ly], i) => (
          <div
            key={i}
            className="absolute text-3xl"
            style={{
              left: lx - 12,
              top: ly - 16,
              filter: "drop-shadow(0 0 24px #f4a854) drop-shadow(0 0 48px #f4a854)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            🔥
          </div>
        ))}

        {/* Prédios */}
        {PREDIOS.map((p) => (
          <div
            key={p.label}
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              background:
                "linear-gradient(180deg, rgba(58, 36, 24, 0.9) 0%, rgba(38, 26, 18, 0.95) 100%)",
              border: "2px solid rgba(114, 47, 55, 0.6)",
              borderRadius: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            <div className="text-6xl mb-2 opacity-70">{p.emoji}</div>
            <div
              className="text-xs uppercase tracking-widest text-[var(--color-dourado)]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {p.label}
            </div>
          </div>
        ))}

        {/* NPCs */}
        {NPCS.map((npc) => {
          const dx = npc.pos.x - playerPx.x;
          const dy = npc.pos.y - playerPx.y;
          const dist = Math.hypot(dx, dy);
          const proximo = dist < 90;
          return (
            <button
              key={npc.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (proximo && !dialogoAtivo) abrirDialogo(npc.id);
              }}
              className="absolute flex flex-col items-center cursor-pointer"
              style={{
                left: npc.pos.x - 24,
                top: npc.pos.y - 32,
                background: "transparent",
                border: 0,
                padding: 0,
                filter: proximo
                  ? "drop-shadow(0 0 12px #f4cf8e)"
                  : "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
              }}
            >
              <div
                className="text-4xl"
                style={{
                  transform: proximo ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.2s",
                }}
              >
                {npc.emoji}
              </div>
              <div
                className="text-[10px] mt-1 px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  color: proximo
                    ? "var(--color-dourado-claro)"
                    : "var(--color-pergaminho-velho)",
                  border: proximo
                    ? "1px solid var(--color-dourado)"
                    : "1px solid transparent",
                  fontFamily: "var(--font-cinzel)",
                }}
              >
                {npc.nome}
              </div>
            </button>
          );
        })}

        {/* Player local */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: playerPx.x - 24,
            top: playerPx.y - 36,
            transition: "left 0.08s linear, top 0.08s linear",
          }}
        >
          <div
            className="text-4xl"
            style={{
              filter: `drop-shadow(0 0 16px ${cls.color})`,
            }}
          >
            {cls.emoji}
          </div>
          <div
            className="text-[10px] text-center mt-0.5 px-1.5 py-0.5 rounded mx-auto whitespace-nowrap"
            style={{
              background: cls.color,
              color: "#1a1208",
              fontFamily: "var(--font-cinzel)",
              boxShadow: `0 0 12px ${cls.color}`,
              maxWidth: 100,
            }}
          >
            {me?.nome || cls.defaultName}
          </div>
        </div>

        {/* Crosshair no target (visível brevemente) */}
        {targetRef.current && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: targetRef.current.x - 8,
              top: targetRef.current.y - 8,
              width: 16,
              height: 16,
              border: "2px solid var(--color-dourado)",
              borderRadius: "50%",
              opacity: 0.5,
              animation: "ping 1s ease-out forwards",
            }}
          />
        )}
      </div>

      {/* Hint mobile */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest pointer-events-none"
        style={{ color: "var(--color-pergaminho-velho)" }}
      >
        Toque/clique para andar • Toque no NPC para conversar
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        @keyframes ping {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
