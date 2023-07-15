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

export const markdownRules =
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
  `For the line breaks "\n" symbols should be used.\n` +
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
  `For the line breaks "\n" symbols should be used.\n` +
  `Format output as a JSON - ` +
  `{"name": "Character name", "description": "Character description"}.\n` +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n`;

export const getSummaryForImageGenerationPrompt = (text: string) =>
  `Extract and summarize from the text below between """ descriptions of ` +
  `landscapes, descriptions of characters appearance.\n` +
  `Do not extract any information that is not related to apperances or a landscapes views.\n` +
  `If text doesn't contain such descriptions, just make your own ` +
  `based on the text information.\n` +
  `For landscapes summary should look like: ` +
  `"A picture of a forest with a river, etc.".\n` +
  `For characters summary should look like: ` +
  `"A picture of a man with big brown beard, large nose, etc."` +
  `Be concise, description MUST be no longer than 150 characters.` +
  `\nText:` +
  `"""${text}"""`;

export const gmPrompt =
  `You're a game master.\n` +
  `You're in charge of a game that is similar to Dungeon and Dragons.\n`;
export const rulesPrompt =
  'Rules is simple: each time players try to do something game master ' +
  'they should roll a d20 dice for this action.\n' +
  'Every result equals or higher than 10 is a success.\n';

export const getFirstContextPrompt = (
  gameDescription: string,
  characterDescription: string,
) =>
  gmPrompt +
  `Based on the game description and a character description provided below between """ ` +
  `make a description of where our characters located right now before the quest.\n` +
  `It can be a tavern, a forest, a cave, etc.\n` +
  `For the line breaks "\n" symbols should be used.\n` +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n` +
  `Character description:\n` +
  `"""${characterDescription}"""\n\n`;

export const getTranslateToEnglishPrompt = (text: string) =>
  `Translate the following text to English:\n\n${text}`;

export const getDiceResultPrompt = (diceResult: number) =>
  `You rolled a ${diceResult}.\n`;

export const getUsedLanguagePrompt = (language = 'Russian') =>
  `All output should be in ${language} language.\n`;

export const shortReplyPrompt =
  'Output should be no longer than 500 characters.\n';
