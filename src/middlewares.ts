import { config } from './config';
import { userModel } from './database';
import { logger } from './logger';
import { valueOrNull } from '@/values';
import { type BotContext } from 'context';
import { type NextFunction } from 'grammy';
// eslint-disable-next-line import/extensions

export const stateMiddleware = async (context: BotContext, next: NextFunction) => {
  // @ts-expect-error Property user   is missing in type {} but required in type
  context.state = {};
  // eslint-disable-next-line node/callback-return
  await next();
};

export const errorMiddleware = async (context: BotContext, next: NextFunction) => {
  try {
    // eslint-disable-next-line node/callback-return
    await next();
  } catch (error) {
    logger.error(error);
    await context.reply((error as Error).message);
  }
};

export const userMiddleware = async (context: BotContext, next: NextFunction) => {
  const { from: user } = context;
  if (!user) {
    // eslint-disable-next-line node/callback-return
    await next();
    return;
  }

  const { id: telegramUserId } = user;

  const databaseUser = await userModel.findUnique({
    where: { telegramId: telegramUserId.toString() },
  });
  if (databaseUser) {
    // eslint-disable-next-line require-atomic-updates
    context.state.user = databaseUser;
    // eslint-disable-next-line node/callback-return
    await next();
    return;
  }

  const {
    first_name: firstName,
    language_code: language,
    last_name: lastName,
    username,
  } = user;

  const toCreate = {
    firstName: valueOrNull(firstName),
    language: valueOrNull(language),
    lastName: valueOrNull(lastName),
    telegramId: telegramUserId.toString(),
    username: valueOrNull(username),
  };

  const newUser = await userModel.create({ data: toCreate });
  // eslint-disable-next-line require-atomic-updates
  context.state.user = newUser;

  // eslint-disable-next-line node/callback-return
  await next();
};

export const allowedUserMiddleware = async (
  context: BotContext,
  next: NextFunction
) => {
  const { isAllowed, username } = context.state.user;
  const { chat } = context;
  const isAdmin = config.adminsUsernames.includes(username ?? '');

  const hasAccess = isAllowed || isAdmin;

  if (!hasAccess && chat?.type === 'private') {
    await context.reply('Access denied');
    return;
  }

  // eslint-disable-next-line node/callback-return
  await next();
};
