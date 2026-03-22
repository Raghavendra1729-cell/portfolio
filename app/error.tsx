"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="command-surface command-outline rounded-[2rem] p-8 text-center sm:p-10">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[1.6rem] border border-amber-400/16 bg-amber-400/10 text-amber-100">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.32em] text-slate-500">
            Runtime interruption
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
            Something broke while loading this surface.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-300">
            The route did not finish rendering successfully. Retry the request to restore the view.
          </p>

          <MagneticButton
            onClick={() => reset()}
            wrapperClassName="mt-8"
            className="border-cyan-300/18 bg-cyan-300 px-6 py-3.5 text-slate-950"
          >
            <RefreshCw className="h-4 w-4" />
            Retry render
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
