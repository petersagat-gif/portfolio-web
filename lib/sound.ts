// UI sounds synthesised with WebAudio: no audio files to download. Off by default.
let ctx: AudioContext | null = null;
let on = false;

export const isSoundOn = () => on;

export function setSound(value: boolean) {
  on = value;
  if (on) {
    ctx ??= new AudioContext();
    void ctx.resume();
  }
}

/** A short soft click. `pitch` in Hz. */
export function tick(pitch = 1400, length = 0.035, volume = 0.035) {
  if (!on || !ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(pitch, t);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + length);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + length);
}
