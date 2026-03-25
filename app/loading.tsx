export default function Loading() {
  return (
    <div className="px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="animate-pulse border-b border-white/8 pb-10">
          <div className="h-3 w-40 rounded-full bg-white/8" />
          <div className="mt-6 h-14 w-full max-w-4xl rounded-[1.6rem] bg-white/8" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-white/6" />
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="surface-cut h-24 border border-white/6 bg-white/[0.03]" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="premium-surface premium-outline surface-cut animate-pulse overflow-hidden"
            >
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
                <div className="order-2 p-6 sm:p-7 lg:order-1 lg:p-8">
                  <div className="h-3 w-36 rounded-full bg-white/8" />
                  <div className="mt-5 h-10 w-2/3 rounded-2xl bg-white/8" />
                  <div className="mt-4 h-5 w-full rounded-full bg-white/6" />
                  <div className="mt-3 h-5 w-5/6 rounded-full bg-white/6" />
                  <div className="mt-6 flex gap-2">
                    {Array.from({ length: 4 }).map((_, nestedIndex) => (
                      <div key={nestedIndex} className="h-8 w-20 rounded-full bg-white/6" />
                    ))}
                  </div>
                </div>
                <div className="order-1 min-h-[16rem] border-b border-white/8 bg-white/[0.03] lg:order-2 lg:border-b-0 lg:border-l" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-t border-white/6 pt-6">
                <div className="h-3 w-28 rounded-full bg-white/8" />
                <div className="mt-4 h-5 w-full max-w-3xl rounded-full bg-white/6" />
                <div className="mt-3 h-5 w-5/6 rounded-full bg-white/6" />
                <div className="mt-3 h-5 w-2/3 rounded-full bg-white/6" />
              </div>
            ))}
          </div>

          <div className="premium-surface premium-outline surface-cut animate-pulse p-6">
            <div className="h-3 w-24 rounded-full bg-white/8" />
            <div className="mt-5 flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-8 w-20 rounded-full bg-white/6" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
