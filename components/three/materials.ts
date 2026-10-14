import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";

/** Fat line segments with a dash trick for "drawing on": dashSize = how much is drawn so far. */
export function makeWire(positions: number[], color: string, width: number, opacity = 1, additive = false) {
  const geometry = new LineSegmentsGeometry().setPositions(positions);
  const material = new LineMaterial({
    color: new THREE.Color(color),
    linewidth: width,
    transparent: true,
    opacity,
    dashed: true,
    dashSize: 0,
    gapSize: 1e6,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  const wire = new LineSegments2(geometry, material);
  wire.computeLineDistances();
  let total = 0;
  for (let i = 0; i < positions.length; i += 6)
    total += Math.hypot(positions[i + 3] - positions[i], positions[i + 4] - positions[i + 1], positions[i + 5] - positions[i + 2]);
  return { wire, material, total };
}

const header = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

/** Stage 3: the live site wipes in from the top behind a cobalt scan line. */
export function revealMaterial(map: THREE.Texture) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { map: { value: map }, uReveal: { value: 0 }, uTime: { value: 0 } },
    vertexShader: header,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float uReveal; uniform float uTime;
      varying vec2 vUv;
      void main() {
        float edge = 1.0 - uReveal * 1.08;           // sweeps from top (y=1) to bottom
        float d = vUv.y - edge;
        float band = smoothstep(0.05, 0.0, abs(d))     // glow around the scan line,
          * smoothstep(0.0, 0.04, uReveal) * (1.0 - smoothstep(0.96, 1.0, uReveal)); // only while sweeping
        float jitter = band * 0.012 * sin(uTime * 60.0 + vUv.y * 300.0);
        vec2 uv = vUv + vec2(jitter, 0.0);
        vec3 col = vec3(texture2D(map, uv + vec2(band * 0.008, 0.0)).r, texture2D(map, uv).g, texture2D(map, uv - vec2(band * 0.008, 0.0)).b);
        col += vec3(0.24, 0.36, 1.0) * band * 1.4;
        float alpha = clamp(step(edge, vUv.y) + band, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
        #include <colorspace_fragment>
      }
    `,
  });
}

/** Gallery screens: rounded corners, accent edge glow, motion-driven RGB split, optional scroll for tall screenshots. */
export function screenMaterial(map: THREE.Texture, accent: string) {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: map },
      uAccent: { value: new THREE.Color(accent) },
      uFocus: { value: 0 }, // 0 = background screen, 1 = centred/hovered
      uVel: { value: 0 },
      uFill: { value: 1 }, // visible fraction of the image height (<1 for tall screenshots)
      uScroll: { value: 0 },
      uOpacity: { value: 1 },
    },
    vertexShader: header,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform vec3 uAccent;
      uniform float uFocus, uVel, uFill, uScroll, uOpacity;
      varying vec2 vUv;
      float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
      void main() {
        vec2 uv = vec2(vUv.x, 1.0 - (1.0 - vUv.y) * uFill - uScroll * (1.0 - uFill));
        float s = clamp(uVel, -1.0, 1.0) * 0.012;
        vec3 col = vec3(texture2D(map, uv + vec2(s, 0.0)).r, texture2D(map, uv).g, texture2D(map, uv - vec2(s, 0.0)).b);
        col *= mix(0.42, 1.0, uFocus);
        float d = box(vUv - 0.5, vec2(0.5, 0.5), 0.03);
        col += uAccent * smoothstep(0.012, 0.0, abs(d)) * (0.35 + 0.9 * uFocus);
        float alpha = smoothstep(0.002, -0.002, d) * uOpacity;
        gl_FragColor = vec4(col, alpha);
        #include <colorspace_fragment>
      }
    `,
  });
}

/** Bend a plane into a shallow cylinder so screens curve towards the viewer. */
export function curvedPlane(w: number, h: number, radius: number) {
  const g = new THREE.PlaneGeometry(w, h, 40, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i) / radius;
    p.setXYZ(i, Math.sin(a) * radius, p.getY(i), (1 - Math.cos(a)) * radius);
  }
  g.computeBoundingSphere();
  return g;
}

export type LiveCopy = { first: string; last: string; pitch: string; role: string; cta: string; nav: string };

/** Draws this site's own hero onto a canvas with the real (already loaded) fonts. */
export async function drawLiveSite(copy: LiveCopy) {
  const W = 1024, H = 614;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const display = css.getPropertyValue("--font-anybody").trim() || "sans-serif";
  const sans = css.getPropertyValue("--font-schibsted").trim() || "sans-serif";
  const mono = css.getPropertyValue("--font-martian").trim() || "monospace";
  await Promise.all([
    document.fonts.load(`900 100px ${display}`),
    document.fonts.load(`100 100px ${display}`),
    document.fonts.load(`500 16px ${sans}`),
    document.fonts.load(`400 11px ${mono}`),
  ]).catch(() => {});

  x.fillStyle = "#0b0d12";
  x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(139,143,154,.14)";
  for (let i = 0; i <= 12; i++) {
    const gx = 40 + (i * (W - 80)) / 12;
    x.beginPath();
    x.moveTo(gx, 0);
    x.lineTo(gx, H);
    x.stroke();
  }
  (x as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "extra-expanded";

  // nav
  x.fillStyle = "#ece9e2";
  x.font = `900 26px ${display}`;
  x.fillText("PŠ", 40, 56);
  x.fillStyle = "#3d5bff";
  x.fillRect(40 + x.measureText("PŠ").width + 2, 50, 6, 6);
  x.beginPath();
  x.roundRect(W - 168, 30, 128, 38, 19);
  x.fill();
  x.fillStyle = "#fff";
  x.font = `600 15px ${sans}`;
  x.textAlign = "center";
  x.fillText(copy.nav, W - 104, 54);
  x.textAlign = "left";

  // name: hairline "first", solid "last"
  x.fillStyle = "#8b8f9a";
  x.font = `400 11px ${mono}`;
  x.fillText(copy.role.toUpperCase(), 40, 250);
  x.font = `100 112px ${display}`;
  x.strokeStyle = "#ece9e2";
  x.lineWidth = 1.4;
  x.strokeText(copy.first.toUpperCase(), 36, 368);
  x.font = `900 112px ${display}`;
  x.fillStyle = "#ece9e2";
  const last = copy.last.toUpperCase();
  x.fillText(last, 36, 470);
  x.fillStyle = "#3d5bff";
  x.fillRect(36 + x.measureText(last).width + 8, 448, 22, 22);

  // pitch + CTA
  x.fillStyle = "#ece9e2";
  x.font = `400 17px ${sans}`;
  const words = copy.pitch.split(" ");
  let lineText = "", ly = 530;
  for (const w of words) {
    if (x.measureText(lineText + w).width > 380) {
      x.fillText(lineText, 40, ly);
      lineText = "";
      ly += 25;
    }
    lineText += w + " ";
  }
  x.fillText(lineText, 40, ly);
  x.fillStyle = "#3d5bff";
  x.beginPath();
  x.roundRect(W - 304, 516, 264, 52, 26);
  x.fill();
  x.fillStyle = "#fff";
  x.font = `600 16px ${sans}`;
  x.textAlign = "center";
  x.fillText(`${copy.cta} →`, W - 172, 548);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
