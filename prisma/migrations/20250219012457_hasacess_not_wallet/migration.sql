/*
  Warnings:

  - You are about to drop the column `wallet` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "wallet",
ADD COLUMN     "access" TEXT NOT NULL DEFAULT 'restricted';
