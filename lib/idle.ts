/** Run `fn` when the browser is idle (Safari has no requestIdleCallback: fall back to a short timeout). */
export function whenIdle(fn: () => void, timeout = 1500) {
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(fn, { timeout });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

const interactions = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;

/**
 * Run `fn` once, on the visitor's first interaction, or `fallbackMs` after the page has loaded and
 * gone idle, whichever comes first. Keeps scroll/animation libraries and the 3D off the load path.
 */
export function onFirstInteraction(fn: () => void, fallbackMs = 2500) {
  let timer = 0;
  let cancelIdle = () => {};
  const run = () => {
    cancel();
    fn();
  };
  const afterLoad = () => (cancelIdle = whenIdle(() => (timer = window.setTimeout(run, fallbackMs))));
  const cancel = () => {
    interactions.forEach((e) => removeEventListener(e, run));
    removeEventListener("load", afterLoad);
    clearTimeout(timer);
    cancelIdle();
  };
  interactions.forEach((e) => addEventListener(e, run, { once: true, passive: true }));
  if (document.readyState === "complete") afterLoad();
  else addEventListener("load", afterLoad, { once: true });
  return cancel;
}
