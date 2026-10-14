"use client";

import { useState } from "react";
import { EMAIL, contact } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "fallback" | "error";
const FIELDS = ["name", "company", "email", "building", "types", "budget", "launch", "description"] as const;

/** The project brief. Labels above fields, errors below them, progress you can see. */
export default function ContactForm() {
  const [v, setV] = useState({ name: "", company: "", email: "", building: "", budget: "", launch: "", description: "", website: "" });
  const [types, setTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  const answered = FIELDS.filter((k) => (k === "types" ? types.length : v[k])).length;

  const mailto = () => {
    const body = `${v.description}\n\nName: ${v.name}\nCompany: ${v.company}\nBuilding: ${v.building}\nType: ${types.join(", ")}\nBudget: ${v.budget}\nLaunch: ${v.launch}`;
    return `mailto:${EMAIL}?subject=${encodeURIComponent(`Project brief: ${v.building || v.company || v.name}`)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, types }),
      });
      if (res.ok) return setStatus("sent");
      const data = await res.json().catch(() => ({}));
      if (res.status === 422) return setErrors(data.errors ?? {}), setStatus("idle");
      if (res.status === 503) return setStatus("fallback");
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent")
    return (
      <div className="form-done p-8 ring-1 ring-line" role="status">
        <p className="h3">Thanks, {v.name.split(" ")[0]}.</p>
        <p className="lead muted mt-4 max-w-[36ch]">Your brief is with us. We reply by e-mail to {v.email}.</p>
      </div>
    );

  const input = "field w-full bg-transparent px-0 py-3 outline-none";
  return (
    <form onSubmit={submit} noValidate className="space-y-9">
      <div className="flex items-center gap-4" aria-hidden>
        <div className="flex flex-1 gap-1">
          {FIELDS.map((k, i) => (
            <span key={k} className={`h-[3px] flex-1 transition-colors duration-500 ${i < answered ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
        <span className="meta tabular-nums">
          {answered}/{FIELDS.length}
        </span>
      </div>

      <div className="grid gap-9 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name} required>
          <input id="name" autoComplete="name" value={v.name} onChange={set("name")} className={input} aria-invalid={!!errors.name} aria-describedby="name-err" />
        </Field>
        <Field id="company" label="Company">
          <input id="company" autoComplete="organization" value={v.company} onChange={set("company")} className={input} />
        </Field>
        <Field id="email" label="E-mail" error={errors.email} required>
          <input id="email" type="email" autoComplete="email" value={v.email} onChange={set("email")} className={input} aria-invalid={!!errors.email} aria-describedby="email-err" />
        </Field>
        <Field id="building" label="What are you building?">
          <input id="building" value={v.building} onChange={set("building")} className={input} />
        </Field>
      </div>

      <fieldset>
        <legend className="meta mb-3 !text-paper">Project type</legend>
        <div className="flex flex-wrap gap-2">
          {contact.types.map((t) => {
            const on = types.includes(t);
            return (
              <label key={t} className="chip" data-on={on || undefined}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => setTypes(on ? types.filter((x) => x !== t) : [...types, t])} />
                {t}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-9 sm:grid-cols-[1.4fr_1fr]">
        <fieldset>
          <legend className="meta mb-3 !text-paper">Estimated budget</legend>
          <div className="flex flex-wrap gap-2">
            {contact.budgets.map((b) => (
              <label key={b} className="chip" data-on={v.budget === b || undefined}>
                <input type="radio" name="budget" className="sr-only" checked={v.budget === b} onChange={() => setV({ ...v, budget: b })} />
                {b}
              </label>
            ))}
          </div>
        </fieldset>
        <Field id="launch" label="Desired launch date">
          <input id="launch" type="date" value={v.launch} onChange={set("launch")} className={`${input} [color-scheme:dark]`} />
        </Field>
      </div>

      <Field id="description" label="Project description" error={errors.description} required hint="Goals, audience, what exists today, anything we should know.">
        <textarea
          id="description"
          rows={5}
          value={v.description}
          onChange={set("description")}
          className={`${input} resize-y`}
          aria-invalid={!!errors.description}
          aria-describedby="description-hint description-err"
        />
      </Field>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px]" value={v.website} onChange={(e) => setV({ ...v, website: e.target.value })} name="website" />

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary text-lg disabled:opacity-60">
          {status === "sending" ? "Sending" : "Send the brief"} <span className="arrow">→</span>
        </button>
        {status === "fallback" ? (
          <p className="text-sm" role="alert">
            The form isn&apos;t connected to an inbox yet.{" "}
            <a href={mailto()} className="u-link text-accent-soft">
              Send it from your e-mail app instead
            </a>
            .
          </p>
        ) : status === "error" ? (
          <p className="text-sm" role="alert">
            Something went wrong on our side.{" "}
            <a href={mailto()} className="u-link text-accent-soft">
              E-mail the brief to {EMAIL}
            </a>
            .
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="field-wrap">
      <label htmlFor={id} className="meta !text-paper">
        {label}
        {required ? <span className="text-accent-soft"> *</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="meta mt-2">
          {hint}
        </p>
      ) : null}
      <p id={`${id}-err`} className="mt-2 text-sm text-[#ff8a7a]" aria-live="polite">
        {error}
      </p>
    </div>
  );
}
