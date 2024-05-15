-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "components" TEXT,
    "icons" TEXT,
    "code" TEXT,
    "query" TEXT,
    "logs" TEXT,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fail" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "logs" TEXT,

    CONSTRAINT "Fail_pkey" PRIMARY KEY ("id")
);
