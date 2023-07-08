import {
  getNewCharacterPrompt,
  getNewGameDescriptionPrompt,
  getNewGameNamePrompt,
} from './prompts';
import { config } from '@/config';
import { Language, locale } from 'locale';
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

export const getNewCharacter = async (gameDescription: string) => {
  const message = addSystemContext(getNewCharacterPrompt(gameDescription));
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
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
    throw new Error(locale.ru.errors.noTextInResponse);
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
