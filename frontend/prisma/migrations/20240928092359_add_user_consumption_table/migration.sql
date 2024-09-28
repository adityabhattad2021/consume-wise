-- CreateTable
CREATE TABLE "Consumption" (
    "id" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Consumption_userId_productId_idx" ON "Consumption"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Consumption_userId_productId_key" ON "Consumption"("userId", "productId");

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
