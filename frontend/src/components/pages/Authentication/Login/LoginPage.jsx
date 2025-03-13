import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.error || "Email ou mot de passe incorrect");
      console.error("Erreur de connexion:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-300">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-800">WhispR</h1>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-center text-xl font-semibold text-neutral-900 mb-2">
            Welcome back !
          </h2>
          <p className="text-center text-neutral-600">
            Connect to your account
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-900 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-primary-900 text-sm hover:underline"
            >
              Forget password ?
            </Link>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-neutral-500 text-sm">
            Don't have an account ?{" "}
          </span>
          <Link
            to="/register"
            className="text-primary-900 text-sm hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
