import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // All images on this site are SVG artwork, which next/image does not optimise anyway.
    rules: { "@next/next/no-img-element": "off" },
  },
  {
    // React Three Fiber scenes mutate three.js objects every frame inside useFrame by design;
    // the React Compiler immutability rule doesn't model imperative scene graphs.
    files: ["components/three/**"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
