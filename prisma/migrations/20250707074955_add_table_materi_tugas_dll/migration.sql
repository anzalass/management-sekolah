-- CreateTable
CREATE TABLE "MateriMapel" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "iframeGoogleSlide" TEXT,
    "iframeYoutube" TEXT,

    CONSTRAINT "MateriMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryMateri" (
    "id" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "idMateri" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "SummaryMateri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TugasMapel" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "iframeGoogleSlide" TEXT,
    "iframeYoutube" TEXT,

    CONSTRAINT "TugasMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryTugas" (
    "id" TEXT NOT NULL,
    "nisSiswa" TEXT NOT NULL,
    "idTugas" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "SummaryTugas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MateriMapel" ADD CONSTRAINT "MateriMapel_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryMateri" ADD CONSTRAINT "SummaryMateri_idMateri_fkey" FOREIGN KEY ("idMateri") REFERENCES "MateriMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryMateri" ADD CONSTRAINT "SummaryMateri_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasMapel" ADD CONSTRAINT "TugasMapel_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryTugas" ADD CONSTRAINT "SummaryTugas_idTugas_fkey" FOREIGN KEY ("idTugas") REFERENCES "TugasMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryTugas" ADD CONSTRAINT "SummaryTugas_nisSiswa_fkey" FOREIGN KEY ("nisSiswa") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
