import { config } from '@/config';
import { Language, locale } from 'locale';
import { type ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: config.openAiApiKey,
});
export const openai = new OpenAIApi(configuration);

// ====================================================
// ====================================================
// ====================================================

export const addSystemContext = (
  text: string,
): ChatCompletionRequestMessage => {
  return {
    content: text,
    role: 'system',
  };
};

export const addAssistantContext = (
  text: string,
): ChatCompletionRequestMessage => {
  return {
    content: text,
    role: 'assistant',
  };
};

export const addUserContext = (text: string): ChatCompletionRequestMessage => {
  return {
    content: text,
    role: 'user',
  };
};

// ====================================================
// ====================================================
// ====================================================

// const gameRules =
//   `Each time players try to do something game master` +
//   `(GM) will roll a d20 dice for this action. ` +
//   `Every result equals orhigher than 10 is a success. ` +
//   `If the result is lower than 10 it's a failure. `;
// const gameMasterPromt =
//   `You're a game master. ` +
//   `You're in charge of a game that is similar to Dungeon and Dragons ` +
//   `roleplay game but with a simplier rules.`;

const markdownRules =
  `Text should be formatted in Markdown.` +
  `You can use ONLY the following formatting without any exceptions:` +
  `**bold text**, *italic text*, ~~strikethrough~~`;

// ====================================================
// ====================================================
// ====================================================

// ====================================================
// ====================================================
// ====================================================

type GetNewCharacterDescriptionPromptData = {
  gameDescription: string;
  language: Language;
};
const getNewCharacterDescriptionPrompt = ({
  language,
  gameDescription,
}: GetNewCharacterDescriptionPromptData) =>
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
  `Game description:\n` +
  `"""${gameDescription}"""\n\n`;
export const getNewCharacterDescription = async ({
  gameDescription,
}: {
  gameDescription: string;
}) => {
  const message = addUserContext(
    getNewCharacterDescriptionPrompt({
      gameDescription,
      language: Language.Ru,
    }),
  );
  const response = await openai.createChatCompletion({
    // function_call: 'auto',
    // functions: [setCharacterDataFunction()],
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return text;
};

type GetNewCharacterNamePromptData = {
  characterDescription: string;
  language: Language;
};
const getNewCharacterNamePrompt = ({
  language,
  characterDescription,
}: GetNewCharacterNamePromptData) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a short name in ${language} for a new character based on the description ` +
  `provided between """ below:\n\n` +
  `"""${characterDescription}"""`;
type GetNewCharacterNameData = {
  characterDescription: string;
};
export const getNewCharacterName = async ({
  characterDescription,
}: GetNewCharacterNameData) => {
  const message = addUserContext(
    getNewCharacterNamePrompt({
      characterDescription,
      language: Language.Ru,
    }),
  );
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return text;
};

// ====================================================
// ====================================================
// ====================================================

const getNewGameDescriptionPrompt = (language: Language) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons ` +
  `roleplay game but with a simplier rules. ` +
  `Your task is to make a quest for a new game in ${language} language.` +
  `You can use any fantasy setting you want. ` +
  `Describe a world briefly, its inhabitants and where the heroes located. ` +
  `Describe a quest that players will have to complete. ` +
  `All description should not be longer than 500 characters. ` +
  markdownRules;
/**
 * Make a new game description.
 */
export const getNewGameDescription = async () => {
  const message = addSystemContext(getNewGameDescriptionPrompt(Language.Ru));
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return text;
};

type GetNewGameNamePromptData = {
  gameDescription: string;
  language: Language;
};
const getNewGameNamePrompt = ({
  language,
  gameDescription,
}: GetNewGameNamePromptData) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a short name in ${language} for a new game based on the description ` +
  `provided between """ below:\n\n` +
  `"""${gameDescription}"""`;

/**
 * Make a new game name based on description.
 *
 * @param description Game description.
 */
export const getNewGameName = async (description: string) => {
  const propmpt = getNewGameNamePrompt({
    gameDescription: description,
    language: Language.Ru,
  });
  const message = addSystemContext(propmpt);
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return text;
};

// ====================================================
// ====================================================
// ====================================================

const getTranslateToEnglishPrompt = (text: string) =>
  `Translate text below between """ into English:\n\n"""${text}"""`;
export const translateToEnglish = async (toTranslate: string) => {
  const message = addUserContext(getTranslateToEnglishPrompt(toTranslate));
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-3.5-turbo',
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return text;
};

/**
 * Generate an image based on text provided.
 * Useful to generate any kind of images for games views, characters portraits, etc.
 */
export const getImage = async (text: string) => {
  // DALL-E works much better with English text.
  const translated = await translateToEnglish(text);
  const response = await openai.createImage({
    prompt: translated,
    response_format: 'url',
    size: '512x512',
  });
  const { url } = response.data.data[0];
  if (!url) {
    throw new Error(locale.ru.errors.noImageUrlInResponse);
  }

  return url;
};

export const getAiResponse = async (
  prompt: string,
  context: ChatCompletionRequestMessage[] = [],
  model = 'gpt-4-32k',
) => {
  const userMessage = addUserContext(prompt);
  const messages = [...context, userMessage];
  const response = await openai.createChatCompletion({
    messages,
    model,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error('No text in response');
  }

  return text;
};
