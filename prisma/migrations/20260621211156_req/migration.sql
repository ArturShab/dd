-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "organization" TEXT,
    "address" TEXT,
    "list" TEXT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
