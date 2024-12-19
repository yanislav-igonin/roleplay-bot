import {
  getContextSummaryPrompt,
  getFirstContextPrompt,
  getNewCharacterPrompt,
  getNewGamePrompt,
  getSummaryForImageGenerationPrompt,
  getTranslateToEnglishPrompt,
} from './prompts';
import { config } from '@/config';
import { JsonParseError } from 'error';
import { locale } from 'locale';
import { OpenAI } from 'openai';
import { replaceNewLines } from 'strings';

type ChatCompletionRequestMessage =
  OpenAI.Chat.Completions.ChatCompletionMessageParam;

export const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});
export const grok = new OpenAI({
  apiKey: config.grokApiKey,
  baseURL: 'https://api.x.ai/v1',
});

enum Models {
  Dalle3 = 'dall-e-3',
  GPT4O = 'gpt-4-o',
  Gpt35Turbo = 'gpt-3.5-turbo',
  GrokBeta = 'grok-beta',
}

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
  const response = await grok.chat.completions.create({
    messages: [message],
    model: Models.GrokBeta,
    temperature: 0.7,
  });

  const text = response.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  try {
    const replaced = replaceNewLines(text);
    const parsed = JSON.parse(replaced) as {
      description: string;
      name: string;
    };
    return parsed;
  } catch {
    throw new JsonParseError('parsing new game data error', text);
  }
};

export const getNewCharacter = async (gameDescription: string) => {
  const message = addUserContext(getNewCharacterPrompt(gameDescription));
  const response = await grok.chat.completions.create({
    messages: [message],
    model: Models.GrokBeta,
    temperature: 0.7,
  });

  const text = response.choices[0].message?.content;
  if (!text) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  try {
    const replaced = replaceNewLines(text);
    const parsed = JSON.parse(replaced) as {
      description: string;
      name: string;
    };
    return parsed;
  } catch {
    throw new JsonParseError('parsing new character data error', text);
  }
};

export const getSummaryForImageGeneration = async (text: string) => {
  const message = addUserContext(getSummaryForImageGenerationPrompt(text));
  const response = await openai.chat.completions.create({
    messages: [message],
    model: Models.Gpt35Turbo,
  });

  const textResponse = response.choices[0].message?.content;
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
  const withStyling = `${text}\n\nStyle: Fantasy portrait or landscape\n\n`;
  // const translatedText = await translateToEnglish(withStyling);
  // const response = await openai.images.generate({
  //   prompt: withStyling,
  //   response_format: 'url',
  //   size: '512x512',
  // });
  // const { url } = response.choices[];
  // if (!url) {
  //   throw new Error(locale.ru.errors.noImageUrlInResponse);
  // }

  // return url;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: withStyling,
    response_format: 'url',
    // size: '1792x1024',
    size: '512x512',
  });
  return response.data[0].url as string;
};

export const getFirstContext = async (
  gameDescription: string,
  characterDescription: string
) => {
  const message = addUserContext(
    getFirstContextPrompt(gameDescription, characterDescription)
  );
  const response = await grok.chat.completions.create({
    messages: [message],
    model: Models.GrokBeta,
    temperature: 0.8,
  });

  const textResponse = response.choices[0].message?.content;
  if (!textResponse) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return textResponse;
};

export const getContextSummary = async (context: string) => {
  const message = addUserContext(getContextSummaryPrompt(context));
  const response = await openai.chat.completions.create({
    messages: [message],
    model: Models.Gpt35Turbo,
  });

  const textResponse = response.choices[0].message?.content;
  if (!textResponse) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return textResponse;
};

// export const getNextContext = async (
//   messages = [] as ChatCompletionRequestMessage[],
//   model = 'gpt-4o'
// ) => {
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
