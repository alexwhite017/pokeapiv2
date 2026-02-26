import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App page="Home" />} />
      <Route path="/details/:pokemon" element={<App page="Details" />} />
      <Route path="/sort/:typing" element={<App page="Sort" />} />
    </Routes>
  </BrowserRouter>
);
