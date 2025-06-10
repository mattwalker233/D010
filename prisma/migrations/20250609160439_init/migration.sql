-- CreateTable
CREATE TABLE "DivisionOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "county" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_process',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Well" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "divisionOrderId" TEXT NOT NULL,
    "wellName" TEXT NOT NULL,
    "propertyDescription" TEXT NOT NULL,
    "decimalInterest" REAL NOT NULL,
    CONSTRAINT "Well_divisionOrderId_fkey" FOREIGN KEY ("divisionOrderId") REFERENCES "DivisionOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Well_divisionOrderId_idx" ON "Well"("divisionOrderId");
