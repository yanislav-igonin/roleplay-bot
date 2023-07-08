import {
  getNewCharacterPrompt,
  getNewGamePrompt,
  getTranslateToEnglishPrompt,
} from './prompts';
import { config } from '@/config';
import { logger } from '@/logger';
import { locale } from 'locale';
import { type ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: config.openAiApiKey,
});
export const openai = new OpenAIApi(configuration);

export const addSystemContext = (text: string) => {
  return {
    content: text,
    role: 'system',
  } as ChatCompletionRequestMessage;
};

export const addAssistantContext = (text: string) => {
  return {
    content: text,
    role: 'assistant',
  } as ChatCompletionRequestMessage;
};

export const addUserContext = (text: string) => {
  return {
    content: text,
    role: 'user',
  } as ChatCompletionRequestMessage;
};

export const getNewGame = async () => {
  const message = addUserContext(getNewGamePrompt());
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  try {
    const parsed = JSON.parse(text) as { description: string; name: string };
    return parsed;
  } catch (error) {
    logger.error(
      'parsing new game data error\n',
      'model response:',
      text,
      '\nerror:',
      error,
    );
    throw error;
  }
};

export const getNewCharacter = async (gameDescription: string) => {
  const message = addUserContext(getNewCharacterPrompt(gameDescription));
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-4',
    temperature: 0.7,
  });

  const text = response.data.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  try {
    const parsed = JSON.parse(text) as { description: string; name: string };
    return parsed;
  } catch (error) {
    logger.error(
      'parsing new character data error\n',
      'model response:',
      text,
      '\nerror:',
      error,
    );
    throw error;
  }
};

const translateToEnglish = async (text: string) => {
  const message = addUserContext(getTranslateToEnglishPrompt(text));
  const response = await openai.createChatCompletion({
    messages: [message],
    model: 'gpt-3.5-turbo',
  });

  const textResponse = response.data.choices[0].message?.content;
  if (!textResponse) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return textResponse;
};

/**
 * Generate an image based on text provided.
 * Useful to generate any kind of images for games views, characters portraits, etc.
 */
export const getImage = async (text: string) => {
  const translatedText = await translateToEnglish(text);
  const response = await openai.createImage({
    prompt: translatedText,
    response_format: 'url',
    size: '512x512',
  });
  const { url } = response.data.data[0];
  if (!url) {
    throw new Error(locale.ru.errors.noImageUrlInResponse);
  }

  return url;
};

// export const getAiResponse = async (
//   prompt: string,
//   context: ChatCompletionRequestMessage[] = [],
//   model = 'gpt-4-32k',
// ) => {
//   const userMessage = addUserContext(prompt);
//   const messages = [...context, userMessage];
//   const response = await openai.createChatCompletion({
//     messages,
//     model,
//   });

//   const text = response.data.choices[0].message?.content;
//   if (!text) {
//     throw new Error('No text in response');
//   }

//   return text;
// };
