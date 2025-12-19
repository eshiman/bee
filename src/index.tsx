import { h, render } from "preact";

import { App } from "./App";

import "./styles/index.scss";

// Get the base path from Vite's BASE_URL (automatically set from vite.config.ts)
const basePath = import.meta.env.BASE_URL;

// Wait for font to load before rendering
new FontFace("Markazi Text", `url(${basePath}MarkaziText.ttf)`)
  .load()
  .then((font: FontFace) => {
    font.display = "swap";
    document.fonts.add(font);
    // Wait for all fonts to be ready
    return document.fonts.ready;
  })
  .catch((error) => console.error("Failed to load font.", error))
  .then(() => {
    render(<App />, document.body);
  });
