"use client";

import { useEffect, useState } from "react";

/** Live readout of the visitor's own viewport, like a dimension label on a spec sheet. */
export default function ViewportSize() {
  const [size, setSize] = useState("");
  useEffect(() => {
    const update = () => setSize(`${innerWidth} × ${innerHeight}`);
    update();
    addEventListener("resize", update, { passive: true });
    return () => removeEventListener("resize", update);
  }, []);
  return <span aria-hidden>{size || " "}</span>;
}
