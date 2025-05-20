import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Only here
import App from "./App";
import './main.css'; // Import Tailwind CSS
import './styles/global.css'; // Import global styles

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter> {/* Wrap once */}
    <App />
  </BrowserRouter>
);
