import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-slate-950">
      <h1 className="text-7xl sm:text-9xl font-extrabold text-blue-600 leading-none mb-4">
        404
      </h1>
      <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Page Not Found
      </h2>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-sm sm:max-w-md">
        Looks like you wandered off the court! The page you&apos;re looking for
        doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition text-sm sm:text-base"
      >
        Back to Home
      </Link>
    </div>
  );
}
