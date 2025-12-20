// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================
// Set to "english" or "russian" to switch between language configurations
const LANGUAGE: "english" | "russian" = "russian";
// ============================================================================

function create_games() {
  const DICTIONARY_FILE = LANGUAGE === "russian" 
    ? "./russian_dictionary.json"
    : "./english-no-profanity.json";
  const PANGRAM_GROUP_FILE = "./pangram_groups.json";
  const PLAYED_GAME_FILE = "./games_before_20200606.json";
  const GAME_GROUP_FILE = "./grouped_games.json";
  
  // Bucket thresholds based on language
  const BUCKETS = LANGUAGE === "russian"
    ? [20, 30, 40, 50, 60]
    : [40, 60, 80, 100, 120];
  
  // Special characters for fri/sat sorting (for games with > max bucket words)
  const FRI_CHARS = LANGUAGE === "russian"
    ? ["т", "л"]
    : ["s", "d"];

  const DICTIONARY: string[] = JSON.parse(
    Deno.readTextFileSync(DICTIONARY_FILE)
  );

  function toUniqueLetters(word: string): string {
    return Array.from(new Set(word.split("")))
      .sort()
      .join("");
  }
  function notNil<T>(t: T): t is NonNullable<T> {
    return t !== null && t !== undefined;
  }

  /**
   * Create Pangram Groups
   */
  const pangram_groups: Record<string, string[]> = {};

  DICTIONARY.forEach((word) => {
    const unique = toUniqueLetters(word);
    if (unique.length === 7) {
      if (notNil(pangram_groups[unique])) {
        pangram_groups[unique].push(word);
      } else {
        pangram_groups[unique] = [word];
      }
    }
  });

  console.log(`${Object.keys(pangram_groups).length} sets of unique letters`);

  Deno.writeTextFileSync(PANGRAM_GROUP_FILE, JSON.stringify(pangram_groups));

  /**
   * Remove played games
   */
  type Game = {
    id: string;
    chars: string[];
    middle: string;
    dictionary: string[];
  };

  /*const played_games: Record<string, Game> = JSON.parse(
    Deno.readTextFileSync(PLAYED_GAME_FILE)
  );*/

  /**
   * Create games from pangram groups
   */

  function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isIn<T>(ts: T[]): (t: T) => boolean {
    return function isInInternal(t1) {
      return ts.some((t2) => t2 === t1);
    };
  }

  function canBeMade(
    middle: string,
    chars: string[]
  ): (word: string) => boolean {
    return function canBeMadeInternal(word) {
      return word.split("").every(isIn(chars)) && word.includes(middle);
    };
  }

  function makeGame(letters: string): Game {
    const middle = letters[getRandomInt(0, letters.length - 1)];
    const chars = letters.split("").filter((char) => char !== middle);
    const dictionary = DICTIONARY.filter(canBeMade(middle, letters.split("")))
      .filter((word) => word.length >= 4);

    console.log("Make game", { letters, length: dictionary.length });

    return {
      id: `${toUniqueLetters(letters)}_${middle}`,
      chars,
      middle,
      dictionary,
    };
  }

  // Initialize accumulator with dynamic buckets
  const initialAcc: Record<string, Game[]> = {
    sat: [],
    fri: [],
  };
  BUCKETS.forEach(bucket => {
    initialAcc[bucket] = [];
  });

  const games = Object.keys(pangram_groups)
    .map(makeGame)
//    .filter((game) => played_games[game.id] === undefined)
    .reduce(
      (acc, cur) => {
        const wordCount = cur.dictionary.length;
        let sorted = false;
        
        // Sort into buckets
        for (let i = 0; i < BUCKETS.length; i++) {
          if (wordCount <= BUCKETS[i]) {
            acc[BUCKETS[i]].push(cur);
            sorted = true;
            break;
          }
        }
        
        // If word count exceeds all buckets, sort into fri/sat based on special characters
        if (!sorted) {
          if (
            cur.dictionary.some(
              (word) => FRI_CHARS.some(char => word.includes(char))
            )
          ) {
            acc.fri.push(cur);
          } else {
            acc.sat.push(cur);
          }
        }

        return acc;
      },
      initialAcc
    );

  Object.keys(games).forEach((key) => {
    console.log(`Count for ${key}: ${games[key].length}`);
  });

  Deno.writeTextFileSync(GAME_GROUP_FILE, JSON.stringify(games));
}

create_games();
