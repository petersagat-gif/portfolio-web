"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { tick } from "@/lib/sound";

/**
 * Skills on a slowly turning sphere, linked to their nearest neighbours.
 * The labels are the real <button>s server-rendered in [data-toolkit]; this only moves them,
 * so they stay focusable, readable by screen readers and present without WebGL.
 */
export default function Constellation({ mobile }: { mobile: boolean }) {
  const cam = useRef<THREE.PerspectiveCamera>(null!);
  const group = useRef<THREE.Group>(null!);
  const size = useThree((s) => s.size);
  const host = useMemo(() => document.querySelector<HTMLElement>("[data-toolkit]")!, []);
  const labels = useMemo(() => [...host.querySelectorAll<HTMLElement>("[data-skill]")], [host]);
  const note = useMemo(() => host.querySelector<HTMLElement>("[data-skill-note]")!, [host]);
  const r = useRef({ x: 0.35, y: 0, vy: 0.14, dragging: false, lastX: 0, active: -1, faceY: NaN });

  const { points, lines, nodes } = useMemo(() => {
    const n = labels.length;
    const R = 2.4;
    const points = Array.from({ length: n }, (_, i) => {
      const y = 1 - (i / (n - 1)) * 2; // Fibonacci sphere
      const rad = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5));
      // Phones get a tall ellipsoid so the labels use the screen height instead of spilling sideways.
      return new THREE.Vector3(Math.cos(th) * rad * R, y * R * (mobile ? 2.1 : 0.85), Math.sin(th) * rad * R);
    });
    const pos: number[] = [];
    points.forEach((p, i) => {
      points
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter((o) => o.j > i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => pos.push(p.x, p.y, p.z, points[j].x, points[j].y, points[j].z));
    });
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: "#ece9e2", transparent: true, opacity: 0.16 }));
    const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: "#3d5bff" }), n);
    return { points, lines, nodes };
  }, [labels, mobile]);

  useEffect(() => {
    const st = r.current;
    const show = (i: number) => {
      if (st.active === i) return;
      st.active = i;
      labels.forEach((l, j) => l.toggleAttribute("data-active", j === i));
      note.textContent = i >= 0 ? labels[i].dataset.note ?? "" : "";
      if (i >= 0) tick(1600 + i * 40, 0.03, 0.03);
    };
    const down = (e: PointerEvent) => {
      if ((e.target as Element).closest("[data-skill]")) return;
      st.dragging = true;
      st.lastX = e.clientX;
      host.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!st.dragging) return;
      st.vy = (e.clientX - st.lastX) * 0.012;
      st.y += (e.clientX - st.lastX) * 0.006;
      st.lastX = e.clientX;
    };
    const up = () => (st.dragging = false);
    const offs = labels.map((l, i) => {
      const on = () => show(i);
      // Keyboard focus turns the sphere so the focused skill faces the viewer.
      const face = () => {
        const p = points[i];
        const target = Math.atan2(-p.x, p.z);
        st.faceY = st.y + ((((target - st.y) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        show(i);
      };
      const off = () => ((st.faceY = NaN), show(-1));
      const tap = () => show(st.active === i ? -1 : i); // touch: tap toggles, no hover-only content
      l.addEventListener("pointerenter", on);
      l.addEventListener("pointerleave", off);
      l.addEventListener("focus", face);
      l.addEventListener("blur", off);
      l.addEventListener("click", tap);
      return () => {
        l.removeEventListener("pointerenter", on);
        l.removeEventListener("pointerleave", off);
        l.removeEventListener("focus", face);
        l.removeEventListener("blur", off);
        l.removeEventListener("click", tap);
      };
    });
    host.addEventListener("pointerdown", down);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerup", up);
    host.addEventListener("pointercancel", up);
    return () => {
      offs.forEach((f) => f());
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      lines.geometry.dispose();
      (lines.material as THREE.Material).dispose();
      nodes.geometry.dispose();
      (nodes.material as THREE.Material).dispose();
    };
  }, [host, labels, note, lines, nodes, points]);

  const v = useMemo(() => new THREE.Vector3(), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  useFrame((_, dt) => {
    const st = r.current;
    if (!Number.isNaN(st.faceY)) st.y += (st.faceY - st.y) * Math.min(1, dt * 5);
    else if (!st.dragging) {
      const paused = st.active >= 0 ? 0 : 0.14;
      st.vy += (paused - st.vy) * Math.min(1, dt * 1.5);
      st.y += st.vy * dt;
    }
    // Back the camera off until the sphere (plus label width) fits the view's width.
    cam.current.position.z = Math.max(8.4, 3.4 / (0.3153 * (size.width / size.height)));
    group.current.rotation.set(st.x, st.y, 0);
    group.current.updateMatrixWorld();
    points.forEach((p, i) => {
      v.copy(p).applyMatrix4(group.current.matrixWorld);
      const depth = THREE.MathUtils.clamp((v.z + 2.4) / 4.8, 0, 1); // 0 back … 1 front
      const scale = (i === st.active ? 2.2 : 1) * (0.6 + depth * 0.6);
      m.makeScale(scale, scale, scale).setPosition(p);
      nodes.setMatrixAt(i, m);
      v.project(cam.current);
      const el = labels[i];
      el.style.transform = `translate3d(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px, 0) translate(-50%, -50%) scale(${0.78 + depth * 0.32})`;
      // Back half: hidden and not clickable, so labels never overlap as targets. Front: contrast-safe.
      const back = depth < 0.4 && i !== st.active;
      el.style.opacity = back ? "0" : String(0.62 + depth * 0.38);
      el.style.pointerEvents = back ? "none" : "";
      el.style.zIndex = String(Math.round(depth * 100));
    });
    nodes.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={35} position={[0, 0, 8.4]} />
      <group ref={group}>
        <primitive object={lines} />
        <primitive object={nodes} />
      </group>
    </>
  );
}
