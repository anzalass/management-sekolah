-- CreateTable
CREATE TABLE "UjianIframe" (
    "id" TEXT NOT NULL,
    "idKelasMapel" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "iframe" TEXT NOT NULL,

    CONSTRAINT "UjianIframe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UjianIframe" ADD CONSTRAINT "UjianIframe_idKelasMapel_fkey" FOREIGN KEY ("idKelasMapel") REFERENCES "KelasDanMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
