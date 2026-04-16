import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-lg font-bold text-indigo-600">
          SnapLink
        </Link>
        <div className="flex items-center gap-4">
          <button
            className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-700"
            onClick={toggleDarkMode}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
          {token ? (
            <>
              <Link to="/dashboard" className="text-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">
                Login
              </Link>
              <Link to="/register" className="text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
