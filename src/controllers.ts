import { characterModel, contextModel, gameModel } from './database';
import {
  addAssistantContext,
  addSystemContext,
  addUserContext,
  getContextSummary,
  getFirstContext,
  getImage,
  getNewCharacter,
  getNewGame,
  getNextContext,
  getSummaryForImageGeneration,
} from 'ai';
import {
  characterGenerationPrompt,
  getUsedLanguagePrompt,
  gmPrompt,
  initialPrompt,
  markdownRules,
  shortReplyPrompt,
} from 'ai/prompts';
import { type BotContext } from 'context';
// import { type Context } from 'grammy';
import { InputMediaBuilder } from 'grammy';
import { type Message, type Update } from 'grammy/types';
import { locale } from 'locale';
// import { replaceNewLines } from 'strings';

const getMessageUniqueId = (message: Message) =>
  `${message.chat.id.toString()}_${message.message_id.toString()}`;

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
    gameDescription
  );
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
    characterDescription
  );
  const characterPictureUrl = await getImage(summarizedCharacterDescription);

  const gamePictureMediaGroup = InputMediaBuilder.photo(gamePictureUrl, {
    caption: `*${gameName}*\n\n${gameDescription}`,
    parse_mode: 'Markdown',
  });
  const questMessage = await context.replyWithMediaGroup([gamePictureMediaGroup]);

  const characterPictureMediaGroup = InputMediaBuilder.photo(characterPictureUrl, {
    caption: `*Персонаж*\n\n${character.name}\n\n${character.description}`,
    parse_mode: 'Markdown',
  });
  await context.replyWithMediaGroup([characterPictureMediaGroup], {
    reply_to_message_id: questMessage[0].message_id,
  });

  const firstContext = await getFirstContext(gameDescription, characterDescription);
  const withBeginning = `${locale.ru.replies.ourQuestBegins}\n\n${firstContext}`;
  const firstContextMessage = await context.reply(withBeginning, {
    parse_mode: 'Markdown',
    reply_to_message_id: questMessage[0].message_id,
  });
  const firstContextSummary = await getContextSummary(firstContext);
  await contextModel.create({
    data: {
      gameId: game.id,
      summary: firstContextSummary,
      telegramId: getMessageUniqueId(firstContextMessage),
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
    where: { telegramId: getMessageUniqueId(messageRepliedOn) },
  });
  if (!previousContext) {
    // If we replied on a message that is not a context message
    throw new Error(locale.ru.errors.somethingWentWrong);
  }

  const game = await gameModel.findUnique({
    where: { id: previousContext.gameId },
  });
  if (!game) {
    // Thats strange shit, 99% just a typecheck
    throw new Error(locale.ru.errors.somethingWentWrong);
  }

  // Now we'll take each time the same created character to simplify the game
  const firstCharacter = await characterModel.findFirst({
    where: { gameId: game.id },
  });
  if (!firstCharacter) {
    // Thats strange shit, 99% just a typecheck
    throw new Error(locale.ru.errors.somethingWentWrong);
  }

  const allContexts = await contextModel.findMany({
    orderBy: { createdAt: 'asc' },
    where: { gameId: game.id },
  });

  const preparedMessages = allContexts.map(({ summary, text, characterId }) => {
    const toAdd = summary ? summary : text;
    if (characterId) return addUserContext(toAdd);
    return addAssistantContext(toAdd);
  });

  preparedMessages.unshift(addSystemContext(getUsedLanguagePrompt()));
  preparedMessages.unshift(
    addSystemContext(`Character description:\n\n${firstCharacter.description}`)
  );
  preparedMessages.unshift(
    addSystemContext(`Game description:\n\n${game.description}`)
  );
  preparedMessages.unshift(addSystemContext(markdownRules));
  preparedMessages.unshift(addSystemContext(shortReplyPrompt));
  preparedMessages.unshift(addSystemContext(gmPrompt));

  await botContext.replyWithChatAction('typing');

  await contextModel.create({
    data: {
      characterId: firstCharacter.id,
      gameId: game.id,
      summary: messageText,
      telegramId: getMessageUniqueId(botContext.message!),
      text: messageText as string,
    },
  });
  const userMessage = addUserContext(messageText as string);
  preparedMessages.push(userMessage);
  preparedMessages.push(addSystemContext(getUsedLanguagePrompt()));

  const nextContext = await getNextContext(preparedMessages);
  const nextContextSummary = await getContextSummary(nextContext);

  const newTelegramMessage = await botContext.reply(nextContext, {
    parse_mode: 'Markdown',
    reply_to_message_id: messageRepliedOn.message_id,
  });
  await contextModel.create({
    data: {
      gameId: game.id,
      summary: nextContextSummary,
      telegramId: getMessageUniqueId(newTelegramMessage),
      text: nextContext,
    },
  });
};
