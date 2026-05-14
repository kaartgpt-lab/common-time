import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 uppercase">Login</h1>
        <p className="text-gray-600 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 disabled:opacity-70 uppercase"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline hover:no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
