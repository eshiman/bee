import * as C from "io-ts/Codec";
import { Game, Save } from "./consts";

/** Game / Games */
export const GameCodec: C.Codec<unknown, unknown, Game> = C.type({
  id: C.string,
  chars: C.array(C.string),
  middle: C.string,
  dictionary: C.array(C.string),
  date: C.string,
});
export const GamesCodec = C.record(GameCodec);
export const GameCountsCodec: C.Codec<unknown, unknown, Record<string, number>> = 
  C.record(C.number);

/** Save / Saves */
export const SaveCodec: C.Codec<unknown, unknown, Save> = C.type({
  id: C.string,
  found: C.array(C.string),
});

/** Save State */
export const SaveStateCodec = C.type({
  saves: C.record(SaveCodec),
});
export type SaveStateCodec = C.TypeOf<typeof SaveStateCodec>;
