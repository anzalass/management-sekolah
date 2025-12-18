import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/ImageHandler.js";
import { startOfDay, endOfDay } from "date-fns";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
} from "../notifikasiService.js";
import { getNamaSiswa } from "../userService.js";

const prisma = new PrismaClient();

// ✅ Create (Ajukan Izin)
export const createPerizinanSiswa = async (data) => {
  try {
    let imageUploadResult;

    if (data.bukti && data.bukti.buffer && data.bukti.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(
        data.bukti.buffer,
        "izinsiswa",
        data.idSiswa
      );
    }
    const izin = await prisma.perizinanSiswa.create({
      data: {
        idSiswa: data.idSiswa,
        idKelas: data.idKelas || null,
        keterangan: data.keterangan,
        time: new Date(`${data.time}T00:00:00Z`) || new Date(),
        bukti: imageUploadResult?.secure_url || "",
        bukti_id: imageUploadResult?.public_id || "",
        status: data.status || "menunggu",
      },
    });

    const siswa = await prisma.siswa.findUnique({
      where: {
        id: izin.idSiswa,
      },
      select: {
        nama: true,
      },
    });

    if (izin) {
      await createNotifikasi({
        idSiswa: izin.idSiswa,
        idKelas: izin.idKelas,
        kategori: "Perizinan Siswa",
        idTerkait: izin.id,
        redirectGuru: `/mengajar/walikelas/${izin.idKelas}`,
        redirectSiswa: `/siswa/perizinan`,
        keterangan: `${siswa.nama} mengajukan izin`,
        createdBy: izin.idSiswa,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

// ✅ Read All (list izin)
export const getAllPerizinanSiswa = async (filter = {}) => {
  try {
    return await prisma.perizinanSiswa.findMany({
      where: filter,
      include: {
        Siswa: true,
        Kelas: true,
      },
      orderBy: {
        time: "desc",
      },
    });
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

// ✅ Read by ID
export const getPerizinanSiswaById = async (id) => {
  try {
    return await prisma.perizinanSiswa.findUnique({
      where: { id },
      include: {
        Siswa: true,
        Kelas: true,
      },
    });
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

export const getPerizinanSiswaByIdSiswa = async (idSiswa) => {
  try {
    const izinList = await prisma.perizinanSiswa.findMany({
      where: { idSiswa },
      include: {
        Siswa: true,
        Kelas: true,
      },
    });

    // Flatten hasil
    return izinList.map((izin) => ({
      id: izin.id,
      idSiswa: izin.idSiswa,
      idKelas: izin.idKelas,
      jenis: izin.jenis,
      keterangan: izin.keterangan,
      time: izin.time,
      bukti: izin.bukti,
      bukti_id: izin.bukti_id,
      status: izin.status,

      // Ambil dari relasi
      namaSiswa: izin.Siswa?.nama || null,
      nisSiswa: izin.Siswa?.nis || null,
      namaKelas: izin.Kelas?.nama || null,
      tingkat: izin.Kelas?.tingkat || null,
    }));
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

export const getPerizinanSiswaByIdKelas = async (idKelas) => {
  try {
    const izinList = await prisma.perizinanSiswa.findMany({
      where: { idKelas },
      include: {
        Siswa: true,
        Kelas: true,
      },
    });

    // Flatten hasil
    return izinList.map((izin) => ({
      id: izin.id,
      idSiswa: izin.idSiswa,
      idKelas: izin.idKelas,
      jenis: izin.jenis,
      keterangan: izin.keterangan,
      time: izin.time,
      bukti: izin.bukti,
      bukti_id: izin.bukti_id,
      status: izin.status,

      // Ambil dari relasi
      namaSiswa: izin.Siswa?.nama || null,
      nisSiswa: izin.Siswa?.nis || null,
      namaKelas: izin.Kelas?.nama || null,
    }));
  } catch (error) {
    console.log(error);

    throw new Error(prismaErrorHandler(error));
  }
};

export const getPerizinanSiswaByIdKelasToday = async (idKelas) => {
  try {
    // Ambil waktu sekarang (misalnya WIB)
    const now = new Date();

    // Ambil awal & akhir hari ini
    const start = startOfDay(now); // 2025-10-17T00:00:00.000Z
    const end = endOfDay(now); // 2025-10-17T23:59:59.999Z

    const izinList = await prisma.perizinanSiswa.findMany({
      where: {
        idKelas,
        time: {
          gte: start,
          lte: end,
        },
      },
      include: {
        Siswa: true,
        Kelas: true,
      },
      orderBy: { time: "desc" },
    });

    return izinList.map((izin) => ({
      id: izin.id,
      idSiswa: izin.idSiswa,
      idKelas: izin.idKelas,
      keterangan: izin.keterangan,
      time: izin.time,
      bukti: izin.bukti,
      bukti_id: izin.bukti_id,
      status: izin.status,
      namaSiswa: izin.Siswa?.nama || null,
      nisSiswa: izin.Siswa?.nis || null,
      namaKelas: izin.Kelas?.nama || null,
    }));
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

// ✅ Update
export const updatePerizinanSiswa = async (id, data) => {
  try {
    return await prisma.perizinanSiswa.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};

export const updateStatusPerizinanSiswa = async (id, status) => {
  try {
    await deleteNotifikasiByIdTerkait(id);

    const izin = await prisma.perizinanSiswa.update({
      where: { id },
      data: {
        status: status,
      },
    });

    const nama = await getNamaSiswa(izin.idSiswa);

    if (izin) {
      await createNotifikasi({
        idSiswa: izin.idSiswa,
        idKelas: izin.idKelas,
        kategori: "Perizinan Siswa",
        idTerkait: izin.id,
        redirectGuru: `/mengajar/walikelas/${izin.idKelas}`,
        redirectSiswa: `/siswa/perizinan`,
        keterangan: `${nama.nama} mengajukan izin`,
        createdBy: izin.idSiswa,
      });
    }
  } catch (error) {
    console.log(error);

    throw new Error(prismaErrorHandler(error));
  }
};

// ✅ Delete
export const deletePerizinanSiswa = async (id) => {
  try {
    const data = await prisma.perizinanSiswa.findUnique({
      where: {
        id,
      },
    });

    if (data) {
      await deleteFromCloudinary(data.bukti_id);
    }

    const deleteIzin = await prisma.perizinanSiswa.delete({
      where: { id },
    });

    await deleteNotifikasiByIdTerkait(deleteIzin.id);
  } catch (error) {
    throw new Error(prismaErrorHandler(error));
  }
};
