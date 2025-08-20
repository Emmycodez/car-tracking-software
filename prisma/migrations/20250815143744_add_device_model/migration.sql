-- CreateTable
CREATE TABLE "public"."Device" (
    "id" SERIAL NOT NULL,
    "traccarId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_traccarId_key" ON "public"."Device"("traccarId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_uniqueId_key" ON "public"."Device"("uniqueId");

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
