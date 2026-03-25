import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl border-y border-white/6 py-16 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
          404 / Route unavailable
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[0.96]">
          The requested page or case study is not available in the current portfolio structure.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
          The route may have moved, the record may no longer exist, or the URL may be incomplete.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton
            asChild
            className="border-white/10 bg-white px-6 py-3.5 text-slate-950"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return home
            </Link>
          </MagneticButton>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-1 py-3 text-sm text-slate-400 transition hover:text-white"
          >
            Browse projects
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
