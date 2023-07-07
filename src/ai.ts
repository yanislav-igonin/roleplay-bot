import { replies } from './replies';
import { config } from '@/config';
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

const gameRules =
  `Each time players try to do something game master` +
  `(GM) will roll a d20 dice for this action. ` +
  `Every result equals orhigher than 10 is a success. ` +
  `If the result is lower than 10 it's a failure. `;
const gameMasterPromt =
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons ` +
  `roleplay game but with a simplier rules.`;

const newGameDescriptionPrompt =
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons ` +
  `roleplay game but with a simplier rules. ` +
  `Your task is to make a quest for a new game.` +
  `You can use any fantasy setting you want. ` +
  `Describe a world and its inhabitants. ` +
  `Describe a quest that players will have to complete. ` +
  `Describe a reward for completing the quest. ` +
  `Describe a punishment for failing the quest. ` +
  `All description should not be longer than 1000 characters. `;

const newGameNamePrompt =
  `You're a game master. ` +
  `You're in charge of a game that is similar to Dungeon and Dragons. ` +
  `Make a short name for a new game based on the description provided between """ below:\n\n`;

/**
 * Make a new game description.
 */
export const getNewGameDescription = async () => {
  const message = addSystemContext(newGameDescriptionPrompt);
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

/**
 * Make a new game name based on description.
 *
 * @param description Game description.
 */
export const getNewGameName = async (description: string) => {
  const propmpt = newGameNamePrompt + `"""${description}"""`;
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
  return text?.trim() ?? replies.error;
};
