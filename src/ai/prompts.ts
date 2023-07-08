// const gameRules =
//   `Each time players try to do something game master` +
//   `(GM) will roll a d20 dice for this action. ` +
//   `Every result equals orhigher than 10 is a success. ` +
//   `If the result is lower than 10 it's a failure. `;
// const gameMasterPromt =
//   `You're a game master. ` +
//   `You're in charge of a game that is similar to Dungeon and Dragons ` +
//   `roleplay game but with a simplier rules.`;

import { Language } from 'locale';

const markdownRules =
  `Text should be formatted in Markdown.` +
  `You can use ONLY the following formatting without any exceptions:` +
  `**bold text**, *italic text*, ~~strikethrough~~`;

export const getNewGameDescriptionPrompt = (language = Language.Ru) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons ` +
  `roleplay game but with a simplier rules. ` +
  `Your task is to make a quest for a new game in ${language} language.` +
  `You can use any fantasy setting you want. ` +
  `Describe a world briefly, its inhabitants and where the heroes located. ` +
  `Describe a quest that players will have to complete. ` +
  `All description should not be longer than 1000 characters. ` +
  markdownRules;

export const getNewGameNamePrompt = (language = Language.Ru) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a short name in ${language} for a new game based on the description ` +
  `provided between """ below:\n\n`;

export const getNewCharacterPrompt = (
  gameDescription: string,
  language = Language.Ru,
) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a new character for the game (game description provided below between` +
  `""") in ${language} language. ` +
  `Character description should not be longer than 300 characters. ` +
  `Character descrpition ` +
  markdownRules +
  ` ` +
  `Describe a character's appearance, race (based on any provided in the game` +
  `description, or invent your own, but it should fit in the game world),` +
  `personality, background, etc. ` +
  `Character can have some items, skills, spells, etc.\n\n` +
  `Format output as a JSON - ` +
  `{"name": "Character name", "description": "Character description"}. ` +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n`;

export const getTranslateToEnglishPrompt = (text: string) =>
  `Translate the following text to English:\n\n${text}`;
