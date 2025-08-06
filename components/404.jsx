import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-pulse">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <button className="relative inline-block px-8 py-3 text-lg font-medium text-white group">
            <span className="absolute inset-0 transition-transform bg-blue-500 group-hover:scale-110 group-hover:bg-blue-600 rounded-md"></span>
            <span className="relative">Go Back Home</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
