import { useState, useEffect } from "react";
import { Link } from "react-router";

const NavBar = () => {
  const [activeTypeColor, setActiveTypeColor] = useState("");

  useEffect(() => {
    const readTypeColor = () => {
      const value = document.documentElement.style.getPropertyValue("--active-type-color").trim();
      setActiveTypeColor(value);
    };

    // Read initial value
    readTypeColor();

    // Watch for changes to the style attribute on :root
    const observer = new MutationObserver(readTypeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`flex justify-center items-center p-4 text-text-primary shadow-lg fixed top-0 left-0 right-0 h-16 z-100 transition-colors duration-300 ${activeTypeColor ? "" : "bg-surface-raised"}`}
      style={activeTypeColor ? { backgroundColor: "var(--active-type-color)" } : {}}
    >
      <Link to="/">
        <h1 className="text-2xl font-bold">PokeAPI</h1>
      </Link>
    </div>
  );
};

export default NavBar;
