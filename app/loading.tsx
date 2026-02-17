export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Simple CSS Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <p className="text-sm text-gray-500 animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}