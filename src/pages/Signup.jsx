import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, {
        fullName,
        phone,
      });

      toast.success("Account created. You can sign in now.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 uppercase">Sign Up</h1>
        <p className="text-gray-600 mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-200 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 disabled:opacity-70 uppercase"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}