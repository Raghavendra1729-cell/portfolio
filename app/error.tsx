"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
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
      <div className="mx-auto max-w-4xl border-y border-white/6 py-16 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
          Runtime interruption
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.07em] text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[0.96]">
          Something broke while loading this route.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
          The page did not finish rendering successfully. Retry the request to restore the view.
        </p>

        <MagneticButton
          onClick={() => reset()}
          wrapperClassName="mt-8"
          className="border-white/10 bg-white px-6 py-3.5 text-slate-950"
        >
          <RefreshCw className="h-4 w-4" />
          Retry render
        </MagneticButton>
      </div>
    </div>
  );
}
