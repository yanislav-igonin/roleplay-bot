import { characterModel, contextModel, gameModel } from './database';
import { logger } from './logger';
import {
  getFirstContext,
  getImage,
  getNewCharacter,
  getNewGame,
  getSummaryForImageGeneration,
} from 'ai';
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
  const summarizedGameDescription = await getSummaryForImageGeneration(
    gameDescription,
  );
  logger.info(summarizedGameDescription);
  const gamePictureUrl = await getImage(summarizedGameDescription);

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
  const summarizedCharacterDescription = await getSummaryForImageGeneration(
    characterDescription,
  );
  logger.info(summarizedCharacterDescription);
  const characterPictureUrl = await getImage(summarizedCharacterDescription);

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

  const firstContext = await getFirstContext(
    gameDescription,
    characterDescription,
  );
  const withBeginning = `${locale.ru.replies.ourQuestBegins}\n\n${firstContext}`;
  const firstContextMessage = await context.reply(withBeginning, {
    parse_mode: 'Markdown',
    reply_to_message_id: questMessage[0].message_id,
  });
  await contextModel.create({
    data: {
      characterId: character.id,
      gameId: game.id,
      telegramId: firstContextMessage.message_id.toString(),
    },
  });
};
