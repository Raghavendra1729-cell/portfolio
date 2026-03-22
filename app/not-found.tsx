import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <div className="px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="command-surface command-outline rounded-[2rem] p-8 text-center sm:p-10">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[1.6rem] border border-fuchsia-400/16 bg-fuchsia-400/10 text-fuchsia-100">
            <Radar className="h-7 w-7" />
          </div>
          <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.32em] text-slate-500">
            Route unavailable
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
            The requested page or project dossier could not be found.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-300">
            The route may have moved, been removed, or the underlying record does not exist in the current dataset.
          </p>

          <MagneticButton
            asChild
            wrapperClassName="mt-8"
            className="border-cyan-300/18 bg-cyan-300 px-6 py-3.5 text-slate-950"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Return to home
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
