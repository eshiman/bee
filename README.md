# Bee

[![Donate](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://www.buymeacoffee.com/baetheus) - Donate to the original creator!

Original live version is at [bee.ignoble.dev](https://bee.ignoble.dev).

Russian live version is at [eshiman.github.io/bee/](https://eshiman.github.io/bee)

---

A weekend clone of the [New York Times Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee).

English words are pulled from from the [English Aspell Dictionary](http://aspell.net/).

Russian words are pulled from hermitdave's [Word Frequency Lists](https://github.com/hermitdave/FrequencyWords).

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Using Nix

If you have Nix installed, you can use the provided flake:

```bash
nix develop
npm install
npm start
```
