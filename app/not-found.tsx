import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-6xl font-bold text-gray-200 mb-4">404</h2>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
}