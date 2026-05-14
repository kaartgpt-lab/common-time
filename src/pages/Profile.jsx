import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true, state: { from: "/profile" } });
      return;
    }
    if (!user) return;

    async function fetchProfile() {
      const { data: { user: freshUser }, error } = await supabase.auth.getUser();
      if (error || !freshUser) {
        setProfile(null);
      } else {
        setProfile(freshUser);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen py-24 flex justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full" />
      </main>
    );
  }

  if (!user || !profile) return null;

  const fullName = profile.user_metadata?.full_name || "N/A";
  const email = profile.email || "N/A";
  const phone = profile.user_metadata?.phone || "N/A";
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen py-20 md:py-28 px-4 max-w-2xl mx-auto ">
      <h1 className="text-2xl font-medium mb-10 uppercase font-[Bai_Jamjuree] ">My Profile</h1>

      <div className="space-y-6  font-[Garet_Book]">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <p className="text-gray-900">{fullName}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-900">{email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <p className="text-gray-900">{phone}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Member Since
          </label>
          <p className="text-gray-900">{memberSince}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition uppercase font-[Bai_Jamjuree] "
        >
          Logout
        </button>
      </div>
    </main>
  );
}