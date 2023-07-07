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
