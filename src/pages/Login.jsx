import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const { signIn, signInAsGuest } = useAuth();
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

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      await signInAsGuest();
      navigate(from === "/" ? "/checkout" : from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Guest checkout is unavailable right now");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4 font-[Inter]">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-light mb-2 font-[Inter] tracking-tight">Login</h1>
        <p className="text-gray-500 mb-8 text-sm">sign in to your account</p>

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
            disabled={loading || guestLoading}
            className="w-full bg-black text-white py-3 rounded-sm font-[Inter] text-xs tracking-[0.2em] hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">or</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGuest}
          disabled={loading || guestLoading}
          className="w-full border border-black py-3 rounded-sm font-[Inter] text-xs tracking-[0.2em] hover:bg-black hover:text-white transition-colors disabled:opacity-70"
        >
          {guestLoading ? "Please wait..." : "Continue as Guest"}
        </button>
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Check out without an account. You can create one later to track orders.
        </p>

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
