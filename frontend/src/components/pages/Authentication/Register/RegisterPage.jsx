import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/contexts/AuthContext.jsx";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during registration");
      }
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-400">
      <div className="w-full max-w-md p-8 bg-white-100 rounded-lg shadow-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-neutral-900">WhispR</h1>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-center text-xl font-semibold text-neutral-900 mb-2">
            Create Account
          </h2>
          <p className="text-center text-neutral-600">Sign up to get started</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-900 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

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

          <div className="mb-4">
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
            <p className="text-xs text-neutral-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-neutral-500 text-sm">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="text-primary-900 text-sm hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
