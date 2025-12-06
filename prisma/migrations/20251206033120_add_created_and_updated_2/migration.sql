-- AlterTable
ALTER TABLE "Buku_Perpustakaan" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CatatanAkhirSiswa" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CatatanPerkembanganSiswa" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Peminjaman_dan_Pengembalian" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PengumumanKelas" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tagihan" ADD COLUMN     "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedOn" TIMESTAMP(3);
