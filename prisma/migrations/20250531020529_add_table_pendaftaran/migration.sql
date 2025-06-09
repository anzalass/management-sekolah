-- CreateTable
CREATE TABLE "PendaftaranSiswa" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "yourLocation" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "PendaftaranSiswa_pkey" PRIMARY KEY ("id")
);
