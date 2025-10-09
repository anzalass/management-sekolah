// services/janjiTemuService.ts
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
} from "../notifikasiService.js";

const prisma = new PrismaClient();

// CREATE
export const createJanjiTemu = async (data, idSiswa) => {
  try {
    const janjiTemu = await prisma.janjiTemu.create({
      data: {
        deskripsi: data.deskripsi,
        status: "menunggu",
        idGuru: data.idGuru,
        waktu: new Date(data.waktu),
        idSiswa: idSiswa,
      },
    });

    const siswa = await prisma.siswa.findUnique({
      where: {
        id: idSiswa,
      },
      select: {
        nama: true,
      },
    });

    if (janjiTemu) {
      await createNotifikasi({
        idSiswa: janjiTemu.idSiswa,
        kategori: "Janji Temu Siswa",
        idTerkait: janjiTemu.id,
        idGuru: janjiTemu.idGuru,
        redirectGuru: `/mengajar/janji-temu`,
        redirectSiswa: `/siswa/janji-temu`,
        keterangan: `${siswa.nama} mengajukan janji temu`,
        createdBy: janjiTemu.idSiswa,
      });
    }
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// READ - get all
export const getAllJanjiTemu = async () => {
  try {
    return await prisma.janjiTemu.findMany({
      orderBy: { waktu: "desc" },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// READ - get by ID
// READ - get by ID
export const getJanjiTemuById = async (id) => {
  try {
    const data = await prisma.janjiTemu.findUnique({
      where: { id },
      include: {
        Siswa: true,
        Guru: true,
      },
    });

    if (!data) return null;

    return {
      id: data.id,
      waktu: data.waktu,
      status: data.status,
      deskripsi: data.deskripsi,
      siswaId: data.Siswa.id,
      siswaNama: data.Siswa.nama,
      siswaNis: data.Siswa.nis,
      guruId: data.Guru.id,
      guruNama: data.Guru.nama,
      guruNip: data.Guru.nip,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// READ - get by idSiswa
export const getJanjiTemuByIdSiswa = async (idSiswa) => {
  try {
    console.log("ids", idSiswa);

    const data = await prisma.janjiTemu.findMany({
      where: { idSiswa: idSiswa },
      include: {
        Guru: true,
        Siswa: true,
      },
      orderBy: { waktu: "desc" },
    });

    return data.map((jt) => ({
      id: jt.id,
      waktu: jt.waktu,
      status: jt.status,
      deskripsi: jt.deskripsi,
      siswaId: jt.Siswa.id,
      siswaNama: jt.Siswa.nama,
      siswaNis: jt.Siswa.nis,
      guruId: jt.Guru.id,
      guruNama: jt.Guru.nama,
      guruNip: jt.Guru.nip,
    }));
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// READ - get by idGuru
export const getJanjiTemuByIdGuru = async (idGuru) => {
  try {
    const data = await prisma.janjiTemu.findMany({
      where: { idGuru },
      include: {
        Siswa: true,
        Guru: true,
      },
      orderBy: { waktu: "desc" },
    });

    return data.map((jt) => ({
      id: jt.id,
      waktu: jt.waktu,
      status: jt.status,
      deskripsi: jt.deskripsi,
      siswaId: jt.Siswa.id,
      siswaNama: jt.Siswa.nama,
      siswaNis: jt.Siswa.nis,
      guruId: jt.Guru.id,
      guruNama: jt.Guru.nama,
      guruNip: jt.Guru.nip,
    }));
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// UPDATE
export const updateJanjiTemu = async (id, data) => {
  try {
    return await prisma.janjiTemu.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// DELETE
export const deleteJanjiTemu = async (id) => {
  try {
    const janjiTemu = await prisma.janjiTemu.delete({
      where: { id },
    });

    await deleteNotifikasiByIdTerkait(janjiTemu.id);
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateStatusJanjiTemu = async (id, status) => {
  try {
    await deleteNotifikasiByIdTerkait(id);
    const janjiTemu = await prisma.janjiTemu.update({
      where: { id },
      data: {
        status: status,
      },
    });

    const siswa = await prisma.siswa.findUnique({
      where: {
        id: janjiTemu.idSiswa,
      },
      select: {
        nama: true,
      },
    });

    await createNotifikasi({
      idSiswa: janjiTemu.idSiswa,
      kategori: "Janji Temu Siswa",
      idTerkait: janjiTemu.id,
      redirectGuru: `/mengajar/janji-temu`,
      redirectSiswa: `/siswa/janji-temu`,
      keterangan: `${siswa.nama} mengajukan janji temu`,
      createdBy: janjiTemu.idGuru,
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
