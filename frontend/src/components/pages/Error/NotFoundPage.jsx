import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white-400 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-neutral-900">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mt-4">
          Page not found
        </h2>
        <p className="text-neutral-600 mt-2 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors inline-block"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
