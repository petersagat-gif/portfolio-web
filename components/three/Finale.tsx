"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { wireLayers } from "./browser";
import { range } from "./util";

/** Footer flourish: the finished browser, redrawn as points, comes apart as the page ends. */
export default function Finale({ mobile }: { mobile: boolean }) {
  const host = useMemo(() => document.querySelector<HTMLElement>("[data-finale]")!, []);
  const group = useRef<THREE.Group>(null!);

  const { pts, mat } = useMemo(() => {
    const segs = wireLayers().flatMap((l, i) => l.map((v, k) => (k % 3 === 2 ? i * 0.02 : v)));
    const lengths: number[] = [];
    let total = 0;
    for (let i = 0; i < segs.length; i += 6) {
      const d = Math.hypot(segs[i + 3] - segs[i], segs[i + 4] - segs[i + 1]);
      lengths.push(d);
      total += d;
    }
    const N = mobile ? 1400 : 3200;
    const pos = new Float32Array(N * 3), dir = new Float32Array(N * 3), delay = new Float32Array(N);
    let n = 0;
    lengths.forEach((d, s) => {
      const count = Math.max(1, Math.round((d / total) * N));
      for (let c = 0; c < count && n < N; c++, n++) {
        const t = Math.random(), i = s * 6;
        pos.set([segs[i] + (segs[i + 3] - segs[i]) * t, segs[i + 1] + (segs[i + 4] - segs[i + 1]) * t, segs[i + 2]], n * 3);
        const a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, k = 0.6 + Math.random() * 1.4;
        dir.set([Math.cos(a) * Math.sqrt(1 - u * u) * k, u * k + 0.4, Math.sin(a) * Math.sqrt(1 - u * u) * k], n * 3);
        delay[n] = Math.random() * 0.45 + (pos[n * 3] + 2) * 0.06; // left side lets go first
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.subarray(0, n * 3), 3));
    g.setAttribute("aDir", new THREE.BufferAttribute(dir.subarray(0, n * 3), 3));
    g.setAttribute("aDelay", new THREE.BufferAttribute(delay.subarray(0, n), 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uP: { value: 0 }, uTime: { value: 0 }, uSize: { value: mobile ? 3 : 3.6 } },
      vertexShader: /* glsl */ `
        uniform float uP, uTime, uSize;
        attribute vec3 aDir; attribute float aDelay;
        varying float vA; varying float vMix;
        void main() {
          float p = clamp((uP - aDelay) / 0.55, 0.0, 1.0);
          p = p * p * (3.0 - 2.0 * p);
          vec3 pos = position + aDir * p * 4.5;
          pos.x += sin(uTime * 1.3 + aDelay * 40.0) * 0.04 * p;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (1.0 - p * 0.5) * (7.0 / -mv.z);
          vA = 1.0 - p * 0.9;
          vMix = p;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA; varying float vMix;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          vec3 col = mix(vec3(0.925, 0.914, 0.886), vec3(0.24, 0.36, 1.0), vMix);
          gl_FragColor = vec4(col, vA * smoothstep(0.5, 0.2, d));
          #include <colorspace_fragment>
        }`,
    });
    return { pts: new THREE.Points(g, mat), mat };
  }, [mobile]);

  useEffect(() => () => (pts.geometry.dispose(), mat.dispose()), [pts, mat]);

  useFrame((state) => {
    const rect = host.getBoundingClientRect();
    // p ≈ 1 when the slot is fully on screen, ≈ 1.1 at the very end of the page.
    const p = (innerHeight - rect.top) / rect.height;
    mat.uniforms.uP.value = range(p, 0.82, 1.1) * 1.25;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.25 - 0.15;
    group.current.rotation.x = 0.12;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={35} position={[0, 0, mobile ? 10 : 7.5]} />
      <group ref={group}>
        <primitive object={pts} />
      </group>
    </>
  );
}
