"use client";

import { useEffect, useRef, useState } from "react";

const prompts = ["A website for a boutique hotel", "Booking app for a clinic", "3D product configurator", "Automate our invoices"];

type Plan = { read: string; scope: string[]; stack: string; next: string };

/** Scripted, in-browser answers: a concept of the interface, not a live model. */
function plan(q: string): Plan {
  const s = q.toLowerCase();
  if (/3d|configurat|product|shop|store|e-?commerce/.test(s))
    return {
      read: "A product people can turn, configure and buy, with the 3D doing the selling.",
      scope: ["Real-time 3D viewer with materials and options", "Configuration saved to a shareable link", "Checkout connected to your store"],
      stack: "Three.js, React Three Fiber, Next.js, your commerce platform",
      next: "Send us the product models or photos and we will estimate the 3D work.",
    };
  if (/automat|invoice|crm|workflow|process|sync/.test(s))
    return {
      read: "Work that repeats every week, done by a system instead of a person.",
      scope: ["Map the current process step by step", "Connect the tools you already use", "Alerts when something needs a human"],
      stack: "Node.js, your existing tools' APIs, scheduled jobs, Postgres for history",
      next: "A 30-minute call to walk through the process as it runs today.",
    };
  if (/book|clinic|app|appointment|schedul|platform|dashboard/.test(s))
    return {
      read: "An application where customers book and staff manage, on any device.",
      scope: ["Booking flow with availability and reminders", "Staff view for schedules and changes", "Accounts, payments and e-mail notifications"],
      stack: "Next.js, Supabase (auth, Postgres), Resend for e-mail",
      next: "Share how bookings work today and we will sketch the first screens.",
    };
  return {
    read: "A site that shows who you are in seconds and turns visits into enquiries.",
    scope: ["Art-directed design with its own visual identity", "Motion and interaction where it helps the story", "SEO, analytics and a fast, accessible build"],
    stack: "Next.js, TypeScript, GSAP, hosted on Vercel",
    next: "Tell us about the business and what the current site is missing.",
  };
}

export default function AiLab() {
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");
  const [out, setOut] = useState("");
  const [thinking, setThinking] = useState(false);
  const timer = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => () => clearInterval(timer.current), []);
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [out]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    clearInterval(timer.current);
    setAsked(text);
    setQ("");
    setOut("");
    setThinking(true);
    const p = plan(text);
    const full = `${p.read}\n\nScope\n${p.scope.map((x) => `+ ${x}`).join("\n")}\n\nStack\n${p.stack}\n\nNext step\n${p.next}`;
    setTimeout(() => {
      setThinking(false);
      let i = 0;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return setOut(full);
      timer.current = window.setInterval(() => {
        i += 3;
        setOut(full.slice(0, i));
        if (i >= full.length) clearInterval(timer.current);
      }, 16);
    }, 650);
  };

  return (
    <div className="absolute inset-0 flex flex-col p-4 sm:p-6">
      <div ref={box} className="flex-1 space-y-4 overflow-y-auto pr-1 text-[0.95rem]" aria-live="polite">
        {asked ? (
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-paper/10 px-4 py-2.5">{asked}</p>
        ) : (
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="h3 !text-[clamp(1.4rem,2.6vw,2.2rem)]">What are you building?</p>
              <p className="meta mt-3">Concept interface. Answers are scripted in your browser; nothing is sent anywhere.</p>
            </div>
          </div>
        )}
        {thinking ? <p className="ai-thinking meta w-fit">Reading the brief</p> : null}
        {out ? <div className="max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-sm px-4 py-3 ring-1 ring-line">{out}</div> : null}
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {prompts.map((p) => (
          <button key={p} type="button" onClick={() => ask(p)} className="meta shrink-0 rounded-full px-3 py-1.5 !text-paper ring-1 ring-line hover:ring-accent">
            {p}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <label htmlFor="ai-q" className="sr-only">
          Describe your project
        </label>
        <input
          id="ai-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Describe your project"
          className="min-w-0 flex-1 rounded-full bg-ink px-4 py-3 ring-1 ring-line outline-none placeholder:text-grey focus:ring-accent"
        />
        <button type="submit" className="btn btn-primary !px-5 !py-3">
          Ask
        </button>
      </form>
    </div>
  );
}
