import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@components/services/authService.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
      console.error("Erreur de connexion:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-300">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-neutral-900">WhispR</h1>
          </div>
        </div>

        <div className="relative mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-sm"></div>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-900 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="flex justify-end mb-6">
            <a
              href="/forgot-password"
              className="text-primary-900 text-sm hover:underline"
            >
              Forgot Password ?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            Log in
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-neutral-500 text-sm">
            Don't have an account ?{" "}
          </span>
          <a
            href="/register"
            className="text-primary-900 text-sm hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
