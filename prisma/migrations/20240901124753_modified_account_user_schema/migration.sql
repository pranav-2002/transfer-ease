/*
  Warnings:

  - You are about to drop the column `fundingSourceId` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(100)`.
  - Added the required column `account_id` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_name` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_official_name` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_type` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `available_balance` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_balance` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funding_sourceId` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `holder_category` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iso_currency_code` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ssn` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "fundingSourceId",
DROP COLUMN "item_id",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "account_name" TEXT NOT NULL,
ADD COLUMN     "account_official_name" TEXT NOT NULL,
ADD COLUMN     "account_type" TEXT NOT NULL,
ADD COLUMN     "available_balance" INTEGER NOT NULL,
ADD COLUMN     "current_balance" INTEGER NOT NULL,
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "funding_sourceId" TEXT NOT NULL,
ADD COLUMN     "holder_category" TEXT NOT NULL,
ADD COLUMN     "iso_currency_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "address" CHAR(200) NOT NULL,
ADD COLUMN     "city" CHAR(15) NOT NULL,
ADD COLUMN     "dateOfBirth" CHAR(10) NOT NULL,
ADD COLUMN     "first_name" CHAR(50) NOT NULL,
ADD COLUMN     "last_name" CHAR(50) NOT NULL,
ADD COLUMN     "postalCode" CHAR(5) NOT NULL,
ADD COLUMN     "ssn" CHAR(4) NOT NULL,
ADD COLUMN     "state" CHAR(2) NOT NULL,
ALTER COLUMN "password" SET DATA TYPE CHAR(100);
