"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { tick } from "@/lib/sound";
import { LAYER_GAP, blockBox, blocks, screenBox, wireLayers } from "./browser";
import { curvedPlane, drawLiveSite, makeWire, revealMaterial, screenMaterial, type LiveCopy } from "./materials";
import { clamp01, pointer, range, smooth, backOut } from "./util";

export type ScreenData = { href: string; src: string; video: boolean; accent: string };

const lerp = THREE.MathUtils.lerp;

/** Hero → build story → work gallery: one object, one camera, driven by scroll position. */
export default function World({ screens, copy, mobile }: { screens: ScreenData[]; copy: LiveCopy; mobile: boolean }) {
  const cam = useRef<THREE.PerspectiveCamera>(null!);
  const object = useRef<THREE.Group>(null!);
  const layers = useRef<THREE.Group[]>([]);
  const gallery = useRef<THREE.Group>(null!);
  const size = useThree((s) => s.size);
  const router = useRouter();
  const intro = useRef({ draw: 0 });
  const s = useRef({ px: 0, py: 0, lastW: 0, vel: 0, hovered: -1, zoom: 0, f: 0 });

  const wires = useMemo(
    () =>
      wireLayers().map((seg) => {
        const core = makeWire(seg, "#ece9e2", 1.3);
        const halo = makeWire(seg, "#3d5bff", 7, 0.18, true);
        core.wire.renderOrder = halo.wire.renderOrder = 1; // lines draw over the design fills
        return { core, halo };
      }),
    [],
  );
  const fills = useMemo(
    () =>
      blocks.map((b) => {
        const box = blockBox(b);
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(box.w, box.h),
          new THREE.MeshBasicMaterial({ color: b.color, transparent: true, opacity: 0, depthWrite: false }),
        );
        mesh.renderOrder = 0;
        return { mesh, box, layer: b.layer };
      }),
    [],
  );
  const live = useMemo(() => {
    const mat = revealMaterial(new THREE.Texture());
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(screenBox.w, screenBox.h), mat);
    mesh.position.set(screenBox.cx, screenBox.cy, 0.07);
    mesh.renderOrder = 2; // the live site sits on top of everything
    return { mat, mesh };
  }, []);
  const shots = useMemo(() => {
    const geo = curvedPlane(3.2, 2, 7);
    const loader = new THREE.TextureLoader();
    return screens.map((d) => {
      const mat = screenMaterial(new THREE.Texture(), d.accent);
      let tex: THREE.Texture;
      if (d.video) {
        const v = Object.assign(document.createElement("video"), { src: d.src, muted: true, loop: true, playsInline: true });
        void v.play().catch(() => {});
        tex = new THREE.VideoTexture(v);
      } else {
        tex = loader.load(d.src, (t) => {
          const img = t.image as { width: number; height: number };
          mat.uniforms.uFill.value = Math.min(1, img.width / img.height / 1.6);
        });
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      mat.uniforms.map.value = tex;
      return { mesh: new THREE.Mesh(geo, mat), mat, tex, focus: 0 };
    });
  }, [screens]);

  // Live site texture (needs fonts), the draw-on intro, clicks, and cleanup.
  useEffect(() => {
    let alive = true;
    void drawLiveSite(copy).then((t) => (alive ? (live.mat.uniforms.map.value = t) : t.dispose()));
    // Pick up where the hero drawing (a CSS animation that starts at page load) has got to,
    // so the hand-over from drawing to 3D never redraws from zero.
    intro.current.draw = Math.min(1, Math.max(0, (performance.now() - 150) / 2400));
    const tween = gsap.to(intro.current, { draw: 1, duration: 2.4 * (1 - intro.current.draw), ease: "power2.out" });
    const click = (e: MouseEvent) => {
      const i = s.current.hovered;
      if (i < 0 || (e.target as Element).closest("a, button")) return;
      tick(700, 0.09, 0.05);
      gsap.to(s.current, { zoom: 1, duration: 0.45, ease: "power3.in", onComplete: () => router.push(screens[i].href) });
    };
    addEventListener("click", click);
    return () => {
      alive = false;
      tween.kill();
      removeEventListener("click", click);
      document.documentElement.style.cursor = "";
      wires.forEach((w) => [w.core, w.halo].forEach((x) => (x.wire.geometry.dispose(), x.material.dispose())));
      fills.forEach((f) => (f.mesh.geometry.dispose(), (f.mesh.material as THREE.Material).dispose()));
      live.mat.uniforms.map.value.dispose();
      live.mat.dispose();
      shots.forEach((x) => (x.tex.dispose(), x.mat.dispose()));
      shots[0]?.mesh.geometry.dispose();
    };
  }, [copy, live, wires, fills, shots, screens, router]);

  const els = useMemo(
    () => ({
      top: document.getElementById("top")!,
      process: document.getElementById("process")!,
      work: document.getElementById("work")!,
    }),
    [],
  );
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useFrame((state, dt) => {
    const st = s.current;
    const t = state.clock.elapsedTime;
    const vh = innerHeight;
    const pr = els.process.getBoundingClientRect();
    const story = clamp01(-pr.top / Math.max(1, pr.height - vh));
    const w = (vh - els.work.getBoundingClientRect().top) / vh; // viewports scrolled since #work entered
    const k = Math.min(1, dt * 4);
    st.px += (pointer.x - st.px) * k;
    st.py += (pointer.y - st.py) * k;

    const collapse = smooth(range(story, 0.02, 0.4));
    const design = range(story, 0.3, 0.64);
    const reveal = range(story, 0.66, 0.97);
    const fly = smooth(range(w, 0.05, 1.1));
    const draw = intro.current.draw;

    // Layers: exploded in the hero, collapsed as the site gets built, breathing until then.
    layers.current.forEach((g, i) => {
      g.position.z = i * LAYER_GAP * (1 - collapse) + i * 0.012 + Math.sin(t * 0.9 + i * 1.3) * 0.04 * (1 - collapse);
    });
    const dim = 1 - design * 0.5 - reveal * 0.45;
    wires.forEach(({ core, halo }, i) => {
      const o = i === 0 ? Math.max(dim, 0.7) : dim; // the window frame stays visible as the "device"
      core.material.dashSize = core.total * draw;
      halo.material.dashSize = halo.total * draw;
      core.material.opacity = o;
      halo.material.opacity = 0.18 * o;
      core.material.resolution.set(size.width, size.height);
      halo.material.resolution.set(size.width, size.height);
    });
    // Design blocks snap in, staggered, with a little overshoot.
    fills.forEach(({ mesh, box }, i) => {
      const p = range(design, i * 0.055, i * 0.055 + 0.45);
      const e = backOut(p);
      mesh.position.set(box.cx, box.cy, 0.004 + (1 - e) * 0.8);
      mesh.scale.setScalar(0.65 + 0.35 * e);
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(1, p * 2.5);
    });
    live.mat.uniforms.uReveal.value = reveal;
    live.mat.uniforms.uTime.value = t;

    // Object placement: right of the copy on desktop, above it on phones; flies to centre for the gallery.
    const x = mobile ? 0 : lerp(2.3, 1.6, story);
    const y = mobile ? 1.35 - story * 0.15 : lerp(0.5, 0.05, story);
    const ry = lerp(-0.6, 0, story) + 0.5 * Math.sin(story * Math.PI) + st.px * 0.2 * (1 - story * 0.6);
    const rx = lerp(0.22, 0, story) - st.py * 0.12;
    object.current.position.set(x * (1 - fly), y * (1 - fly), 0);
    object.current.rotation.set(rx * (1 - fly), ry * (1 - fly), 0);
    const base = mobile ? 0.46 : lerp(0.74, 0.92, story); // grows a little as it becomes the focus
    object.current.scale.setScalar(lerp(base, 1, fly) * (1 + 0.025 * Math.sin(t * 0.8) * (1 - story)));

    // Camera flies through the live screen into the gallery.
    cam.current.position.set(0, 0, lerp(8.5, -2.2, fly) - st.zoom * 2.2);
    object.current.visible = cam.current.position.z > 0.2;

    // Gallery: curved screens on an arc around the camera; scroll brings each to the centre.
    const g = range(fly, 0.55, 1);
    gallery.current.visible = g > 0;
    const n = shots.length;
    const f = Math.min(n - 1, Math.max(0, (w - 1.975) / 0.95));
    const v = (f - st.f) / Math.max(dt, 1e-3);
    st.f = f;
    st.vel += (v * 0.35 - st.vel) * 0.12;
    const spread = mobile ? 0.34 : 0.6;
    const R = 5.6;

    // Hover via a manual raycast (the canvas sits under the page, so it gets no pointer events).
    st.hovered = -1;
    if (g > 0.9 && !mobile) {
      ndc.set(pointer.x, pointer.y);
      ray.setFromCamera(ndc, cam.current);
      const hit = ray.intersectObjects(shots.map((x) => x.mesh))[0];
      if (hit) st.hovered = shots.findIndex((x) => x.mesh === hit.object);
    }
    document.documentElement.style.cursor = st.hovered >= 0 ? "pointer" : "";
    document.documentElement.toggleAttribute("data-cursor-open", st.hovered >= 0);

    shots.forEach((x, i) => {
      const a = (i - f) * spread;
      x.mesh.position.set(Math.sin(a) * R, mobile ? 0.7 : 0.1, -Math.cos(a) * R);
      x.mesh.rotation.y = -a;
      x.mesh.scale.setScalar(mobile ? 0.44 : 1);
      const target = Math.max(1 - Math.min(1, Math.abs(i - f)), st.hovered === i ? 1 : 0);
      x.focus += (target - x.focus) * Math.min(1, dt * 6);
      x.mat.uniforms.uFocus.value = x.focus;
      x.mat.uniforms.uVel.value = st.vel;
      x.mat.uniforms.uOpacity.value = g;
      x.mat.uniforms.uScroll.value = 0.5 - 0.5 * Math.cos(t * 0.25 + i); // only visible on tall screenshots
    });
    // Desktop: keep the centred screen up and right of the project title (bottom left).
    gallery.current.position.set(mobile ? 0 : 0.75, mobile ? 0 : 0.3, -2.2);
    gallery.current.scale.setScalar(mobile ? 1 : 0.82);
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={35} position={[0, 0, 8.5]} near={0.05} far={60} />
      <group ref={object}>
        {wires.map(({ core, halo }, i) => (
          <group key={i} ref={(el) => void (el && (layers.current[i] = el))}>
            <primitive object={halo.wire} />
            <primitive object={core.wire} />
            {fills
              .filter((f) => f.layer === i)
              .map((f, j) => (
                <primitive key={j} object={f.mesh} />
              ))}
            {i === 0 ? <primitive object={live.mesh} /> : null}
          </group>
        ))}
      </group>
      <group ref={gallery}>
        {shots.map((x, i) => (
          <primitive key={i} object={x.mesh} />
        ))}
      </group>
    </>
  );
}
