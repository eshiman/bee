import addDays from "https://deno.land/x/date_fns@v2.22.1/addDays/index.ts";
import getDay from "https://deno.land/x/date_fns@v2.22.1/getDay/index.ts";
import * as D from "https://deno.land/x/fun@v1.0.0/schemable/decoder.ts";
import * as E from "https://deno.land/x/fun@v1.0.0/either.ts";
import { parse } from "https://deno.land/std@0.102.0/flags/mod.ts";
import { pipe } from "https://deno.land/x/fun@v1.0.0/fns.ts";
import {
  Game,
  Games,
  ScheduledGames,
  SortedGames,
} from "./types.ts";

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================
// Set to "english" or "russian" to switch between language configurations
const LANGUAGE: "english" | "russian" = "russian";
// ============================================================================

// Import profanity filter based on language
import { bannedWords as bannedWordsRussian } from "./profanity_russian.ts";
import { bannedWords as bannedWordsEnglish } from "./profanity.ts";
const bannedWords = LANGUAGE === "russian" ? bannedWordsRussian : bannedWordsEnglish;

// Bucket thresholds based on language
const BUCKETS = LANGUAGE === "russian"
  ? [20, 30, 40, 50, 60]
  : [40, 60, 80, 100, 120];

// Day-to-bucket mapping based on language (matches BUCKETS order)
const intToGroupLocal: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, keyof SortedGames> = LANGUAGE === "russian"
  ? {
      0: "20",
      1: "30",
      2: "40",
      3: "50",
      4: "60",
      5: "fri",
      6: "sat",
    }
  : {
      0: "40",
      1: "60",
      2: "80",
      3: "100",
      4: "120",
      5: "fri",
      6: "sat",
    };

// Env Arguments
export const Commands = D.literal("runonce", "create", "filter");
export type Commands = D.TypeOf<typeof Commands>;

export const Env = pipe(
  D.struct({
    // Source
    s: D.string,
    // Output
    o: D.string,
    // Number of games to make
    n: D.number,
    // Command: runonce or create
    _: D.tuple(Commands),
  }),
  D.intersect(D.partial({
    f: D.string,
  })),
);
export type Env = D.TypeOf<typeof Env>;

type Mutable<T> = T extends ReadonlyArray<infer U> ? Array<Mutable<U>>
  : { [K in keyof T]: Mutable<T[K]> };

// Commands
export const sortGamesOnce = async (env: Env): Promise<void> => {
  // Get Games Data (
  const gamesData = await Deno.readFile(env.s);
  const textDecoder = new TextDecoder("utf-8");
  const gamesString = textDecoder.decode(gamesData);
  const gamesJson = JSON.parse(gamesString);
  const gamesDecoded = Games(gamesJson);

  if (E.isLeft(gamesDecoded)) {
    console.error(`Unable to decode game source ${env.s}`);
    console.error(D.draw(gamesDecoded.left));
    return;
  }

  const games = Object.values(gamesDecoded.right) as unknown as Mutable<Games>;
  
  // Initialize sortedGames with dynamic buckets
  const sortedGames: Mutable<SortedGames> = {
    fri: [],
    sat: [],
  } as Mutable<SortedGames>;
  // Add bucket arrays dynamically
  BUCKETS.forEach(bucket => {
    (sortedGames as any)[String(bucket)] = [];
  });

  for (const key in games) {
    const game = games[key];
    game.dictionary = game.dictionary.filter((word) =>
      bannedWords.every((w) => w !== word)
    );
    const length = game.dictionary.length;
    
    let sorted = false;
    // Sort into buckets
    for (let i = 0; i < BUCKETS.length; i++) {
      if (length < BUCKETS[i] + 1) {
        (sortedGames as any)[String(BUCKETS[i])].push(game);
        sorted = true;
        break;
      }
    }
    
    // If word count exceeds all buckets, sort into fri/sat based on game.id
    if (!sorted) {
      if (game.id.includes("s") || game.id.includes("d")) {
        sortedGames["fri"].push(game);
      } else {
        sortedGames["sat"].push(game);
      }
    }
  }

  await Deno.writeTextFile(env.o, JSON.stringify(sortedGames, null, 2));
};

export const create = async (env: Env): Promise<void> => {
  const textDecoder = new TextDecoder("utf-8");

  // Get Games Source
  const sortedGamesArray = await Deno.readFile(env.s);
  const sortedGamesString = textDecoder.decode(sortedGamesArray);
  const sortedGamesJson = JSON.parse(sortedGamesString);
  const sortedGamesDecoded = SortedGames(sortedGamesJson);

  if (E.isLeft(sortedGamesDecoded)) {
    console.error(`Unable to decode game source ${env.s}`);
    console.error(D.draw(sortedGamesDecoded.left));
    console.error("Raw Data");
    console.error(sortedGamesJson);
    return;
  }

  const sortedGames = sortedGamesDecoded.right as unknown as Mutable<
    SortedGames
  >;

  // Get Existing Games
  const existingGamesArray = await Deno.readFile(env.o);
  const existingGamesString = textDecoder.decode(existingGamesArray);
  const existingGamesJson = JSON.parse(existingGamesString);
  const existingGamesDecoded = ScheduledGames(existingGamesJson);

  if (E.isLeft(existingGamesDecoded)) {
    console.error(`Unable to decode game output ${env.o}`);
    console.error(D.draw(existingGamesDecoded.left));
    return;
  }

  const existingGames = existingGamesDecoded.right;

  // Get starting day
  let day = new Date();

  if (typeof env.f === "string") {
    try {
      day = new Date(env.f);
    } catch (e) {
      console.error(`Unable to parse from date ${env.f}.`);
      console.error(e);
      return;
    }
  }

  // Generate the new puzzles
  while (env.n > 0) {
    const dayNumber = getDay(day) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const dayKey = intToGroupLocal[dayNumber];
    const gamesForDay = sortedGames[dayKey];

    let found = false;

    do {
      const candidate = gamesForDay.pop();

      if (candidate === undefined) {
        console.error(`Ran out of games on ${day}`);
        return;
      }

      if (existingGames[candidate.id] === undefined) {
        existingGames[candidate.id] = {
          ...candidate,
          date: day.toISOString(),
        };
        found = true;
      }
    } while (!found);

    day = addDays(day, 1);
    env.n--;
  }

  // Write puzzles to output
  await Deno.writeTextFile(env.o, JSON.stringify(existingGames, null, 2));
};

// CLI
const run = async (): Promise<void> => {
  const envRaw = parse(Deno.args);
  const envDecoded = Env(envRaw);

  if (E.isLeft(envDecoded)) {
    console.error("Unabled to decode arguments");
    console.error(D.draw(envDecoded.left));
    return;
  }

  const env = envDecoded.right;
  switch (env._[0]) {
    case "runonce":
      await sortGamesOnce(env);
      break;
    case "create":
      await create(env);
      break;
  }

  console.log("Done");
};

// Run
await run();
