/*
  Warnings:

  - You are about to drop the `UserRecommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "DietaryPreference" ADD VALUE 'NON_VEGETARIAN';

-- DropForeignKey
ALTER TABLE "UserRecommendation" DROP CONSTRAINT "UserRecommendation_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecommendation" DROP CONSTRAINT "UserRecommendation_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dailyCalorieNeeds" DROP NOT NULL;

-- DropTable
DROP TABLE "UserRecommendation";

-- CreateTable
CREATE TABLE "PersonalizedOverview" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "overview" TEXT,
    "matchScore" INTEGER,
    "suitabilityReasons" JSONB[],
    "safeConsumptionGuideline" JSONB NOT NULL,
    "healthGoalImpacts" JSONB[],
    "nutrientHighlights" JSONB[],

    CONSTRAINT "PersonalizedOverview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PersonalizedOverview_userId_productId_idx" ON "PersonalizedOverview"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalizedOverview_userId_productId_key" ON "PersonalizedOverview"("userId", "productId");

-- AddForeignKey
ALTER TABLE "PersonalizedOverview" ADD CONSTRAINT "PersonalizedOverview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizedOverview" ADD CONSTRAINT "PersonalizedOverview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
