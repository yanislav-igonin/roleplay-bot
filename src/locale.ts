enum Locales {
  Ru = 'ru',
}
type Locale = {
  newGame: string;
};

export const locale: Record<Locales, Locale> = {
  [Locales.Ru]: {
    newGame: 'Новая игра',
  },
};
