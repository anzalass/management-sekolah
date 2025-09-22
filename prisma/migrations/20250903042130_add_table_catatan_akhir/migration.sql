-- CreateTable
CREATE TABLE "CatatanAkhirSiswa" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT,
    "idSiswa" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "CatatanAkhirSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CatatanAkhirSiswa_idSiswa_idKelasMapel_key" ON "CatatanAkhirSiswa"("idSiswa", "idKelasMapel");

-- AddForeignKey
ALTER TABLE "CatatanAkhirSiswa" ADD CONSTRAINT "CatatanAkhirSiswa_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatatanAkhirSiswa" ADD CONSTRAINT "CatatanAkhirSiswa_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
