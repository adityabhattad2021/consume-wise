-- CreateTable
CREATE TABLE "Consumption" (
    "id" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyConsumptionAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalConsumedCalories" DOUBLE PRECISION NOT NULL,
    "totalConsumedProducts" INTEGER NOT NULL,
    "majorCategories" TEXT[],
    "totalNutrients" JSONB NOT NULL,
    "aiAnalysis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyConsumptionAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Consumption_userId_productId_idx" ON "Consumption"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Consumption_userId_productId_key" ON "Consumption"("userId", "productId");

-- CreateIndex
CREATE INDEX "WeeklyConsumptionAnalysis_userId_idx" ON "WeeklyConsumptionAnalysis"("userId");

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyConsumptionAnalysis" ADD CONSTRAINT "WeeklyConsumptionAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
