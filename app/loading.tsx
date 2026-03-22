export default function Loading() {
  return (
    <div className="px-4 pb-24 pt-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="command-surface command-outline animate-pulse rounded-[2rem] p-6 sm:p-7">
          <div className="h-4 w-44 rounded-full bg-white/8" />
          <div className="mt-5 h-12 w-full max-w-3xl rounded-2xl bg-white/8" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-full bg-white/6" />
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 rounded-[1.5rem] bg-white/6" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="command-surface command-outline animate-pulse rounded-[2rem] p-6"
            >
              <div className="h-4 w-40 rounded-full bg-white/8" />
              <div className="mt-5 h-10 w-3/4 rounded-2xl bg-white/8" />
              <div className="mt-4 h-5 w-full rounded-full bg-white/6" />
              <div className="mt-6 grid gap-4">
                {Array.from({ length: 3 }).map((_, nestedIndex) => (
                  <div key={nestedIndex} className="h-24 rounded-[1.5rem] bg-white/6" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
