"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onFirstInteraction } from "@/lib/idle";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/** Is there a real GPU? Software-rendered WebGL ("major performance caveat") gets the static hero. */
export function hasGpu() {
  const c = document.createElement("canvas");
  const gl =
    c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
    c.getContext("webgl", { failIfMajorPerformanceCaveat: true });
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return !!gl;
}

/** Boots the WebGL scene after the page is usable: first interaction, or 1.2 s after load + idle. */
export default function GL() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("has-3d")) return;
    return onFirstInteraction(() => {
      if (hasGpu()) setOn(true);
      else root.classList.remove("has-3d");
    }, 1200);
  }, []);
  return on ? <Scene /> : null;
}
