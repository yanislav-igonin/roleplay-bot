import { config } from '@/config';
import { Language } from 'locale';
import { type ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: config.openAiApiKey,
});
export const openai = new OpenAIApi(configuration);

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

const getNewGameDescriptionPrompt = (language: Language) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons ` +
  `roleplay game but with a simplier rules. ` +
  `Your task is to make a quest for a new game in ${language} language.` +
  `You can use any fantasy setting you want. ` +
  `Describe a world briefly, its inhabitants and where the heroes located. ` +
  `Describe a quest that players will have to complete. ` +
  `All description should not be longer than 1000 characters. ` +
  markdownRules;

const getNewGameNamePrompt = (language: Language) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a short name in ${language} for a new game based on the description ` +
  `provided between """ below:\n\n`;

type GetNewCharacterPromptData = {
  gameDescription: string;
  language: Language;
};
const getNewCharacterPrompt = ({
  language,
  gameDescription,
}: GetNewCharacterPromptData) =>
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a new character for the game (game description provided below between` +
  `""") in ${language} language. ` +
  `Output must be in json format like ` +
  `{name: "Character name",Q description: "Character description"}. ` +
  `Character description should not be longer than 500 characters. ` +
  `Character descrpition ` +
  markdownRules +
  ` ` +
  `Describe a character's appearance, race (based on any provided in the game` +
  `description, or invent your own, but it should fit in the game world),` +
  `personality, background, etc. ` +
  `Character can have some items, skills, spells, etc.\n\n` +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n`;

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
    throw new Error('No text in response');
  }

  return text;
};

export const getNewCharacter = async ({
  gameDescription,
}: {
  gameDescription: string;
}) => {
  const message = addSystemContext(
    getNewCharacterPrompt({ gameDescription, language: Language.Ru }),
  );
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error('No text in response');
  }

  return JSON.parse(text) as { description: string; name: string };
};

/**
 * Make a new game name based on description.
 *
 * @param description Game description.
 */
export const getNewGameName = async (description: string) => {
  const propmpt = getNewGameNamePrompt(Language.Ru) + `"""${description}"""`;
  const message = addSystemContext(propmpt);
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error('No text in response');
  }

  return text;
};

/**
 * Generate an image based on text provided.
 * Useful to generate any kind of images for games views, characters portraits, etc.
 */
export const getImage = async (text: string) => {
  const response = await openai.createImage({
    prompt: text,
    response_format: 'url',
    size: '1024x1024',
  });
  const { url } = response.data.data[0];
  if (!url) {
    throw new Error('No url in response');
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
