/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,createdAt]` on the table `Consumption` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Consumption_userId_productId_idx";

-- DropIndex
DROP INDEX "Consumption_userId_productId_key";

-- CreateIndex
CREATE INDEX "Consumption_userId_productId_createdAt_idx" ON "Consumption"("userId", "productId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Consumption_userId_productId_createdAt_key" ON "Consumption"("userId", "productId", "createdAt");
