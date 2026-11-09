function SplashScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--app-bg) px-4">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-brand-100 dark:bg-brand-900">
          <svg
            viewBox="0 0 24 24"
            className="h-12 w-12 text-brand-600"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C12 2 4 11 4 15.5a8 8 0 0 0 16 0C20 11 12 2 12 2Z" />
          </svg>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-brand-700 dark:text-brand-400">
            GlucoTrack
          </h1>

          <p className="mt-1 text-sm text-(--text-secondary)">
            Blood Glucose Tracker
          </p>
        </div>

        {/* Loading indicator */}
        <div className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-600" />
        </div>

        <p className="text-xs text-(--text-secondary)">
          Your health journey starts here.
        </p>
      </div>
    </main>
  );
}

export default SplashScreen;