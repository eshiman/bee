import * as C from "io-ts/Codec";

import { DetailOptions, SettingsState, WordSortOptions, LanguageOptions } from "./models";
import { identity } from "fp-ts/function";

export const INITIAL_SETTINGS_STATE: SettingsState = {
  vibration: true,
 language: LanguageOptions.russian,
  details: DetailOptions.words,
  sort: WordSortOptions.Found,
};

export const SettingsStateCodec = C.partial({
  vibration: C.boolean,
  language: C.literal(LanguageOptions.english, LanguageOptions.russian),
  details: C.literal(DetailOptions.stats, DetailOptions.words),
  sort: C.literal(
    WordSortOptions.Found,
    WordSortOptions.Length,
    WordSortOptions.Alphabetic,
  ),
});
export type SettingsStateCodec = C.TypeOf<typeof SettingsStateCodec>;

export const getWordSort = (
  sort: WordSortOptions,
): (words: string[]) => string[] => {
  switch (sort) {
    case "Found":
      return (ws) => [...ws];
    case "Length":
      return (ws) => [...ws].sort((a, b) => a.length - b.length);
    case "Alphabetic":
      return (ws) => [...ws].sort((a, b) => a.localeCompare(b));
  }
};
