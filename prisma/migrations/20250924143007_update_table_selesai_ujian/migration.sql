-- CreateTable
CREATE TABLE "SelesaiUjian" (
    "id" TEXT NOT NULL,
    "idUjianIframe" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "SelesaiUjian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SelesaiUjian_idSiswa_idKelasMapel_idUjianIframe_key" ON "SelesaiUjian"("idSiswa", "idKelasMapel", "idUjianIframe");

-- AddForeignKey
ALTER TABLE "SelesaiUjian" ADD CONSTRAINT "SelesaiUjian_idUjianIframe_fkey" FOREIGN KEY ("idUjianIframe") REFERENCES "UjianIframe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelesaiUjian" ADD CONSTRAINT "SelesaiUjian_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelesaiUjian" ADD CONSTRAINT "SelesaiUjian_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
