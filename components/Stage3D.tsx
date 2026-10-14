"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { LiveCopy } from "./three/materials";
import type { ScreenData } from "./three/World";

// three.js only loads in the browser, and only when the pre-paint check enabled 3D.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export default function Stage3D(props: { screens: ScreenData[]; copy: LiveCopy }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(document.documentElement.classList.contains("has-3d")), []);
  return on ? <Scene {...props} /> : null;
}
