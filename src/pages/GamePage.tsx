import { h, FunctionalComponent } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { identity } from "fp-ts/function";
import { datumEither as DE } from "@nll/datum";

import {
  useGameStore,
  selectGameAndSaveById,
  submitWord,
  GameAndSave,
  eqGameAndSave,
} from "../stores/game";
import { ErrorCard } from "../components/ErrorCard";
import { Game } from "../components/Game";
import { DefaultLayout } from "../components/Layouts";
import {
  useSettingsStore,
  changeSettings,
  DetailOptions,
  WordSortOptions,
} from "../stores/settings";
import { getWordSort } from "../stores/settings/const";
import { useStrings } from "../stores/settings/strings";

interface GamePageProps {
  id?: string;
}

export const GamePage: FunctionalComponent<GamePageProps> = ({
  id = "new",
}) => {
  // Decode the ID from the URL (preact-router may or may not decode it automatically)
  const decodedId = id && id !== "new" ? decodeURIComponent(id) : id;
  const selectGame = useCallback(selectGameAndSaveById(decodedId), [decodedId]);
  const [data, gameDispatch] = useGameStore(selectGame, eqGameAndSave.equals);

  const [{ details, sort }, settingsDispatch] = useSettingsStore(identity);
  const t = useStrings();

  const handleDetailsChange = useCallback(
    (details: DetailOptions) => settingsDispatch(changeSettings({ details })),
    [settingsDispatch]
  );
  const handleSortChange = useCallback(
    (sort: WordSortOptions) => settingsDispatch(changeSettings({ sort })),
    [settingsDispatch]
  );
  const handleSubmit = useCallback(
    (guess: string) => gameDispatch(submitWord({ id: decodedId, guess })),
    [decodedId, gameDispatch]
  );

  const errorMessage = useMemo(
    () => t("game", "gameNotFoundError").replace("{id}", id),
    [t, id]
  );

  return (
    <DefaultLayout>
      {DE.squash(
        () => <div>{t("game", "loading")}</div>,
        () => (
          <ErrorCard
            title={t("game", "gameNotFound")}
            error={errorMessage}
          />
        ),
        ({ game, save, score }: GameAndSave) => {
          return (
            <Game
              game={game}
              found={getWordSort(sort)(save.found)}
              score={score}
              details={details}
              sort={sort}
              onDetailsChange={handleDetailsChange}
              onSortChange={handleSortChange}
              onSubmit={handleSubmit}
            />
          );
        }
      )(data)}
    </DefaultLayout>
  );
};
