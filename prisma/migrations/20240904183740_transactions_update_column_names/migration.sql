/*
  Warnings:

  - You are about to drop the column `destination_fundingId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `source_funding_id` on the `Transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[funding_sourceId]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customer_id]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "destination_fundingId",
DROP COLUMN "source_funding_id";

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_funding_sourceId_key" ON "Accounts"("funding_sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_customer_id_key" ON "Accounts"("customer_id");
