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
  const HIGH_FREQ_COUNT_FILE = "./pangram_high_freq_counts.json";
  const USE_FULL_DICTIONARY = true;

  // This is the dangerously long comprehensive list of russian words
  // with all their inflections. We use this to add words at end, to make sure puzzles
  // have all words, but these words aren't required to win.
  // It's 1,244,598 lines long
  const FULL_RUSSIAN_DICTIONARY_FILE = "./aspell_comprehensive_russian_dictionary_list.txt";
  
  // Frequency threshold used to calculate the number of words you need to guess to win
  const GENERAL_WORD_DIFFICULTY_FREQ_THRESHOLD = 100000;
  // Frequency threshold of how difficult the pangram word should be to guess
  const PANGRAM_DIFFICULTY_FREQ_THRESHOLD = 50000;

  
  // Bucket thresholds based on language
  const BUCKETS = LANGUAGE === "russian"
    ? [20, 30, 40, 50, 60]
    : [40, 60, 80, 100, 120];
  
  // Special characters for fri/sat sorting (for games with > max bucket words)
  const FRI_CHARS = LANGUAGE === "russian"
    ? ["т", "л"]
    : ["s", "d"];

  // Struct that holds dictionary text file values
  const DICTIONARY: string[] = JSON.parse(
    Deno.readTextFileSync(DICTIONARY_FILE)
  );

  // Create a word-to-line-number map for fast lookup
  // Line numbers are 1-indexed (first word is line 1)
  const wordToLineNumber = new Map<string, number>();
  DICTIONARY.forEach((word, index) => {
    wordToLineNumber.set(word, index + 1);
  });

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

  // Create mapping of frequency counts
  const pangram_high_freq_counts: Record<string, number> = {};

  DICTIONARY.forEach((word, line_number) => {
    const unique = toUniqueLetters(word);
    if (unique.length === 7 && line_number < PANGRAM_DIFFICULTY_FREQ_THRESHOLD) {
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
    .map((letters) => {
      const game = makeGame(letters);
      
      // Calculate high-frequency word count for this pangram
      // This will be used to determine how many words you need to guess to win
      const highFreqCount = game.dictionary.filter(word => {
        const lineNum = wordToLineNumber.get(word);
        return lineNum !== undefined && lineNum < GENERAL_WORD_DIFFICULTY_FREQ_THRESHOLD;
      }).length;
      pangram_high_freq_counts[game.id] = highFreqCount;
      
      return game;
    })
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
  
  // Write high-frequency word counts to separate file
  Deno.writeTextFileSync(
    HIGH_FREQ_COUNT_FILE,
    JSON.stringify(pangram_high_freq_counts, null, 2)
  );
  console.log(
    `High-frequency word counts written to ${HIGH_FREQ_COUNT_FILE}`
  );

  /**
   * Add words from full Russian dictionary to games
   * This ensures all valid words (including inflections) are included
   */
  if (LANGUAGE === "russian" & USE_FULL_DICTIONARY === true) {
    console.log("Loading full Russian dictionary...");
    const fullDictionaryText = Deno.readTextFileSync(FULL_RUSSIAN_DICTIONARY_FILE);
    const fullDictionary = fullDictionaryText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log(`Loaded ${fullDictionary.length} words from full dictionary`);
    console.log("Updating games with additional words from full dictionary...");
    
    let totalWordsAdded = 0;
    let gamesUpdated = 0;
    
    // Process all game buckets
    Object.keys(games).forEach((bucketKey) => {
      games[bucketKey].forEach((game) => {
        // Create a Set of existing words for fast duplicate checking
        const existingWords = new Set(game.dictionary);
        
        // Get all letters for this game (middle + chars)
        const allLetters = [game.middle, ...game.chars];
        
        // Filter full dictionary for words that can be made with this game's letters
        const additionalWords = fullDictionary.filter((word) => {
          // Skip if already in dictionary or too short
          if (existingWords.has(word) || word.length < 4) {
            return false;
          }
          
          // Use existing canBeMade function to check if word is valid
          return canBeMade(game.middle, allLetters)(word);
        });
        
        if (additionalWords.length > 0) {
          // Add new words to dictionary (maintain existing order, then append new ones)
          game.dictionary = [...game.dictionary, ...additionalWords];
          totalWordsAdded += additionalWords.length;
          gamesUpdated++;
        }
      });
    });
    
    console.log(`Added ${totalWordsAdded} words across ${gamesUpdated} games`);
    
    // Write updated games back to file
    Deno.writeTextFileSync(GAME_GROUP_FILE, JSON.stringify(games));
    console.log(`Updated games written to ${GAME_GROUP_FILE}`);
  }
}

create_games();
