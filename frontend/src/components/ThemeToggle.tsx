
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isLight ? "Switch to dark mode" : "Switch to light mode"
      }
      title={isLight ? "Dark mode" : "Light mode"}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-(--app-border) bg-(--surface) text-(--text-primary) shadow-sm transition-colors hover:opacity-80 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
    >
      {isLight ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}

      <span className="hidden text-sm font-medium sm:inline">
        {isLight ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
