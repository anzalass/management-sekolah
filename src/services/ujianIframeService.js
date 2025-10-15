import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
} from "./notifikasiService.js";
import { getKelasMapelById } from "./kelasMapelService.js";
const prisma = new PrismaClient();

/**
 * Tambah UjianIframe
 */
export const createUjianIframeService = async (data) => {
  try {
    const { idKelasMapel, nama, deadline, iframe } = data;

    const ujian = await prisma.ujianIframe.create({
      data: {
        idKelasMapel,
        nama,
        deadline: new Date(deadline),
        iframe,
      },
    });

    const kelas = await getKelasMapelById(ujian.idKelasMapel);

    await createNotifikasi({
      createdBy: kelas.idGuru,
      idGuru: kelas.idGuru,
      idKelas: ujian.idKelasMapel,
      idSiswa: "",
      kategori: "Ujian",
      keterangan: `Ujian baru ${kelas.namaMapel} telah ditambahkan`,
      redirectGuru: "",
      redirectSiswa: `/siswa/kelas/${kelas.id}/ujian/${ujian.id}`,
      idTerkait: ujian.id,
    });

    return ujian;
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

/**
 * Ambil semua UjianIframe
 */
export const getAllUjianIframeService = async () => {
  try {
    return await prisma.ujianIframe.findMany({
      orderBy: {
        deadline: "asc",
      },
      include: {
        KelasMapel: true, // ikut ambil info kelas mapel
      },
    });
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

/**
 * Ambil UjianIframe by ID
 */
export const getUjianIframeByIdService = async (id) => {
  try {
    return await prisma.ujianIframe.findUnique({
      where: { id },
      include: {
        KelasMapel: true,
      },
    });
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getUjianIframeByIdGuruService = async (id) => {
  try {
    return await prisma.ujianIframe.findUnique({
      where: { id },
      include: {
        SelesaiUjian: {
          include: {
            Siswa: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

/**
 * Ambil UjianIframe by ID KelasMapel
 */
export const getUjianIframeByKelasMapelService = async (idKelasMapel) => {
  try {
    return await prisma.ujianIframe.findMany({
      where: { idKelasMapel },
      orderBy: {
        deadline: "asc",
      },
      include: {
        KelasMapel: true,
      },
    });
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

/**
 * Update UjianIframe
 */
export const updateUjianIframeService = async (id, data) => {
  try {
    const { idKelasMapel, nama, deadline, iframe } = data;

    return await prisma.ujianIframe.update({
      where: { id },
      data: {
        idKelasMapel,
        nama,
        deadline: new Date(deadline),
        iframe,
      },
    });
  } catch (error) {
    throw new Error(`Gagal update ujian: ${error.message}`);
  }
};

/**
 * Hapus UjianIframe
 */
export const deleteUjianIframeService = async (id) => {
  try {
    await prisma.ujianIframe.delete({
      where: { id },
    });
    await deleteNotifikasiByIdTerkait(id);
    return { message: "Ujian berhasil dihapus" };
  } catch (error) {
    throw new Error(`Gagal menghapus ujian: ${error.message}`);
  }
};

export const SelesaiUjianService = async (data, idSiswa) => {
  try {
    const existing = await prisma.selesaiUjian.findFirst({
      where: {
        idSiswa: idSiswa,
        idKelasMapel: data.idKelasMapel,
        idUjianIframe: data.idUjianIframe,
      },
    });

    if (existing && existing?.status === "Sedang Berlangsung") {
      await prisma.selesaiUjian.update({
        where: { id: existing.id },
        data: {
          status: "Selesai",
        },
      });
    }
  } catch (error) {
    throw new Error(`Gagal mengumpulkan ujian: ${error.message}`);
  }
};

export const SedangBerlangsungUjianService = async (data) => {
  try {
    // Cek apakah sudah ada record ujian sebelumnya
    const existing = await prisma.selesaiUjian.findFirst({
      where: {
        idSiswa: data.idSiswa,
        idKelasMapel: data.idKelasMapel,
        idUjianIframe: data.idUjianIframe,
      },
    });

    if (existing && existing?.status === "Sedang Berlangsung") {
      // Kalau sedang berlangsung → update jadi selesai
      await prisma.selesaiUjian.update({
        where: { id: existing.id },
        data: {
          status: "Selesai",
        },
      });
    } else {
      // Kalau status kosong/null → buat baru dengan status Sedang Berlangsung
      await prisma.selesaiUjian.create({
        data: {
          idSiswa: data.idSiswa,
          idKelasMapel: data.idKelasMapel,
          idUjianIframe: data.idUjianIframe,
          status: "Sedang Berlangsung",
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    throw new Error(`Gagal mengumpulkan ujian: ${error.message}`);
  }
};

export const getSelesaiUjian = async (idKelasMapel, idSiswa, idUjianIframe) => {
  try {
    const data = await prisma.selesaiUjian.findFirst({
      where: {
        idKelasMapel: idKelasMapel,
        idSiswa: idSiswa,
        idUjianIframe: idUjianIframe,
      },
    });
    if (data.status === "Selesai") {
      return "Selesai";
    } else {
      return "Belum Selesai";
    }
  } catch (error) {
    throw new Error(`Gagal mengumpulkan ujian: ${error.message}`);
  }
};

export const deleteSelesaiUjianById = async (id) => {
  try {
    await prisma.selesaiUjian.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(`Gagal mengumpulkan ujian: ${error.message}`);
  }
};
