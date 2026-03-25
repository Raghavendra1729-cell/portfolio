import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { ArrowLeft, Database, ShieldAlert } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { verifyAdminSessionToken } from "@/lib/auth";
import { createPageMetadata } from "@/lib/metadata";
import { runPortfolioSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Seed",
  description: "Populate the portfolio database with sample content for local review.",
  path: "/seed",
});

async function canRunSeedPage() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const isDevelopment = process.env.NODE_ENV !== "production";
  const isAdmin = Boolean(verifyAdminSessionToken(cookieStore.get("admin_session")?.value));

  return isDevelopment || isLocalhost || isAdmin;
}

export default async function SeedPage() {
  const allowed = await canRunSeedPage();

  if (!allowed) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl border-y border-white/6 py-16 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Seed access blocked
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[0.96]">
            Seeding is only allowed locally or from an authenticated admin session.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            This route mutates database content, so it stays unavailable for anonymous public traffic.
          </p>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
            <ShieldAlert className="h-4 w-4" />
            Sign in via the admin panel or run the app locally to use this route.
          </div>
        </section>
      </PageShell>
    );
  }

  const result = await runPortfolioSeed();

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl">
        <div className="border-b border-white/6 pb-10">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
            <span>Seed</span>
            <span className="h-px w-10 bg-white/10" />
            <span>Database bootstrap</span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.08em] text-white sm:text-5xl lg:text-[4.4rem] lg:leading-[0.95]">
            Sample portfolio content has been processed.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            This route seeds singleton settings and sample collection records only when the target collection is empty. Re-opening this page will not duplicate records.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Created collections
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">{result.totals.createdCollections}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Inserted documents
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">{result.totals.insertedDocuments}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Skipped collections
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">{result.totals.skippedCollections}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02]">
          <div className="divide-y divide-white/6">
            {result.steps.map((step) => (
              <div
                key={step.collection}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {step.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {step.action === "created" ? "Inserted seed data" : "Skipped"}
                  </p>
                  {step.reason ? (
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{step.reason}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {step.inserted}
                  </span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                    {step.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 transition hover:text-white">
            Open admin
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
