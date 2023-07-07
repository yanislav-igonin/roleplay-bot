import { gameModel } from './database';
import { getNewGameDescription, getNewGameName } from 'ai';
import { type BotContext } from 'context';
import { locale } from 'locale';

export const startNewGame = async (context: BotContext) => {
  const { user } = context.state;
  await context.reply(locale.ru.replies.startingNewGame);
  await context.replyWithChatAction('typing');
  const description = await getNewGameDescription();
  const name = await getNewGameName(description);
  await gameModel.create({
    data: { createdByUserId: user.id, description, name },
  });
  await context.reply(`**${name}**\n\n${description}`, {
    parse_mode: 'MarkdownV2',
  });
};
