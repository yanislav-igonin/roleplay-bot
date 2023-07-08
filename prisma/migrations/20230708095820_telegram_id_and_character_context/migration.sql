/*
  Warnings:

  - You are about to drop the column `userId` on the `contexts` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[telegramId]` on the table `contexts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telegramId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `characters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `characterId` to the `contexts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramId` to the `contexts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `createdByUserId` on the `games` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `telegramId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "characters" DROP CONSTRAINT "characters_userId_fkey";

-- DropForeignKey
ALTER TABLE "contexts" DROP CONSTRAINT "contexts_userId_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "characters" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "contexts" DROP COLUMN "userId",
ADD COLUMN     "characterId" INTEGER NOT NULL,
ADD COLUMN     "telegramId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "games" DROP COLUMN "createdByUserId",
ADD COLUMN     "createdByUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "telegramId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "contexts_telegramId_key" ON "contexts"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegramId_key" ON "users"("telegramId");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contexts" ADD CONSTRAINT "contexts_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
