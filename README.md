# Bee

[![Donate](https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png)](https://www.buymeacoffee.com/baetheus) - Donate to the original creator! He certainly put a lot more work into this than I did.

Original live version is at [bee.ignoble.dev](https://bee.ignoble.dev).

Russian live version is at [eshiman.github.io/bee/](https://eshiman.github.io/bee)

A weekend clone of the [New York Times Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee).

English words are pulled from from the [English Aspell Dictionary](http://aspell.net/).

Russian words are pulled from hermitdave's [Word Frequency Lists](https://github.com/hermitdave/FrequencyWords), filtered using + with added extra-credit words from Aspell's [Russian Dictionary](https://ftp.gnu.org/gnu/aspell/dict/0index.html)

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
u
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


### Instructions on generating more games 

Make sure to put pre-existing games (games_russian_.DATE.json) labeled as sortedGamesRussian.json (games file being currently used) in the folder so that games aren't repeated.

Use the grouped_games.json under archive which contains all the possible games (in russian) to generate more games.

deno run --allow-read --allow-write scripts/make.ts \
  -s scripts/archive/grouped_games_russian.json \
  -o scripts/sortedGamesRussian.json \
  -n 365 \
  create
Done