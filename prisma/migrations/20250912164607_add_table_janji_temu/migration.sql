-- CreateTable
CREATE TABLE "JanjiTemu" (
    "id" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idGuru" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "JanjiTemu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JanjiTemu" ADD CONSTRAINT "JanjiTemu_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JanjiTemu" ADD CONSTRAINT "JanjiTemu_idGuru_fkey" FOREIGN KEY ("idGuru") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
