import { characterModel, gameModel } from './database';
import { getImage, getNewCharacter, getNewGame } from 'ai/ai';
import { type BotContext } from 'context';
import { InputMediaBuilder } from 'grammy';
import { locale } from 'locale';

export const startNewGame = async (context: BotContext) => {
  const { user } = context.state;

  await context.reply(locale.ru.replies.startingNewGame);
  await context.replyWithChatAction('typing');

  const { description: gameDescription, name: gameName } = await getNewGame();
  const game = await gameModel.create({
    data: {
      createdByUserId: user.id,
      description: gameDescription,
      name: gameName,
    },
  });
  const gamePictureUrl = await getImage(gameDescription);

  const { name: characterName, description: characterDescription } =
    await getNewCharacter(gameDescription);
  const character = await characterModel.create({
    data: {
      description: characterDescription,
      gameId: game.id,
      name: characterName,
      userId: user.id,
    },
  });
  const characterPictureUrl = await getImage(characterDescription);

  const gamePictureMediaGroup = InputMediaBuilder.photo(gamePictureUrl, {
    caption: `*${gameName}*\n\n${gameDescription}`,
    parse_mode: 'Markdown',
  });
  const questMessage = await context.replyWithMediaGroup([
    gamePictureMediaGroup,
  ]);

  const characterPictureMediaGroup = InputMediaBuilder.photo(
    characterPictureUrl,
    {
      caption: `*Персонаж*\n\n${character.name}\n\n${character.description}`,
      parse_mode: 'Markdown',
    },
  );
  await context.replyWithMediaGroup([characterPictureMediaGroup], {
    reply_to_message_id: questMessage[0].message_id,
  });
};
