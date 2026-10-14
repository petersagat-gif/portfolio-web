"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { displayFont } from "./useCanvas";

const TRAIL = 16;

/** Interaction 04: the wordmark as a liquid surface. The cursor leaves ripples that bend the type. */
export default function Liquid() {
  return (
    <div className="absolute inset-0 touch-none" role="img" aria-label="The WebERV wordmark rippling like liquid under the cursor">
      <Canvas flat dpr={[1, 2]} orthographic camera={{ zoom: 1, position: [0, 0, 1] }} gl={{ antialias: false }}>
        <Surface />
      </Canvas>
    </div>
  );
}

function wordmarkTexture(w: number, h: number) {
  const c = document.createElement("canvas");
  const dpr = Math.min(devicePixelRatio, 2);
  c.width = w * dpr;
  c.height = h * dpr;
  const x = c.getContext("2d") as CanvasRenderingContext2D & { fontStretch: string };
  x.scale(dpr, dpr);
  x.fillStyle = "#131315";
  x.fillRect(0, 0, w, h);
  // fine grid behind the type so the distortion reads everywhere
  x.strokeStyle = "rgba(237,237,234,0.07)";
  x.beginPath();
  for (let gx = 0; gx < w; gx += 24) {
    x.moveTo(gx, 0);
    x.lineTo(gx, h);
  }
  for (let gy = 0; gy < h; gy += 24) {
    x.moveTo(0, gy);
    x.lineTo(w, gy);
  }
  x.stroke();
  const size = Math.min(w / 4.4, h / 2);
  x.fontStretch = "extra-expanded";
  x.font = `900 ${size}px ${displayFont()}`;
  x.textBaseline = "middle";
  const parts = ["WEB", "RV"];
  const wWeb = x.measureText(parts[0]).width, wRv = x.measureText(parts[1]).width, bar = size * 0.62;
  let cx = (w - (wWeb + bar + size * 0.1 + wRv)) / 2;
  x.fillStyle = "#ededea";
  x.fillText(parts[0], cx, h / 2);
  cx += wWeb + size * 0.04;
  x.fillStyle = "#3d5bff";
  for (let i = 0; i < 3; i++) x.fillRect(cx, h / 2 - size * 0.36 + i * size * 0.27, bar, size * 0.16);
  cx += bar + size * 0.06;
  x.fillStyle = "#ededea";
  x.fillText(parts[1], cx, h / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Surface() {
  const { size, viewport } = useThree();
  const trail = useMemo(() => ({ i: 0, pts: Array.from({ length: TRAIL }, () => new THREE.Vector3(-9, -9, 99)) }), []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { map: { value: null as THREE.Texture | null }, uTrail: { value: trail.pts }, uAspect: { value: 1 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D map; uniform vec3 uTrail[${TRAIL}]; uniform float uAspect;
          varying vec2 vUv;
          void main(){
            vec2 off = vec2(0.0);
            for (int i = 0; i < ${TRAIL}; i++) {
              vec3 t = uTrail[i];                    // xy = uv, z = age in seconds
              vec2 d = (vUv - t.xy) * vec2(uAspect, 1.0);
              float r = length(d);
              float wave = sin(r * 70.0 - t.z * 9.0) * exp(-r * 9.0) * exp(-t.z * 1.6);
              off += normalize(d + 1e-5) * wave * 0.018;
            }
            float s = length(off) * 0.6;
            vec3 col = vec3(texture2D(map, vUv + off + vec2(s, 0.0)).r, texture2D(map, vUv + off).g, texture2D(map, vUv + off - vec2(s, 0.0)).b);
            gl_FragColor = vec4(col, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [trail],
  );
  useEffect(() => {
    const tex = wordmarkTexture(size.width, size.height);
    mat.uniforms.map.value = tex;
    mat.uniforms.uAspect.value = size.width / size.height;
    return () => tex.dispose();
  }, [mat, size.width, size.height]);
  useEffect(() => () => mat.dispose(), [mat]);

  useFrame((_, dt) => {
    for (const p of trail.pts) p.z += dt;
  });

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      material={mat}
      onPointerMove={(e) => {
        const t = trail;
        const last = t.pts[(t.i + TRAIL - 1) % TRAIL];
        if (!e.uv || (Math.hypot(e.uv.x - last.x, e.uv.y - last.y) < 0.015 && last.z < 0.05)) return;
        t.pts[t.i].set(e.uv.x, e.uv.y, 0);
        t.i = (t.i + 1) % TRAIL;
      }}
    >
      <planeGeometry />
    </mesh>
  );
}
