"use client";

import { View } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import Constellation from "./Constellation";
import Finale from "./Finale";
import type { LiveCopy } from "./materials";
import { pointer } from "./util";
import World, { type ScreenData } from "./World";

const track = (sel: string) => ({ current: document.querySelector<HTMLElement>(sel)! });

/**
 * One fixed, transparent canvas under the page. Each 3D moment is a drei <View> that renders
 * only inside its DOM slot's rectangle, so there is a single WebGL context for the whole page.
 */
export default function Scene({ screens, copy }: { screens: ScreenData[]; copy: LiveCopy }) {
  const mobile = useMemo(() => matchMedia("(max-width: 767px)").matches, []);
  const slots = useMemo(() => ({ world: track("[data-world]"), toolkit: track("[data-toolkit]"), finale: track("[data-finale]") }), []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / innerHeight) * 2 + 1;
    };
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.setAttribute("data-3d-ready", "");
    return () => removeEventListener("pointermove", move);
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
      aria-hidden
    >
      <PauseOffscreen els={Object.values(slots).map((s) => s.current)} />
      <View track={slots.world}>
        <World screens={screens} copy={copy} mobile={mobile} />
      </View>
      <View track={slots.toolkit}>
        <Constellation mobile={mobile} />
      </View>
      <View track={slots.finale}>
        <Finale mobile={mobile} />
      </View>
    </Canvas>
  );
}

/** Stop the render loop entirely while no 3D slot is near the viewport. */
function PauseOffscreen({ els }: { els: HTMLElement[] }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setFrameloop(visible.size ? "always" : "never");
      },
      { rootMargin: "20% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [els, setFrameloop]);
  return null;
}
