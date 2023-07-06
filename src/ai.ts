import { replies } from './replies';
import { config } from '@/config';
import { type ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: config.openAiApiKey,
});
export const openai = new OpenAIApi(configuration);

export const addUserContext = (text: string): ChatCompletionRequestMessage => {
  return {
    content: text,
    role: 'user',
  };
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
