import { characterModel, contextModel, gameModel } from './database';
import { logger } from './logger';
import {
  addAssistantContext,
  addSystemContext,
  addUserContext,
  getFirstContext,
  getImage,
  getNewCharacter,
  getNewGame,
  getNextContext,
  getSummaryForImageGeneration,
} from 'ai';
import {
  getDiceResultPrompt,
  getUsedLanguagePrompt,
  gmPrompt,
  markdownRules,
  rulesPrompt,
  shortReplyPrompt,
} from 'ai/prompts';
import { type BotContext } from 'context';
import { d20 } from 'dice';
import { InputMediaBuilder } from 'grammy';
import { type Message, type Update } from 'grammy/types';
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
      gameId: game.id,
      telegramId: firstContextMessage.message_id.toString(),
      text: firstContext,
    },
  });
};

export const reply = async (botContext: BotContext) => {
  const {
    message_id: messageId,
    reply_to_message: messageRepliedOn,
    text: messageText,
  } = botContext.message as Message & Update.NonChannel;
  const botId = botContext.me.id;

  const notReply = messageRepliedOn === undefined;
  const repliedOnBotsMessage = messageRepliedOn?.from?.id === botId;
  const repliedOnOthersMessage = !repliedOnBotsMessage;

  if (notReply) {
    // Do not do anything if message is not a reply
    return;
  }

  if (repliedOnOthersMessage) {
    // Do not do anything if message is a reply to a message from another user
    return;
  }

  const previousContext = await contextModel.findUnique({
    where: { telegramId: messageRepliedOn.message_id.toString() },
  });
  if (!previousContext) {
    // If we replied on a message that is not a context message
    // TODO: add a reply that this message is not a context message or something like that
    throw new Error(locale.ru.errors.somethingWentWrong);
  }

  const game = await gameModel.findUnique({
    where: { id: previousContext.gameId },
  });
  if (!game) {
    // Thats strange shit, 99% just a typecheck
    // TODO: add a reply that this message is game message or something like that
    throw new Error(locale.ru.errors.somethingWentWrong);
  }

  // Now we'll take each time the same created character to simplify the game
  // TODO: make different characters for different users
  const firstCharacter = await characterModel.findFirst({
    where: { gameId: game.id },
  });
  if (!firstCharacter) {
    // Thats strange shit, 99% just a typecheck
    // TODO: add a reply that this message is game message or something like that
    throw new Error(locale.ru.errors.somethingWentWrong);
  }

  const allContexts = await contextModel.findMany({
    orderBy: { createdAt: 'asc' },
    where: { gameId: game.id },
  });

  const preparedMessages = allContexts.map((context) => {
    if (context.characterId) return addUserContext(context.text);
    return addAssistantContext(context.text);
  });

  preparedMessages.unshift(addSystemContext(getUsedLanguagePrompt()));
  preparedMessages.unshift(
    addAssistantContext(
      `Character description:\n\n${firstCharacter.description}`,
    ),
  );
  preparedMessages.unshift(
    addAssistantContext(`Game description:\n\n${game.description}`),
  );
  preparedMessages.unshift(addAssistantContext(markdownRules));
  preparedMessages.unshift(addAssistantContext(shortReplyPrompt));
  preparedMessages.unshift(addAssistantContext(rulesPrompt));
  preparedMessages.unshift(addAssistantContext(gmPrompt));

  await botContext.reply(locale.ru.replies.diceRoll);
  const diceResult = d20();
  await botContext.reply(`${locale.ru.replies.diceResult}${diceResult}`);
  const diceResultText = getDiceResultPrompt(diceResult);

  await botContext.replyWithChatAction('typing');

  const fullUserMessageText = messageText + `\n\n` + diceResultText;
  await contextModel.create({
    data: {
      characterId: firstCharacter.id,
      gameId: game.id,
      telegramId: messageId.toString(),
      text: messageText as string, // Type pin
    },
  });
  const userMessage = addUserContext(fullUserMessageText);
  preparedMessages.push(userMessage);

  const nextContext = await getNextContext(preparedMessages);

  const newTelegramMessage = await botContext.reply(nextContext, {
    parse_mode: 'Markdown',
    reply_to_message_id: messageRepliedOn.message_id,
  });
  await contextModel.create({
    data: {
      gameId: game.id,
      telegramId: newTelegramMessage.message_id.toString(),
      text: nextContext,
    },
  });
};
