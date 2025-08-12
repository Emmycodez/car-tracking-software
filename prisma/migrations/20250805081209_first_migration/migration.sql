-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "phone" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fleet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Fleet" ADD CONSTRAINT "Fleet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
