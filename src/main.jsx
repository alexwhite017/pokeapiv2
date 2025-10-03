import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Search from "./Search.jsx";
import Details from "./Details.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/search/:pokemon" element={<Search />} />
      <Route path="/details/:pokemon" element={<Details />} />
    </Routes>
  </BrowserRouter>
);
