/*
  Warnings:

  - Added the required column `destination_user_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_user_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "destination_user_id" INTEGER NOT NULL,
ADD COLUMN     "source_user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_source_user_id_fkey" FOREIGN KEY ("source_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_destination_user_id_fkey" FOREIGN KEY ("destination_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
