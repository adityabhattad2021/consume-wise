/*
  Warnings:

  - Added the required column `summary` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "summary" TEXT NOT NULL;
