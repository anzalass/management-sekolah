-- Create enum
CREATE TYPE "KeteranganKehadiranSiswa" AS ENUM ('Izin', 'Hadir', 'Sakit', 'TanpaKeterangan');

-- Ubah kolom keterangan jadi nullable dan pakai enum
ALTER TABLE "KehadiranSiswa"
  ALTER COLUMN "keterangan" DROP NOT NULL,
  ALTER COLUMN "keterangan" TYPE "KeteranganKehadiranSiswa"
    USING ("keterangan"::text::"KeteranganKehadiranSiswa");