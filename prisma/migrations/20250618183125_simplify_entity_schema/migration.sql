/*
  Warnings:

  - You are about to drop the column `address` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `printed_name` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `tax_id` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `witness_name` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `witness_signature` on the `Entity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "notes",
DROP COLUMN "phone",
DROP COLUMN "printed_name",
DROP COLUMN "tax_id",
DROP COLUMN "witness_name",
DROP COLUMN "witness_signature";
