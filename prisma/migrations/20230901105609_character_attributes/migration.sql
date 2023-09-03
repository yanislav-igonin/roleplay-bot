/*
  Warnings:

  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `charisma` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constitution` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dexterity` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intelligence` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strength` to the `characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wisdom` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_characterId_fkey";

-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "charisma" INTEGER NOT NULL,
ADD COLUMN     "constitution" INTEGER NOT NULL,
ADD COLUMN     "dexterity" INTEGER NOT NULL,
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "intelligence" INTEGER NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "strength" INTEGER NOT NULL,
ADD COLUMN     "wisdom" INTEGER NOT NULL;

-- DropTable
DROP TABLE "items";
