/*
  Warnings:

  - Added the required column `text` to the `contexts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contexts" ADD COLUMN     "text" TEXT NOT NULL;
