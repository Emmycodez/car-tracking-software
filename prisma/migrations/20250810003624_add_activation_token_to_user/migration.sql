/*
  Warnings:

  - A unique constraint covering the columns `[accountActivationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "accountActivationToken" TEXT,
ADD COLUMN     "activationTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_accountActivationToken_key" ON "public"."User"("accountActivationToken");
