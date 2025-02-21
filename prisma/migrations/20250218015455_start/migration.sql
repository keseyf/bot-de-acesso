-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "username" TEXT,
    "wallet" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
