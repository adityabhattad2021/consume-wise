/*
  Warnings:

  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `healthGoal` on the `User` table. All the data in the column will be lost.
  - Added the required column `healthScore` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutritionDensity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyCalorieNeeds` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BiologicalSex" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "functionalBenefits" TEXT[],
ADD COLUMN     "healthScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "notSuitableFor" "HealthDetail"[],
ADD COLUMN     "nutritionDensity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "suitableFor" "HealthDetail"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
DROP COLUMN "healthGoal",
ADD COLUMN     "biologicalSex" "BiologicalSex",
ADD COLUMN     "dailyCalorieNeeds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "healthGoals" "HealthGoal"[];

-- DropEnum
DROP TYPE "Gender";

-- CreateTable
CREATE TABLE "UserRecommendation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "reasonString" TEXT[],
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRecommendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRecommendation" ADD CONSTRAINT "UserRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendation" ADD CONSTRAINT "UserRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
