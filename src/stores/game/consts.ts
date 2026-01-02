import { none, Option } from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { DatumEither, initial } from "@nll/datum/DatumEither";
import { getEq } from "@nll/datum/Datum";

import { notNil } from "../../libs/typeguards";
import { LanguageOptions } from "../settings/models";
import { getConstant } from "../settings/constants";

export type Game = {
  id: string;
  chars: string[];
  middle: string;
  dictionary: string[];
  date: string;
};

export type Save = {
  id: string;
  found: string[];
};

export type Notice = {
  type: "good" | "bad";
  message: string;
};

export interface GameState {
  games: DatumEither<Error, Record<string, Game>>;
  saves: Record<string, Save>;
}

export interface CountState {
  counts: DatumEither<Error, Record<string, number>>;
}

export type GameAndSave = {
  game: Game;
  save: Save;
  score: number;
};

export const eqGameAndSave = getEq(
  E.getEq<Error, GameAndSave>(
    {
      equals: (a, b) => a === b,
    },
    {
      equals: (a, b) => a.game === b.game && a.save === b.save,
    },
  ),
);

export const goodNotice = (message: string): Notice => ({
  type: "good",
  message,
});
export const badNotice = (message: string): Notice => ({
  type: "bad",
  message,
});

export const INITIAL_GAME_STATE: GameState = {
  saves: {},
  games: initial,
};

export const INITIAL_COUNT_STATE: CountState = {
  counts: initial,
};

// Helper function to get the appropriate score map based on language
export function getScoreMap(language: LanguageOptions): Record<string, number> {
  return getConstant("scoreMap", language);
}

function charToScore(
  char: string,
  scoreMap: Record<string, number>
): number {
  return notNil(scoreMap[char]) ? scoreMap[char] : 0;
}

export function wordToScore(word: string, language: LanguageOptions): number {
  const scoreMap = getScoreMap(language);
  return word
    .split("")
    .reduce((total, letter) => total + charToScore(letter, scoreMap), 0);
}

export function foundToScore(
  found: string[],
  language: LanguageOptions
): number {
  return found.reduce(
    (total, word) => total + wordToScore(word, language),
    0
  );
}
