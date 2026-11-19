import { createContext, useContext, useLayoutEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Always initialize theme with Light Mode on open
  const [theme, setTheme] = useState("light");

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }

    localStorage.setItem("prefynix-theme", theme);

    // Remove initial no-theme-transition class after first paint to enable smooth toggling transitions
    const timer = setTimeout(() => {
      root.classList.remove("no-theme-transition");
    }, 50);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
