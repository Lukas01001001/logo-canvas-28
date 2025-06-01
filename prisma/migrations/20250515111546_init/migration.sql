-- CreateTable
CREATE TABLE "Industry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "logoBlob" BYTEA,
    "logoType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "industryId" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
