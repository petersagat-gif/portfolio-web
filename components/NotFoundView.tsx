import Link from "next/link";

// Shared 404 content: bilingual, because a missing page can't tell which language you came from.
export default function NotFoundView() {
  return (
    <main id="main" className="wrap relative z-10 grid min-h-svh place-items-center py-24 text-center">
      <div>
        <img src="/art/404.svg" alt="" className="mx-auto w-[min(88vw,560px)]" />
        <h1 className="display mt-4 text-[clamp(3.5rem,12vw,9rem)]">
          404<span className="text-cobalt">.</span>
        </h1>
        <p className="lead mx-auto mt-5 max-w-[34ch]">
          This page came apart before it was built.
          <span lang="sk" className="mt-1 block text-paper/60">
            Táto stránka sa rozpadla skôr, než vznikla.
          </span>
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to the homepage <span aria-hidden>→</span>
          </Link>
          <Link href="/sk" lang="sk" className="btn btn-ghost">
            Späť na úvod
          </Link>
        </div>
      </div>
    </main>
  );
}
