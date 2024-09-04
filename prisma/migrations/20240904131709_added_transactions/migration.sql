/*
  Warnings:

  - You are about to drop the column `holder_category` on the `Accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "holder_category";

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "transfer_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "source_funding_id" TEXT NOT NULL,
    "destination_fundingId" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transfer_id_key" ON "Transactions"("transfer_id");
