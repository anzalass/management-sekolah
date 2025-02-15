-- CreateTable
CREATE TABLE "Kehadiran_Guru_Dan_Staff" (
    "id" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kehadiran_Guru_Dan_Staff_pkey" PRIMARY KEY ("id")
);
