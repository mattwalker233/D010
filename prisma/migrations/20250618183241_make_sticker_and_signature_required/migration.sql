/*
  Warnings:

  - Made the column `signature` on table `Entity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sticker_info` on table `Entity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Entity" ALTER COLUMN "signature" SET NOT NULL,
ALTER COLUMN "sticker_info" SET NOT NULL;
