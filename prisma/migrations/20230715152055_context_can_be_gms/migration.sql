-- DropForeignKey
ALTER TABLE "contexts" DROP CONSTRAINT "contexts_characterId_fkey";

-- AlterTable
ALTER TABLE "contexts" ALTER COLUMN "characterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contexts" ADD CONSTRAINT "contexts_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
