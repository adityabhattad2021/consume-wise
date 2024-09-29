-- DropIndex
DROP INDEX "WeeklyConsumptionAnalysis_userId_idx";

-- CreateIndex
CREATE INDEX "WeeklyConsumptionAnalysis_userId_createdAt_idx" ON "WeeklyConsumptionAnalysis"("userId", "createdAt");
