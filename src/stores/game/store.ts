import { useCallback, useEffect, useState } from "preact/hooks";
import { Getter, Lens } from "monocle-ts";
import { none, some } from "fp-ts/Option";
import { createStore, filterEvery } from "@nll/dux/Store";
import { actionCreatorFactory } from "@nll/dux/Actions";
import { useDispatchFactory, useStoreFactory } from "@nll/dux/React";
import { datumEither as DE } from "@nll/datum";
import { asyncReducerFactory, caseFn } from "@nll/dux/Reducers";
import { asyncExhaustMap } from "@nll/dux/Operators";
import { compareDesc, endOfToday, isBefore, parseISO } from "date-fns";
import { createSelector } from "reselect";
import { from, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";

import { createStateRestore, logger } from "../../libs/dux";
import { eqInsensitive } from "../../libs/strings";
import {
  badNotice,
  foundToScore,
  Game,
  GameAndSave,
  GameState,
  goodNotice,
  INITIAL_GAME_STATE,
  Notice,
  Save,
  wordToScore,
} from "./consts";
import { GamesCodec, SaveStateCodec } from "./validators";
import { mapDecode } from "../../libs/ajax";
import { failureBuzz, settingsStore, successBuzz, changeSettings } from "../settings";
import { INITIAL_SETTINGS_STATE } from "../settings/const";
import { LanguageOptions } from "../settings/models";
import { getString } from "../settings/strings";
import {
  failureNotice,
  infoNotice,
  notificationsStore,
  successNotice,
} from "../notifications";

/** Setup Store */
const action = actionCreatorFactory("GAME_STORE");

export const gameStore = createStore(INITIAL_GAME_STATE).addMetaReducers(
  logger(),
);
export const useGameStore = useStoreFactory(gameStore, useState, useEffect);
export const useGameDispatch = useDispatchFactory(gameStore, useCallback);

/** Lenses */
const rootProp = Lens.fromProp<GameState>();

export const gamesL = rootProp("games");
export const gameGetter = (id: string) =>
  new Getter(
    DE.chain((r: Record<string, Game>) => DE.fromNullable<Error, Game>(r[id])),
  );
export const gameG = (id: string) => gamesL.composeGetter(gameGetter(id));

export const savesL = rootProp("saves");
export const saveGNN = (id: string) =>
  Lens.fromNullableProp<GameState["saves"]>()(id, { id, found: [] });
export const saveG = (id: string) => savesL.compose(saveGNN(id));

const foundL = Lens.fromProp<Save>()("found");
export const foundG = (id: string) => saveG(id).composeLens(foundL);

/** Submit Word */
export const submitWord = action.simple<{ id: string; guess: string }>(
  "SUBMIT_WORD",
);
const submitWordRunEvery = filterEvery(
  submitWord,
  (s: GameState, { value: { id, guess } }) => {
    const game = gameG(id).get(s);
    const save = saveG(id).get(s);
    const language = settingsStore.getState().language;

    if (!DE.isSuccess(game)) {
      settingsStore.dispatch(failureBuzz);
      notificationsStore.dispatch(failureNotice(getString("notifications", "noGame", language)));
    } else if (guess.length < 4) {
      settingsStore.dispatch(failureBuzz);
      notificationsStore.dispatch(failureNotice(guess, getString("notifications", "tooShort", language)));
    } else if (
      !guess.split("").every((c) =>
        c === game.value.right.middle || game.value.right.chars.includes(c)
      )
    ) {
      settingsStore.dispatch(failureBuzz);
      notificationsStore.dispatch(failureNotice(guess, getString("notifications", "badLetters", language)));
    } else if (!guess.includes(game.value.right.middle)) {
      settingsStore.dispatch(failureBuzz);
      notificationsStore.dispatch(
        failureNotice(guess, getString("notifications", "missingCenterLetter", language)),
      );
    } else if (!game.value.right.dictionary.some(eqInsensitive(guess))) {
      settingsStore.dispatch(failureBuzz);
      notificationsStore.dispatch(failureNotice(guess, getString("notifications", "notInWordList", language)));
    } else if (save.found.some(eqInsensitive(guess))) {
      settingsStore.dispatch(failureBuzz);
      notificationsStore.dispatch(infoNotice(guess, getString("notifications", "alreadyFound", language)));
    } else {
      const points = wordToScore(guess, language);
      settingsStore.dispatch(successBuzz);
      notificationsStore.dispatch(successNotice(guess, `+ ${points} Points`));
      return foundWord({ id, guess });
    }
  },
);
gameStore.addRunEverys(submitWordRunEvery);

/** Found Word */
const foundWord = action.simple<{ id: string; guess: string }>("FOUND_WORD");
const foundWordCase = caseFn(
  foundWord,
  (s: GameState, { value: { id, guess } }) =>
    foundG(id).modify((found) => found.concat(guess))(s),
);
gameStore.addReducers(foundWordCase);

/** Get Games URL based on language */
const getGamesUrl = (language: LanguageOptions): string => {
  const baseUrl = import.meta.env.BASE_URL;
  if (language === LanguageOptions.russian) {
    return `${baseUrl}games_russian.20251231.json`;
  } else {
    return `${baseUrl}games.20250626.json`;
  }
};

/** Get  Games */
const getGames = action.async<string, Record<string, Game>, Error>("GET_GAMES");
const getGamesReducer = asyncReducerFactory(getGames, gamesL);
const getGamesHandler = (url: string): Observable<Record<string, Game>> =>
  ajax.getJSON(url).pipe(mapDecode(GamesCodec));
const getGamesRunOnce = asyncExhaustMap<string, Record<string, Game>, Error, Record<string, any>>(
  getGames,
  getGamesHandler,
);

// Watch for language changes and reload games
const languageChangeRunEvery = filterEvery(
  changeSettings,
  (_, { value }) => {
    if (value.language !== undefined) {
      const url = getGamesUrl(value.language);
      gameStore.dispatch(getGames.pending(url));
    }
  },
);
settingsStore.addRunEverys(languageChangeRunEvery);

// Load games on initial setup based on current language
gameStore
  .addReducers(getGamesReducer)
  .addRunOnces(getGamesRunOnce);

// Load games on initial setup based on initial language
// The filterEvery will handle language changes including when settings are loaded from localStorage
gameStore.dispatch(getGames.pending(getGamesUrl(INITIAL_SETTINGS_STATE.language)));

/** Save Storage - Migrate to simple wireup in one week */
const { wireupActions } = createStateRestore<SaveStateCodec, GameState>(
  SaveStateCodec,
  "GAME_STORE/SAVES",
);
wireupActions(gameStore, [foundWord]);

/** Selectors */
export const selectGameAndSaveById = (id: string) =>
  createSelector(
    gameG(id).get,
    saveG(id).get,
    () => settingsStore.getState().language,
    (gameDE, save, language) =>
      DE.map(
        (game: Game): GameAndSave => ({
          game,
          save,
          score: foundToScore(save.found, language),
        }),
      )(gameDE)
  );

export const selectAvailableGames = createSelector(
  gamesL.get,
  savesL.get,
  () => settingsStore.getState().language,
  (gamesDE, saves, language) => {
    return DE.map((games: Record<string, Game>) =>
      Object.keys(games)
        .map((key) => games[key])
        // Only show games released beforee end of day
        .filter((game) => isBefore(parseISO(game.date), endOfToday()))
        // Sort games by release date
        .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))
        // Merge game and save data
        .map(
          (game): GameAndSave => {
            const save = saveGNN(game.id).get(saves);
            return { game, save, score: foundToScore(save.found, language) };
          },
        )
    )(gamesDE);
  },
);
