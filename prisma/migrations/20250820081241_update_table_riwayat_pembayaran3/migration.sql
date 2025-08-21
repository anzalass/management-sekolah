-- AddForeignKey
ALTER TABLE "RiwayatPembayaran" ADD CONSTRAINT "RiwayatPembayaran_idTagihan_fkey" FOREIGN KEY ("idTagihan") REFERENCES "Tagihan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
