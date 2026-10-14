"use client";

import { useState } from "react";

export default function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost gap-3"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setDone(true);
          setTimeout(() => setDone(false), 2200);
        } catch {
          location.href = `mailto:${email}`; // clipboard blocked: fall back to the mail app
        }
      }}
    >
      <span>{email}</span>
      <span className="label !text-link" aria-live="polite">
        {done ? copied : copy}
      </span>
    </button>
  );
}
