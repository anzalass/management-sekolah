// services/janjiTemuService.ts
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utils/errorHandlerPrisma.js";

const prisma = new PrismaClient();

// CREATE
export const createJanjiTemu = async (data, idSiswa) => {
  try {
    return await prisma.janjiTemu.create({
      data: {
        deskripsi: data.deskripsi,
        status: "menunggu",
        idGuru: data.idGuru,
        waktu: new Date(data.waktu),
        idSiswa: idSiswa,
      },
    });
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
    return await prisma.janjiTemu.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateStatusJanjiTemu = async (id, status) => {
  try {
    return await prisma.janjiTemu.update({
      where: { id },
      data: {
        status: status,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
