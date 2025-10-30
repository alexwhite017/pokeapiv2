import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

import Details from "./Details.jsx";
import Sort from "./Sort.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/details/:pokemon" element={<Details />} />
      <Route path="/sort/:typing" element={<Sort />} />
    </Routes>
  </BrowserRouter>
);
