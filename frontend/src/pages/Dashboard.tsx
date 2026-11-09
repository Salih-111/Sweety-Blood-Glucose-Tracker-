import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LogOut } from "lucide-react";

import useAuth from "../context/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Unable to log out. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-(--app-bg) p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--surface) p-5">
          <div className="flex items-center gap-3">
            <Activity className="text-brand-600" size={28} />

            <h1 className="text-xl font-bold text-(--text-primary)">
              GlucoTrack
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-(--app-border) px-4 py-2 text-sm font-medium text-(--text-primary) transition hover:bg-(--app-bg)"
          >
            <LogOut size={17} />
            Logout
          </button>
        </header>

        <section className="mt-10">
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
            YOUR DASHBOARD
          </p>

          <h2 className="mt-2 text-3xl font-bold text-(--text-primary)">
            Welcome, {user?.name}!
          </h2>

          <p className="mt-2 text-(--text-secondary)">
            You're successfully logged in to GlucoTrack.
          </p>
        </section>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}

        <section className="mt-8 rounded-2xl border border-(--app-border) bg-(--surface) p-8">
          <h3 className="text-lg font-semibold text-(--text-primary)">
            Your glucose dashboard
          </h3>

          <p className="mt-2 text-sm text-(--text-secondary)">
            Your glucose overview, readings and reports will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;