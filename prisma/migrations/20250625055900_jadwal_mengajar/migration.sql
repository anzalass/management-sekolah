-- CreateTable
CREATE TABLE "jadwalMengajar" (
    "id" TEXT NOT NULL,
    "nipGuru" TEXT NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "ruang" TEXT NOT NULL,

    CONSTRAINT "jadwalMengajar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jadwalMengajar" ADD CONSTRAINT "jadwalMengajar_nipGuru_fkey" FOREIGN KEY ("nipGuru") REFERENCES "Guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
