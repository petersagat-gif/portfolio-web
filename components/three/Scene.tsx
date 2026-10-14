"use client";

import { View } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import Sculpture from "./Sculpture";
import { pointer } from "./util";

const track = (sel: string) => ({ current: document.querySelector<HTMLElement>(sel)! });

/**
 * One fixed, transparent canvas under the page. Each 3D moment is a drei <View> that renders only
 * inside its DOM slot, so the whole page shares a single WebGL context.
 */
export default function Scene() {
  const mobile = useMemo(() => matchMedia("(max-width: 767px)").matches, []);
  const hero = useMemo(() => track("[data-hero-gl]"), []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / innerHeight) * 2 + 1;
    };
    addEventListener("pointermove", move, { passive: true });
    // Step 3 of the hero entrance: the background fades in once the first frame exists.
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.setAttribute("data-gl-ready", "")));
    return () => removeEventListener("pointermove", move);
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <PauseOffscreen el={hero.current} />
      <View track={hero}>
        <Sculpture mobile={mobile} />
      </View>
    </Canvas>
  );
}

/** Stop the render loop while the hero is off screen. */
function PauseOffscreen({ el }: { el: HTMLElement }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setFrameloop(e.isIntersecting ? "always" : "never"), {
      rootMargin: "10% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [el, setFrameloop]);
  return null;
}
