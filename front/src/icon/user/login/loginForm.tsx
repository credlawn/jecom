"use client";

import { loginUser } from "@/auth/login";
import { useRefreshSession } from "@/auth/session";
import { setSession } from "@/auth/setSession";
import { useState } from "react";

const LoginForm = ({ onLoginSuccess, onSignupClick }: { onLoginSuccess?: () => void, onSignupClick?: () => void }) => {
  const refreshSession = useRefreshSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await loginUser({ email, password });
    if (result.success) {
      if (result.sid) {
        await setSession(result.sid);
      }
      setSuccess("Login successful!");
      setEmail("");
      setPassword("");
      await refreshSession();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError(result.error ?? "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      {success && (
        <div className="mb-4 text-green-600 text-sm text-center font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Don&apos;t have an account?{' '}
        <button onClick={onSignupClick} className="text-blue-500 hover:underline cursor-pointer">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
