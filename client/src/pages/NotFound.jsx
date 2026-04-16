import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-6 text-center">
    <h1 className="text-3xl font-bold">Link Not Found</h1>
    <p className="mt-3 text-slate-500">This link doesn't exist or has expired.</p>
    <Link to="/" className="mt-6 rounded bg-indigo-600 px-5 py-2 text-white">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
