import { useState, useEffect } from "react";
import { Link } from "react-router";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/>
    <line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/>
    <line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const NavBar = () => {
  const [activeTypeColor, setActiveTypeColor] = useState("");
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") !== "light"
  );

  useEffect(() => {
    const readTypeColor = () => {
      const value = document.documentElement.style.getPropertyValue("--active-type-color").trim();
      setActiveTypeColor(value);
    };

    readTypeColor();

    const observer = new MutationObserver(readTypeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div
      className={`flex justify-center items-center p-4 text-text-primary shadow-lg fixed top-0 left-0 right-0 h-16 z-100 transition-colors duration-300 ${activeTypeColor ? "" : "bg-surface-raised"}`}
      style={activeTypeColor ? { backgroundColor: "var(--active-type-color)" } : {}}
    >
      <Link to="/">
        <h1 className="text-2xl font-bold">PokeAPI</h1>
      </Link>

      <button
        onClick={toggleTheme}
        className="absolute right-4 p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
};

export default NavBar;
