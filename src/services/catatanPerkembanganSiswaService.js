import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
  sendNotificationToUsers,
} from "./notifikasiService.js";

const prisma = new PrismaClient();

export const createCatatan = async (data, nama) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const cttn = await tx.catatanPerkembanganSiswa.create({
        data: {
          idKelas: data.idKelas,
          idSiswa: data.idSiswa,
          content: data.content,
          kategori: data.kategori,
          namaGuru: nama,
          time: new Date(),
        },
      });

      const kelas = await tx.kelas.findUnique({
        where: { id: data.idKelas },
        select: {
          idGuru: true,
          id: true,
          nama: true,
        },
      });

      if (!cttn || !kelas) return cttn;

      // 🔔 PUSH NOTIFICATION (personal)
      await sendNotificationToUsers([cttn.idSiswa], {
        title: "📝 Catatan Perkembangan",
        body: `Ada catatan baru dari ${nama}`,
        icon: "/icons/icon-192.png",
        data: {
          url: "/siswa/catatan-perkembangan",
        },
      });

      // 🗂️ DB NOTIFICATION (1 record)
      await createNotifikasi({
        idSiswa: cttn.idSiswa,
        idTerkait: cttn.id,
        kategori: "Catatan Siswa",
        createdBy: kelas.idGuru,
        idKelas: kelas.id,
        redirectSiswa: "/siswa/catatan-perkembangan",
        keterangan: `Catatan baru dari ${nama}`,
      });

      return cttn;
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getAllCatatan = async () => {
  try {
    return await prisma.catatanPerkembanganSiswa.findMany({
      include: { Kelas: true, Siswa: true },
      orderBy: { time: "desc" },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllCatataByIdKelasDanIdSiswa = async (idSiswa) => {
  try {
    return await prisma.catatanPerkembanganSiswa.findMany({
      where: {
        idSiswa,
      },
      include: { Kelas: true },
      orderBy: { time: "desc" },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getCatatanById = async (id) => {
  try {
    return await prisma.catatanPerkembanganSiswa.findUnique({
      where: { id },
      include: { Kelas: true, Siswa: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getCatatanByIdKelas = async (idKelas) => {
  try {
    const data = await prisma.catatanPerkembanganSiswa.findMany({
      where: { idKelas },
      include: {
        Kelas: true,
        Siswa: true,
      },
      orderBy: { time: "desc" },
    });

    return data.map((item) => ({
      id: item.id,
      idKelas: item.idKelas,
      idSiswa: item.idSiswa,
      kategori: item.kategori,
      content: item.content,
      time: item.time,
      kelasNama: item.Kelas?.nama || null,
      siswaNama: item.Siswa?.nama || null,
      nis: item.Siswa?.nis || null,
    }));
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateCatatan = async (id, data) => {
  try {
    await deleteNotifikasiByIdTerkait(id);
    const cttn = await prisma.catatanPerkembanganSiswa.update({
      where: { id },
      data,
    });

    const kelas = await prisma.kelas.findUnique({
      where: {
        id: data.idKelas,
      },
      select: {
        nama: true,
        idGuru: true,
        id: true,
      },
    });

    if (cttn) {
      await createNotifikasi({
        idSiswa: cttn.idSiswa,
        idTerkait: cttn.id,
        kategori: "Catatan Siswa",
        createdBy: kelas.idGuru,
        idKelas: kelas.id,
        redirectSiswa: "/siswa/catatan-perkembangan-siswa",
        keterangan: `Catatan baru untukmu`,
      });
    }
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteCatatan = async (id) => {
  try {
    await deleteNotifikasiByIdTerkait(id);
    return await prisma.catatanPerkembanganSiswa.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
