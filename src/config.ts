import { valueOrDefault, valueOrThrow } from '@/values';

/* eslint-disable node/no-process-env */
export const config = {
  adminsUsernames: valueOrDefault(process.env.ADMINS_USERNAMES?.split(','), []),
  botToken: valueOrDefault(process.env.BOT_TOKEN, ''),
  env: valueOrDefault(process.env.ENV, 'development'),
  grokApiKey: valueOrThrow(process.env.GROK_API_KEY, 'GROK_API_KEY is not set'),
  openAiApiKey: valueOrThrow(
    process.env.OPENAI_API_KEY,
    'OPENAI_API_KEY is not set'
  ),
};
/* eslint-enable node/no-process-env */

export const isProduction = () => config.env === 'production';
