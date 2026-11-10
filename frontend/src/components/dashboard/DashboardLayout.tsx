import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  Activity,
  LayoutDashboard,
  ClipboardList,
  ChartColumn,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import ThemeToggle from "../ThemeToggle"
import useAuth from "../../context/useAuth"

type DashboardLayoutProps = {
  children: ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("#overview")

  const handleLogout = async () => {
    setError("")
    setIsLoggingOut(true)

    try {
      await logout()
      navigate("/login", { replace: true })
    } catch {
      setError("Unable to log out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

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
  ]

  const handleNavigation = (href: string) => {
    setActiveSection(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-(--app-bg) lg:flex">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-(--app-border) bg-(--surface) px-5 py-7 lg:flex">
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

        {/* Desktop Navigation */}
        <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-(--text-secondary)">
          WORKSPACE
        </p>

        <nav className="space-y-2" aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.href

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                aria-current={isActive ? "location" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                    : "text-(--text-secondary) hover:bg-(--app-bg) hover:text-(--text-primary)"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto rounded-2xl bg-brand-50 p-4 dark:bg-brand-900/20">
          <Activity
            className="mb-2 text-brand-600 dark:text-brand-400"
            size={22}
          />

          <p className="text-sm font-semibold text-(--text-primary)">
            Stay informed
          </p>

          <p className="mt-1 text-xs leading-5 text-(--text-secondary)">
            Track your readings and understand your glucose trends.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40">
          <header className="flex items-center justify-between border-b border-(--app-border) bg-(--surface) px-3 py-3 sm:px-8 sm:py-4">
            {/* Brand */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Activity size={21} />
              </div>

              <span className="text-base font-bold text-(--text-primary) sm:text-lg">
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

            <div className="ml-auto flex items-center gap-2 sm:gap-5">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                aria-label={
                  isMobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-dashboard-navigation"
                className="flex size-10 items-center justify-center rounded-xl border border-(--app-border) text-(--text-primary) transition hover:bg-(--app-bg) lg:hidden"
              >
                {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>

              <ThemeToggle />

              {/* User Profile */}
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

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Logout"
                className="hidden items-center gap-2 rounded-lg border border-(--app-border) px-3 py-2 text-sm font-medium text-(--text-secondary) transition hover:bg-(--app-bg) hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
              >
                <LogOut size={17} />

                <span className="hidden sm:inline">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </header>

          {/* Mobile Dropdown Navigation */}
          {isMobileMenuOpen && (
            <nav
              id="mobile-dashboard-navigation"
              aria-label="Mobile dashboard navigation"
              className="absolute inset-x-0 top-full border-b border-(--app-border) bg-(--surface) p-3 shadow-xl lg:hidden"
            >
              <p className="mb-2 px-3 py-2 text-xs font-semibold tracking-wider text-(--text-secondary)">
                WORKSPACE
              </p>

              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.href

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => handleNavigation(item.href)}
                      aria-current={isActive ? "location" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                          : "text-(--text-secondary) hover:bg-(--app-bg) hover:text-(--text-primary)"
                      }`}
                    >
                      <Icon size={19} />
                      {item.label}
                    </a>
                  )
                })}
              </div>
              <div className="mt-3 border-t border-(--app-border) pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    void handleLogout()
                  }}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  <LogOut size={19} />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </nav>
          )}
        </div>

        {/* Page Content */}
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
  )
}

export default DashboardLayout
