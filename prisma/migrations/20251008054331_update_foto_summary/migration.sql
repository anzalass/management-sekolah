-- CreateTable
CREATE TABLE "FotoSummaryMateri" (
    "id" TEXT NOT NULL,
    "idSummaryMateri" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "idMateri" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "fotoId" TEXT NOT NULL,

    CONSTRAINT "FotoSummaryMateri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoSummaryTugas" (
    "id" TEXT NOT NULL,
    "idSummaryTugas" TEXT NOT NULL,
    "idSiswa" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "idTugas" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "fotoId" TEXT NOT NULL,

    CONSTRAINT "FotoSummaryTugas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FotoSummaryMateri" ADD CONSTRAINT "FotoSummaryMateri_idSummaryMateri_fkey" FOREIGN KEY ("idSummaryMateri") REFERENCES "SummaryMateri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryMateri" ADD CONSTRAINT "FotoSummaryMateri_idMateri_fkey" FOREIGN KEY ("idMateri") REFERENCES "MateriMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryMateri" ADD CONSTRAINT "FotoSummaryMateri_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryTugas" ADD CONSTRAINT "FotoSummaryTugas_idSummaryTugas_fkey" FOREIGN KEY ("idSummaryTugas") REFERENCES "SummaryTugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryTugas" ADD CONSTRAINT "FotoSummaryTugas_idTugas_fkey" FOREIGN KEY ("idTugas") REFERENCES "TugasMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoSummaryTugas" ADD CONSTRAINT "FotoSummaryTugas_idSiswa_fkey" FOREIGN KEY ("idSiswa") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
