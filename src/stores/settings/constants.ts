import { LanguageOptions } from "./models";

// Language-dependent constants organized by category
export const Constants = {
  scoreMap: {
    [LanguageOptions.english]: {
      a: 1,
      b: 3,
      c: 3,
      d: 2,
      e: 1,
      f: 4,
      g: 2,
      h: 4,
      i: 1,
      j: 8,
      k: 5,
      l: 1,
      m: 3,
      n: 1,
      o: 1,
      p: 3,
      q: 10,
      r: 1,
      s: 1,
      t: 1,
      u: 1,
      v: 4,
      w: 4,
      x: 8,
      y: 4,
      z: 10,
    },
    [LanguageOptions.russian]: {
      а: 1,
      б: 2,
      в: 2,
      г: 3,
      д: 2,
      е: 1,
      ё: 10,
      ж: 4,
      з: 3,
      и: 1,
      й: 3,
      к: 2,
      л: 1,
      м: 2,
      н: 1,
      о: 1,
      п: 2,
      р: 2,
      с: 1,
      т: 1,
      у: 2,
      ф: 10,
      х: 4,
      ц: 8,
      ч: 3,
      ш: 5,
      щ: 8,
      ъ: 10,
      ы: 2,
      ь: 3,
      э: 8,
      ю: 5,
      я: 2,
    },
  },
  // Add other language-dependent constants here as needed
} as const;

// Helper function to get a constant based on language
export const getConstant = <K extends keyof typeof Constants>(
  constant: K,
  language: LanguageOptions
): typeof Constants[K][LanguageOptions] => {
  return Constants[constant][language];
};

