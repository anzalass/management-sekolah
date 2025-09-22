-- CreateTable
CREATE TABLE "JadwalPelajaran" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "namaMapel" TEXT NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,

    CONSTRAINT "JadwalPelajaran_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
