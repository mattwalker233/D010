-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionOrder" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "entityId" TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_process',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DivisionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Well" (
    "id" TEXT NOT NULL,
    "divisionOrderId" TEXT NOT NULL,
    "wellName" TEXT NOT NULL,
    "propertyDescription" TEXT NOT NULL,
    "decimalInterest" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Well_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entity_name_key" ON "Entity"("name");

-- CreateIndex
CREATE INDEX "DivisionOrder_entityId_idx" ON "DivisionOrder"("entityId");

-- CreateIndex
CREATE INDEX "Well_divisionOrderId_idx" ON "Well"("divisionOrderId");

-- AddForeignKey
ALTER TABLE "DivisionOrder" ADD CONSTRAINT "DivisionOrder_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Well" ADD CONSTRAINT "Well_divisionOrderId_fkey" FOREIGN KEY ("divisionOrderId") REFERENCES "DivisionOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
