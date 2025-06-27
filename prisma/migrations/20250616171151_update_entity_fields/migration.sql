/*
  Warnings:

  - You are about to drop the column `county` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveDate` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `operator` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `DivisionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `decimalInterest` on the `Well` table. All the data in the column will be lost.
  - You are about to drop the column `divisionOrderId` on the `Well` table. All the data in the column will be lost.
  - You are about to drop the column `propertyDescription` on the `Well` table. All the data in the column will be lost.
  - You are about to drop the column `wellName` on the `Well` table. All the data in the column will be lost.
  - Made the column `entityId` on table `DivisionOrder` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `entity_name` to the `Entity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printed_name` to the `Entity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Well` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Well` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DivisionOrder" DROP CONSTRAINT "DivisionOrder_entityId_fkey";

-- DropForeignKey
ALTER TABLE "Well" DROP CONSTRAINT "Well_divisionOrderId_fkey";

-- DropIndex
DROP INDEX "DivisionOrder_entityId_idx";

-- DropIndex
DROP INDEX "Entity_name_key";

-- DropIndex
DROP INDEX "Well_divisionOrderId_idx";

-- AlterTable
ALTER TABLE "DivisionOrder" DROP COLUMN "county",
DROP COLUMN "effectiveDate",
DROP COLUMN "entityName",
DROP COLUMN "notes",
DROP COLUMN "operator",
DROP COLUMN "state",
DROP COLUMN "status",
ALTER COLUMN "entityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "city",
DROP COLUMN "name",
DROP COLUMN "notes",
DROP COLUMN "state",
DROP COLUMN "type",
DROP COLUMN "zip",
ADD COLUMN     "entity_name" TEXT NOT NULL,
ADD COLUMN     "printed_name" TEXT NOT NULL,
ADD COLUMN     "signature" TEXT,
ADD COLUMN     "witness_name" TEXT,
ADD COLUMN     "witness_signature" TEXT;

-- AlterTable
ALTER TABLE "Well" DROP COLUMN "decimalInterest",
DROP COLUMN "divisionOrderId",
DROP COLUMN "propertyDescription",
DROP COLUMN "wellName",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "DivisionOrder" ADD CONSTRAINT "DivisionOrder_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
