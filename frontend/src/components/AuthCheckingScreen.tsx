function AuthCheckingScreen() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--app-bg)" }}
    >
      <div className="flex flex-col items-center text-center">

        {/* Security icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-8 w-8 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
          >
            <path
              d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m9 12 2 2 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-bold text-brand-700 dark:text-brand-400">
          GlucoTrack
        </h1>

        {/* Loading indicator */}
        <div
          className="mt-8 h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400"
          role="status"
          aria-label="Checking authentication"
        />

        <h2
          className="mt-5 text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Verifying your account...
        </h2>

        <p
          className="mt-2 max-w-xs text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Please wait while we securely check your session.
        </p>
      </div>
    </main>
  );
}

export default AuthCheckingScreen;