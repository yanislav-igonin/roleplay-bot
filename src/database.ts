import { PrismaClient } from '@prisma/client';

export { type User } from '@prisma/client';

export const database = new PrismaClient();
export const {
  user: userModel,
  context: contextModel,
  game: gameModel,
  // item: itemModel,
  character: characterModel,
} = database;
