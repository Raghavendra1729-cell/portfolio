export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>

      {/* Grid Skeleton (Projects/Skills) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>

      {/* List Skeleton (Experience) */}
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}