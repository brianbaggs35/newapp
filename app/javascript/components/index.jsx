import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Function to mount React app
function mountReactApp() {
  const container = document.getElementById("react-root");
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
}

// Mount on Turbo load (Rails environment)
document.addEventListener("turbo:load", mountReactApp);

// Mount on DOMContentLoaded or immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", mountReactApp);
} else {
  // DOM is already loaded, mount immediately
  mountReactApp();
}