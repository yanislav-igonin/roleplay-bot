import {
  getContextSummaryPrompt,
  getFirstContextPrompt,
  getNewCharacterPrompt,
  getNewGamePrompt,
  getSummaryForImageGenerationPrompt,
  // getTranslateToEnglishPrompt,
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
export const ai = new OpenAI({
  // apiKey: config.grokApiKey,
  // baseURL: 'https://api.x.ai/v1',
  apiKey: config.openAiApiKey,
});

enum Models {
  Dalle3 = 'dall-e-3',
  GPT4O = 'gpt-4o',
  Gpt35Turbo = 'gpt-3.5-turbo',
  Grok2 = 'grok-2-1212',
}

export function addSystemContext(text: string) {
  return {
    content: text,
    role: 'system',
  } as ChatCompletionRequestMessage;
}

export function addAssistantContext(text: string) {
  return {
    content: text,
    role: 'assistant',
  } as ChatCompletionRequestMessage;
}

export function addUserContext(text: string) {
  return {
    content: text,
    role: 'user',
  } as ChatCompletionRequestMessage;
}

export async function getNewGame() {
  const message = addUserContext(getNewGamePrompt());
  const response = await ai.chat.completions.create({
    messages: [message],
    model: Models.GPT4O,
    response_format: { type: 'json_object' },
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
}

export async function getNewCharacter(gameDescription: string) {
  const message = addUserContext(getNewCharacterPrompt(gameDescription));
  const response = await ai.chat.completions.create({
    messages: [message],
    model: Models.GPT4O,
    response_format: { type: 'json_object' },
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
}

export async function getSummaryForImageGeneration(text: string) {
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
}

/**
 * Generate an image based on text provided.
 * Useful to generate any kind of images for games views, characters portraits, etc.
 */
export async function getImage(text: string) {
  const withStyling = `${text}\n\nStyle: Fantasy portrait or landscape\n\n`;
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: withStyling,
    quality: 'hd',
    response_format: 'url',
    size: '1792x1024',
  });
  return response.data[0].url as string;
}

export async function getFirstContext(
  gameDescription: string,
  characterDescription: string
) {
  const message = addUserContext(
    getFirstContextPrompt(gameDescription, characterDescription)
  );
  const response = await ai.chat.completions.create({
    messages: [message],
    model: Models.GPT4O,
    temperature: 0.8,
  });

  const textResponse = response.choices[0].message?.content;
  if (!textResponse) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return textResponse;
}

export async function getContextSummary(context: string) {
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
}

export async function getNextContext(
  messages = [] as ChatCompletionRequestMessage[],
  model = Models.GPT4O
) {
  const response = await ai.chat.completions.create({
    messages,
    model,
  });

  const textResponse = response.choices[0].message?.content;
  if (!textResponse) {
    throw new Error(locale.ru.errors.noTextInResponse);
  }

  return JSON.parse(textResponse) as { actionsRequired: string[]; context: string };
}
