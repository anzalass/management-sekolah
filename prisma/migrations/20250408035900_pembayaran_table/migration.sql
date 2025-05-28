-- CreateTable
CREATE TABLE "Tagihan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "jatuhTempo" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,

    CONSTRAINT "Tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPembayaran" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "idTagihan" TEXT NOT NULL,
    "waktuBayar" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiwayatPembayaran_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tagihan" ADD CONSTRAINT "Tagihan_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembayaran" ADD CONSTRAINT "RiwayatPembayaran_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Siswa"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;
