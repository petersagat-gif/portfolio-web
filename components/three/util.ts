/** Pointer in normalised device coords (-1..1), written by Scene from window events. */
export const pointer = { x: 0, y: 0 };

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0..1 progress of `v` between `a` and `b`. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const backOut = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
