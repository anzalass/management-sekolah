-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);
