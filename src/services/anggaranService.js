import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAnggaran = async (data) => {
  const { nama, keterangan, time, status, jumlah } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.riwayatAnggaran.create({
        data: { nama, keterangan, time, status },
      });

      const kasSekolah = await tx.sekolah.findFirst({
        select: { kas: true },
      });

      if (status === "pemasukan") {
        await tx.sekolah.update({
          where: { id: idSekolah },
          data: {
            kas: kasSekolah + jumlah,
          },
        });
      } else if (status === "pengeluaran") {
        await tx.sekolah.update({
          where: { id: idSekolah },
          data: {
            kas: kasSekolah - jumlah,
          },
        });
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAnggaran = async (idAnggaran, data) => {
  const { nama, keterangan, time, status, jumlah } = data;

  try {
    await prisma.$transaction(async (tx) => {
      // Ambil data sekolah dan riwayat anggaran
      const sekolah = await tx.sekolah.findFirst({
        select: { kas: true },
      });

      if (!sekolah) throw new Error("Sekolah tidak ditemukan");

      const riwayatAnggaran = await tx.riwayatAnggaran.findUnique({
        where: { id: idAnggaran },
        select: { jumlah: true, status: true },
      });
      if (!riwayatAnggaran) throw new Error("Riwayat anggaran tidak ditemukan");

      let kasBaru = sekolah.kas;

      // 1. Balikkan kas sekolah sesuai dengan status dan jumlah anggaran sebelumnya
      if (riwayatAnggaran.status === "pemasukan") {
        kasBaru -= riwayatAnggaran.jumlah;
      } else {
        kasBaru += riwayatAnggaran.jumlah;
      }

      // 2. Update kas sekolah sesuai dengan status dan jumlah baru
      if (status === "pemasukan") {
        kasBaru += jumlah;
      } else {
        kasBaru -= jumlah;
      }

      // 3. Cek apakah kas mencukupi
      if (kasBaru < 0) throw new Error("Kas sekolah tidak mencukupi");

      // 4. Update data riwayat anggaran dan kas sekolah
      await tx.riwayatAnggaran.update({
        where: { id: idAnggaran },
        data: { nama, keterangan, time, status, jumlah },
      });

      await tx.sekolah.update({
        where: { id: idSekolah },
        data: { kas: kasBaru },
      });
    });

    return { message: "Anggaran berhasil diperbarui" };
  } catch (error) {
    console.error("Error updating anggaran:", error);
    throw new Error(
      error.message || "Terjadi kesalahan saat memperbarui anggaran"
    );
  }
};

export const deleteAnggaran = async (idAnggaran) => {
  try {
    await prisma.$transaction(async (tx) => {
      const sekolah = await tx.sekolah.findFirst({
        select: { kas: true },
      });

      if (!sekolah) throw new Error("Sekolah not found");

      const anggaran = await tx.riwayatAnggaran.findUnique({
        where: { idAnggaran },
        select: { jumlah: true, status: true },
      });

      if (!anggaran) throw new Error("Anggaran not found");
      let kasBaru = sekolah.kas;

      if (anggaran.status === "pemasukan") {
        kasBaru -= anggaran.jumlah;
      } else {
        kasBaru += anggaran.jumlah;
      }

      await tx.riwayatAnggaran.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAnggaranById = async (id) => {
  const anggaran = await prisma.anggaran.findUnique({ where: { id } });
  if (!anggaran) {
    throw new Error("Anggaran not found");
  }
  return anggaran;
};
