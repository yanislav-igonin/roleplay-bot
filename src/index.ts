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
import { startNewGame } from 'controllers';
import { Bot } from 'grammy';
import { locale } from 'locale';

const menus = {
  // @ts-expect-error Argument of type is not assignable to parameter of type
  start: new Menu('movements').text(locale.ru.buttons.newGame, startNewGame),
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

// bot.on('message:text', async (context) => {
//   const text = context.message.text;
//   const { message_id: replyToMessageId } = context.message;

//   try {
//     const message = `Echo: ${text}`;
//     // await context.reply(message, { reply_to_message_id: replyToMessageId });
//   } catch (error) {
//     await context.reply(replies.error);
//     throw error;
//   }
// });

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
