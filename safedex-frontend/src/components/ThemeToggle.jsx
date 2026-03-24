import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-md bg-blue-200 hover:bg-blue-300 transition font-semibold"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title="Toggle theme"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
