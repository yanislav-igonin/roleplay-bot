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
  `Text should be formatted in Markdown. ` +
  `You can use ONLY the following formatting without any exceptions:` +
  `**bold text**, *italic text*, ~~strikethrough~~.`;

export const getNewGamePrompt = (language = Language.Ru) =>
  `You're a game master.\n` +
  `You're in charge of a game that is similar to Dungeon and Dragons ` +
  `roleplay game but with a simplier rules.\n` +
  `Your task is to make a quest for a new game in ${language} language.\n` +
  `You can use any setting you want.\n` +
  `Describe a world briefly, its inhabitants and where the heroes located.\n` +
  `Describe a quest that players will have to complete.\n` +
  `All description should not be longer than 1000 characters.\n` +
  `${markdownRules}\n` +
  `Use line breaks to separate paragraphs.\n` +
  `Format output as a JSON - ` +
  `{"name": "Game name", "description": "Game description"}.`;

export const getNewCharacterPrompt = (
  gameDescription: string,
  language = Language.Ru,
) =>
  `You're a game master.\n` +
  `You're in charge of a game that is similar to Dungeon and Dragons.\n` +
  `Make a new character for the game (game description provided below between` +
  `""") in ${language} language.\n` +
  `Character description should not be longer than 300 characters.\n` +
  `Character descrpition ` +
  `${markdownRules}` +
  `Describe a character's appearance, race (based on any provided in the game ` +
  `description, or invent your own, but it should fit in the game world),` +
  `personality, background, etc.\n` +
  `Character can have some items, skills, spells, etc.\n` +
  `Use line breaks to separate paragraphs.\n` +
  `Format output as a JSON - ` +
  `{"name": "Character name", "description": "Character description"}.\n` +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n`;

export const getTranslateToEnglishPrompt = (text: string) =>
  `Translate the following text to English:\n\n${text}`;
