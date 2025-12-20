import * as D from "https://deno.land/x/fun@v1.0.0/schemable/decoder.ts";
import { pipe } from "https://deno.land/x/fun@v1.0.0/fns.ts";

// A raw game object
export const Game = D.struct({
  id: D.string,
  chars: D.array(D.string),
  middle: D.string,
  dictionary: D.array(D.string),
});
export type Game = D.TypeOf<typeof Game>;

// A record of raw game objects
export const Games = D.record(Game);
export type Games = D.TypeOf<typeof Games>;

// A collection of games sorted into length buckets
// Supports both English (40, 60, 80, 100, 120) and Russian (20, 30, 40, 50, 60) configurations
export const SortedGames = pipe(
  D.struct({
    fri: D.array(Game),
    sat: D.array(Game),
  }),
  D.intersect(
    D.partial({
      20: D.array(Game),
      30: D.array(Game),
      40: D.array(Game),
      50: D.array(Game),
      60: D.array(Game),
      80: D.array(Game),
      100: D.array(Game),
      120: D.array(Game),
    })
  )
);
export type SortedGames = D.TypeOf<typeof SortedGames>;

// A game object with a date field indicating it is scheduled
export const ScheduledGame = pipe(
  Game,
  D.intersect(D.struct({ date: D.string })),
);
export type ScheduledGame = D.TypeOf<typeof ScheduledGame>;

// A collection of scheduled games
export const ScheduledGames = D.record(ScheduledGame);
export type ScheduledGames = D.TypeOf<typeof ScheduledGames>;