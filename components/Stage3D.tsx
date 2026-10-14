"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onFirstInteraction } from "@/lib/idle";
import type { LiveCopy } from "./three/materials";
import type { ScreenData } from "./three/World";

// three.js only loads in the browser, and only once the page itself is ready.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/** Is there a real GPU? Software-rendered WebGL ("major performance caveat") gets the static version. */
function hasGpu() {
  const c = document.createElement("canvas");
  const gl =
    c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
    c.getContext("webgl", { failIfMajorPerformanceCaveat: true });
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return !!gl;
}

export default function Stage3D(props: { screens: ScreenData[]; copy: LiveCopy }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("has-3d")) return;
    // Lazy-load: text and layout are on screen first; three.js boots on the first interaction or
    // 2.5 s after the page goes idle. Without a real GPU, swap to the static drawings instead (they
    // sit below the fold or out of flow, so the swap does not shift what is visible).
    return onFirstInteraction(() => {
      if (hasGpu()) setOn(true);
      else root.classList.remove("has-3d");
    });
  }, []);

  return on ? <Scene {...props} /> : null;
}
