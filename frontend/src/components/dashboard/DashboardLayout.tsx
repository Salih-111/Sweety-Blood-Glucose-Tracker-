import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  ChartColumn,
  LogOut,
} from "lucide-react";

import ThemeToggle from "../ThemeToggle";
import useAuth from "../../context/useAuth";

type DashboardLayoutProps = {
  children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigation = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "#overview",
    },
    {
      label: "Readings",
      icon: ClipboardList,
      href: "#readings",
    },
    {
      label: "Reports",
      icon: ChartColumn,
      href: "#reports",
    },
  ];

  return (
    <div className="min-h-screen bg-(--app-bg) lg:flex">

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-(--app-border) bg-(--surface) px-5 py-7 lg:flex">

        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Activity size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-(--text-primary)">
              GlucoTrack
            </h1>

            <p className="text-xs text-(--text-secondary)">
              Your health companion
            </p>
          </div>
        </div>

        {/* Navigation */}
        <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-(--text-secondary)">
          WORKSPACE
        </p>

        <nav className="space-y-2" aria-label="Dashboard navigation">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  index === 0
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                    : "text-(--text-secondary) hover:bg-(--app-bg) hover:text-(--text-primary)"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto rounded-2xl bg-brand-50 p-4 dark:bg-brand-900/20">
          <Activity className="mb-2 text-brand-600 dark:text-brand-400" size={22} />

          <p className="text-sm font-semibold text-(--text-primary)">
            Stay informed
          </p>

          <p className="mt-1 text-xs leading-5 text-(--text-secondary)">
            Track your readings and understand your glucose trends.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-(--app-border) bg-(--surface) px-5 py-4 sm:px-8">

          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Activity size={23} />
            </div>

            <span className="text-lg font-bold text-(--text-primary)">
              GlucoTrack
            </span>
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-(--text-primary)">
              Health Dashboard
            </p>

            <p className="text-xs text-(--text-secondary)">
              Monitor your glucose health
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-5">

            <ThemeToggle />

            <div className="hidden items-center gap-3 border-l border-(--app-border) pl-5 sm:flex">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-semibold text-(--text-primary)">
                  {user?.name}
                </p>

                <p className="text-xs text-(--text-secondary)">
                  Personal Account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
              className="flex items-center gap-2 rounded-lg border border-(--app-border) px-3 py-2 text-sm font-medium text-(--text-secondary) transition hover:bg-(--app-bg) hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={17} />
              <span className="hidden sm:inline">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </header>

        {/* Mobile navigation */}
        <nav
          className="flex gap-2 overflow-x-auto border-b border-(--app-border) bg-(--surface) px-5 py-3 lg:hidden"
          aria-label="Mobile dashboard navigation"
        >
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                  index === 0
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                    : "text-(--text-secondary) hover:bg-(--app-bg)"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Page content */}
        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
            >
              {error}
            </p>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;