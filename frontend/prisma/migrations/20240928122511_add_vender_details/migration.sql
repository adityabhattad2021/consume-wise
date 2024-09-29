/*
  Warnings:

  - Added the required column `venderName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorProductUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "venderName" TEXT NOT NULL,
ADD COLUMN     "vendorProductUrl" TEXT NOT NULL;
