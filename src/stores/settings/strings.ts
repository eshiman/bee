import { useMemo } from "preact/hooks";
import { identity } from "fp-ts/function";
import { LanguageOptions } from "./models";
import { useSettingsStore } from "./store";

// User-facing strings organized by page/section
export const Strings = {
  // Home Page (GameListPage)
  home: {
    loadingGames: {
      [LanguageOptions.english]: "Loading Games",
      [LanguageOptions.russian]: "Загрузка игр",
    },
    errorRetrievingGames: {
      [LanguageOptions.english]: "Error Retrieving Games",
      [LanguageOptions.russian]: "Error Retrieving Games",
    },
    point: {
      [LanguageOptions.english]: "point",
      [LanguageOptions.russian]: "очко",
    },
    points: {
      [LanguageOptions.english]: "points",
      [LanguageOptions.russian]: "очков",
    },
    showOldPuzzles: {
      [LanguageOptions.english]: "Show Old Puzzles",
      [LanguageOptions.russian]: "Показать старые головоломки",
    },
    hideOldPuzzles: {
      [LanguageOptions.english]: "Hide Old Puzzles",
      [LanguageOptions.russian]: "Скрыть старые головоломки",
    },
  },

  // About/Help Page (HelpPage)
  help: {
    about: {
      [LanguageOptions.english]: "About",
      [LanguageOptions.russian]: "О проекте",
    },
    aboutDescription: {
      [LanguageOptions.english]:
        "This site is pretty much a copy of Brandon Blaylock's lovely Bee game, except translated to Russian. The original site is in English. The goal is to make a game for my grandmother to play.",
      [LanguageOptions.russian]:
        "Этот сайт — практически копия прекрасной игры Bee от Брэндона Блейлока, переведённая на русский язык. Оригинальный сайт на английском языке. Цель — создать игру для моей бабушки.",
    },
    aboutEnjoy: {
      [LanguageOptions.english]: "Please enjoy, Babushka Polina!",
      [LanguageOptions.russian]: "Получай удовольствие, Бабушка Полина!",
    },
    aboutLove: {
      [LanguageOptions.english]: "Love,",
      [LanguageOptions.russian]: "С любовью,",
    },
    aboutEsther: {
      [LanguageOptions.english]: "Esther",
      [LanguageOptions.russian]: "Эстер",
    },
    rules: {
      [LanguageOptions.english]: "Rules",
      [LanguageOptions.russian]: "Правила",
    },
    rulesDescription: {
      [LanguageOptions.english]:
        "The goal of the puzzle is to find all of the words that can be created with the given seven letters. There are only a few notes:",
      [LanguageOptions.russian]:
        "Цель головоломки — найти все слова, которые можно составить из данных семи букв. Есть несколько правил:",
    },
    ruleMinLength: {
      [LanguageOptions.english]: "Words must be 4 letters or longer.",
      [LanguageOptions.russian]: "Слова должны состоять из 4 или более букв.",
    },
    ruleMiddleLetter: {
      [LanguageOptions.english]: "Words must contain the middle letter.",
      [LanguageOptions.russian]: "Слова должны содержать среднюю букву.",
    },
    ruleReuseLetters: {
      [LanguageOptions.english]: "Letters can be used more than once.",
      [LanguageOptions.russian]: "Буквы можно использовать более одного раза.",
    },
    weeklyProgression: {
      [LanguageOptions.english]: "Weekly Progression (English)",
      [LanguageOptions.russian]: "Недельная прогрессия (Русский)",
    },
    weeklyProgressionDescription: {
      [LanguageOptions.english]:
        "The puzzles change throughout the week in size and letter choices.",
      [LanguageOptions.russian]:
        "Головоломки меняются в течение недели по размеру и выбору букв.",
    },
    weeklySunday: {
      [LanguageOptions.english]: "Sunday's puzzles will have fewer than 41 words.",
      [LanguageOptions.russian]: "Воскресные головоломки будут содержать менее 21 слова.",
    },
    weeklyMonday: {
      [LanguageOptions.english]: "Monday's puzzles will have 41 to 60 words.",
      [LanguageOptions.russian]: "Понедельничные головоломки будут содержать от 21 до 30 слов.",
    },
    weeklyTuesday: {
      [LanguageOptions.english]: "Tuesday's puzzles will have 61 to 80 words.",
      [LanguageOptions.russian]: "Вторничные головоломки будут содержать от 31 до 40 слов.",
    },
    weeklyWednesday: {
      [LanguageOptions.english]: "Wednesday's puzzles will have 81 to 100 words.",
      [LanguageOptions.russian]: "Средние головоломки будут содержать от 41 до 50 слов.",
    },
    weeklyThursday: {
      [LanguageOptions.english]: "Thursday's puzzles will have 101 to 120 words.",
      [LanguageOptions.russian]: "Четверговые головоломки будут содержать от 51 до 60 слов.",
    },
    weeklyFriday: {
      [LanguageOptions.english]: "Friday's puzzles will have than more 120 words.",
      [LanguageOptions.russian]: "Пятничные головоломки будут содержать более 60 слов.",
    },
    weeklySaturday: {
      [LanguageOptions.english]:
        "Saturday's puzzles will have more than 70 words and will exclude the letters s and d.",
      [LanguageOptions.russian]:
        "Субботние головоломки будут содержать более 70 слов и будут исключать буквы \"т\" и \"л\".",
    },
  },

  // Settings Page
  settings: {
    turnOffVibration: {
      [LanguageOptions.english]: "Turn Off Vibration",
      [LanguageOptions.russian]: "Выключить вибрацию",
    },
    turnOnVibration: {
      [LanguageOptions.english]: "Turn On Vibration",
      [LanguageOptions.russian]: "Включить вибрацию",
    },
  },

  // Game Page (GamePage)
  game: {
    loading: {
      [LanguageOptions.english]: "Loading",
      [LanguageOptions.russian]: "Загрузка",
    },
    gameNotFound: {
      [LanguageOptions.english]: "Game Not Found",
      [LanguageOptions.russian]: "Game Not Found",
    },
    gameNotFoundError: {
      [LanguageOptions.english]: "Game with id '{id}' does not exist!",
      [LanguageOptions.russian]: "Game with id '{id}' does not exist!",
    },
  },

  // Game Component (Found, Game)
  gameComponent: {
    words: {
      [LanguageOptions.english]: "Words",
      [LanguageOptions.russian]: "Слова",
    },
    stats: {
      [LanguageOptions.english]: "Stats",
      [LanguageOptions.russian]: "Статистика",
    },
    found: {
      [LanguageOptions.english]: "Found",
      [LanguageOptions.russian]: "Найдено",
    },
    point: {
      [LanguageOptions.english]: "point",
      [LanguageOptions.russian]: "очко",
    },
    points: {
      [LanguageOptions.english]: "points",
      [LanguageOptions.russian]: "очков",
    },
    showSpoilers: {
      [LanguageOptions.english]: "Show Spoilers",
      [LanguageOptions.russian]: "Показать ответы",
    },
    hideSpoilers: {
      [LanguageOptions.english]: "Hide Spoilers",
      [LanguageOptions.russian]: "Скрыть ответы",
    },
    letterWords: {
      [LanguageOptions.english]: "letter words",
      [LanguageOptions.russian]: "буквенные слова",
    },
    pangrams: {
      [LanguageOptions.english]: "Pangrams",
      [LanguageOptions.russian]: "Панграммы",
    },
    sortFound: {
      [LanguageOptions.english]: "Found",
      [LanguageOptions.russian]: "Найдено",
    },
    sortLength: {
      [LanguageOptions.english]: "Length",
      [LanguageOptions.russian]: "Длина",
    },
    sortAlphabetic: {
      [LanguageOptions.english]: "Alphabetic",
      [LanguageOptions.russian]: "Алфавит",
    },
  },

  // Notifications
  notifications: {
    tooShort: {
      [LanguageOptions.english]: "Too Short",
      [LanguageOptions.russian]: "Слишком короткое",
    },
    badLetters: {
      [LanguageOptions.english]: "Bad Letters",
      [LanguageOptions.russian]: "Неправильные буквы",
    },
    missingCenterLetter: {
      [LanguageOptions.english]: "Missing Center Letter",
      [LanguageOptions.russian]: "Отсутствует центральная буква",
    },
    notInWordList: {
      [LanguageOptions.english]: "Not In Word List",
      [LanguageOptions.russian]: "Нет в списке слов",
    },
    alreadyFound: {
      [LanguageOptions.english]: "Already Found",
      [LanguageOptions.russian]: "Уже найдено",
    },
    noGame: {
      [LanguageOptions.english]: "No game!",
      [LanguageOptions.russian]: "Нет игры!",
    },
  },
} as const;

// Helper function to get a string based on language
export const getString = <K extends keyof typeof Strings>(
  section: K,
  key: keyof typeof Strings[K],
  language: LanguageOptions
): string => {
  const sectionStrings = Strings[section];
  const stringObj = sectionStrings[key as keyof typeof Strings[K]] as {
    [key in LanguageOptions]: string;
  };
  return stringObj[language];
};

// Hook to get translated strings based on current language
export const useStrings = () => {
  const [{ language }] = useSettingsStore(identity);
  
  const t = useMemo(
    () => <K extends keyof typeof Strings>(
      section: K,
      key: keyof typeof Strings[K]
    ): string => {
      return getString(section, key, language);
    },
    [language]
  );

  return t;
};

