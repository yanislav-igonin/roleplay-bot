import { config } from '@/config';
import { database } from '@/database';
import { logger } from '@/logger';
import {
  allowedUserMiddleware,
  errorMiddleware,
  stateMiddleware,
  userMiddleware,
} from '@/middlewares';
import { Menu } from '@grammyjs/menu';
import { type BotContext } from 'context';
import { /* reply, */ startNewGame } from 'controllers';
import { Bot } from 'grammy';
import { locale } from 'locale';

const menus = {
  start: new Menu('start').text(locale.ru.buttons.newGame, startNewGame),
};

const bot = new Bot<BotContext>(config.botToken);
bot.catch(logger.error);
bot.use(stateMiddleware);
bot.use(errorMiddleware);
bot.use(userMiddleware);
bot.use(allowedUserMiddleware);
bot.use(menus.start);

bot.command('start', async (context) => {
  await context.reply(locale.ru.replies.start, { reply_markup: menus.start });
});

bot.command('help', async (context) => {
  await context.reply(locale.ru.replies.help);
});

// bot.on('message:text', reply);

const start = async () => {
  await database.$connect();
  logger.info('database connected');
  // eslint-disable-next-line promise/prefer-await-to-then
  bot.start().catch(async (error) => {
    logger.error(error);
    await database.$disconnect();
  });
};

start()
  .then(() => logger.info('bot started'))
  .catch(logger.error);
