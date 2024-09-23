/*
  Warnings:

  - Added the required column `healthScore` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutritionDensity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bmr` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyCalorieNeeds` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "functionalBenefits" TEXT[],
ADD COLUMN     "healthScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "notSuitableFor" "HealthDetail"[],
ADD COLUMN     "nutritionDensity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "suitableFor" "HealthDetail"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bmr" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dailyCalorieNeeds" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "MacroNutrientRatio" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MacroNutrientRatio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroNutrientNeed" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nutrient" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "MicroNutrientNeed_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "MacroNutrientRatio_userId_key" ON "MacroNutrientRatio"("userId");

-- AddForeignKey
ALTER TABLE "MacroNutrientRatio" ADD CONSTRAINT "MacroNutrientRatio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroNutrientNeed" ADD CONSTRAINT "MicroNutrientNeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendation" ADD CONSTRAINT "UserRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecommendation" ADD CONSTRAINT "UserRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
