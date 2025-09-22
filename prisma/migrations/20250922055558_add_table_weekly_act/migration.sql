-- CreateTable
CREATE TABLE "WeeklyActivity" (
    "id" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoWeeklyActivity" (
    "id" TEXT NOT NULL,
    "idWeeklyActivity" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "fotoId" TEXT NOT NULL,

    CONSTRAINT "FotoWeeklyActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeeklyActivity" ADD CONSTRAINT "WeeklyActivity_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoWeeklyActivity" ADD CONSTRAINT "FotoWeeklyActivity_idWeeklyActivity_fkey" FOREIGN KEY ("idWeeklyActivity") REFERENCES "WeeklyActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
