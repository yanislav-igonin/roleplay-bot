enum Locales {
  Ru = 'ru',
}
export enum Language {
  Ru = 'Russian',
}
type Locale = {
  buttons: {
    newGame: string;
  };
  replies: {
    error: string;
    help: string;
    notAllowed: string;
    start: string;
    startingNewGame: string;
  };
};

export const locale: Record<Locales, Locale> = {
  [Locales.Ru]: {
    buttons: {
      newGame: 'Новая игра',
    },
    replies: {
      error: 'Произошла какая-то ошибка',
      help: 'Раздел помощи в разработке',
      notAllowed: 'У вас нету доступа',
      start:
        'Привет. Я бот для ведения ролевых партий. ' +
        'Я создам игру и постараюсь провести ее для тебя.',
      startingNewGame: 'Создаю новую игру...',
    },
  },
};
