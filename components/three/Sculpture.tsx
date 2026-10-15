"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { chromeMaterial } from "./chrome";
import { pointer } from "./util";

/** Hero: a liquid-chrome form that leans towards the cursor and dents where it points. */
export default function Sculpture({ mobile }: { mobile: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const hero = useMemo(() => document.getElementById("top")!, []);
  const { geo, mat } = useMemo(
    () => ({ geo: new THREE.IcosahedronGeometry(1.35, mobile ? 40 : 96), mat: chromeMaterial(true) }),
    [mobile],
  );
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat]);
  const s = useRef({ px: 0, py: 0, push: 0 });
  const still = useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useFrame((state, dt) => {
    const st = s.current;
    const k = Math.min(1, dt * 3);
    st.px += (pointer.x - st.px) * k;
    st.py += (pointer.y - st.py) * k;
    const moving = Math.abs(pointer.x - st.px) + Math.abs(pointer.y - st.py);
    st.push += (Math.min(1, 0.35 + moving * 6) - st.push) * Math.min(1, dt * 2);
    // Scroll: the form drifts up and swells as the hero leaves.
    const out = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / innerHeight));
    // Reduced motion: time stands still, the form only answers the cursor and scroll.
    const t = still ? 0 : state.clock.elapsedTime;
    const u = mat.uniforms;
    u.uTime.value = t;
    u.uPointer.value.set(st.px * 2.2, st.py * 1.6, 1.8);
    u.uPush.value = st.push;
    u.uAmp.value = 0.2 + out * 0.25;
    mesh.current.rotation.set(-st.py * 0.25 + t * 0.03, st.px * 0.35 + t * 0.06, 0);
    // Phones: below the copy, in the open space above the wordmark, so text never sits on chrome.
    mesh.current.position.set(mobile ? 0.35 : 1.15, (mobile ? -0.95 : 0.05) + out * 0.8, 0);
    mesh.current.scale.setScalar((mobile ? 0.5 : 1) * (1 + out * 0.15));
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={32} position={[0, 0, 7]} />
      <mesh ref={mesh} geometry={geo} material={mat} />
    </>
  );
}
