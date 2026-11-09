import { useTheme } from "../context/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      className="flex items-center gap-2 rounded-full border border-(--app-border) bg-(--surface) px-4 py-2 text-r(--text-primary) shadow-sm transition-colors hover:opacity-80"
    >
      <span aria-hidden="true">
        {theme === "light" ? "🌙" : "☀️"}
      </span>

      <span className="text-sm font-medium">
        {theme === "light" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;