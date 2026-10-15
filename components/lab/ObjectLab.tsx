"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { chromeMaterial } from "../three/chrome";

const shapes = [
  () => new THREE.TorusKnotGeometry(1, 0.32, 260, 40),
  () => new THREE.IcosahedronGeometry(1.35, 1),
  () => new THREE.TorusGeometry(1.05, 0.42, 64, 160),
];

/** Interaction 02: drag to spin a chrome object (with inertia); double-click changes the shape. */
export default function ObjectLab() {
  const [shape, setShape] = useState(0);
  const spin = useRef({ vx: 0.004, vy: 0.008, dragging: false, lx: 0, ly: 0 });
  const next = () => setShape((s) => (s + 1) % shapes.length);
  return (
    <>
      <div
        className="absolute inset-0 touch-none"
        onPointerDown={(e) => {
          const s = spin.current;
          s.dragging = true;
          s.lx = e.clientX;
          s.ly = e.clientY;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = spin.current;
          if (!s.dragging) return;
          s.vy = (e.clientX - s.lx) * 0.006;
          s.vx = (e.clientY - s.ly) * 0.006;
          s.lx = e.clientX;
          s.ly = e.clientY;
        }}
        onPointerUp={() => (spin.current.dragging = false)}
        onDoubleClick={next}
        role="img"
        aria-label="A chrome object you can rotate"
      >
        <Canvas flat dpr={[1, 2]} camera={{ position: [0, 0, 5.2], fov: 34 }} gl={{ antialias: true, alpha: true }}>
          <Thing shape={shape} spin={spin} />
        </Canvas>
      </div>
      <button type="button" onClick={next} className="btn btn-ghost !absolute bottom-4 right-4 !px-4 !py-2.5 text-sm">
        Next shape
      </button>
    </>
  );
}

function Thing({ shape, spin }: { shape: number; spin: React.RefObject<{ vx: number; vy: number; dragging: boolean }> }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useMemo(() => {
    const m = chromeMaterial(true);
    m.uniforms.uAmp.value = 0.03;
    m.uniforms.uRim.value = 0.8;
    return m;
  }, []);
  const geo = useMemo(() => shapes[shape](), [shape]);
  const idle = useMemo(() => (matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1), []);
  useEffect(() => () => geo.dispose(), [geo]);
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame((state) => {
    const s = spin.current;
    if (!s.dragging) {
      s.vx += (0.002 * idle - s.vx) * 0.02; // inertia settles back to an idle drift
      s.vy += (0.006 * idle - s.vy) * 0.02;
    }
    mesh.current.rotation.x += s.vx;
    mesh.current.rotation.y += s.vy;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return <mesh ref={mesh} geometry={geo} material={mat} />;
}
