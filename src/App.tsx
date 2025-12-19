import { h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Router } from "preact-router";

import { GameListPage } from "./pages/GameListPage";
import { GamePage } from "./pages/GamePage";
import { SettingsPage } from "./pages/SettingsPage";
import { HelpPage } from "./pages/HelpPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { Notification } from "./components/Notification";

// Get the base path from Vite's BASE_URL (automatically set from vite.config.ts)
const basePath = import.meta.env.BASE_URL;

// Strip the base path from the current pathname
function getCurrentPath(): string {
  const pathname = window.location.pathname;
  if (pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length - 1) || "/";
  }
  return pathname;
}

export function App() {
  const [currentUrl, setCurrentUrl] = useState(getCurrentPath());

  // Handle browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(getCurrentPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <Fragment>
      <Notification />

      <Router
        url={currentUrl}
        onChange={(e: { url: string }) => {
          // Normalize the URL - strip base path if present
          let normalizedUrl = e.url;
          if (e.url.startsWith(basePath)) {
            normalizedUrl = e.url.slice(basePath.length - 1) || "/";
          }
          
          // Update the browser URL to include the base path
          const pathWithBase = basePath === "/" ? normalizedUrl : basePath.slice(0, -1) + normalizedUrl;
          if (window.location.pathname !== pathWithBase) {
            window.history.pushState(null, "", pathWithBase);
          }
          setCurrentUrl(normalizedUrl);
        }}
      >
        <GameListPage path="/" />
        <GamePage path="/games/:id" />
        <SettingsPage path="/settings" />
        <HelpPage path="/help" />
        <NotFoundPage default />
      </Router>
    </Fragment>
  );
}
