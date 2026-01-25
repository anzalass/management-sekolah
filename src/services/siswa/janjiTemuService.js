// services/janjiTemuService.ts
import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  deleteNotifikasiByIdTerkait,
  sendNotificationToUsers,
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
    // 1️⃣ Hapus notif lama berbasis idTerkait
    await deleteNotifikasiByIdTerkait(id);

    // 2️⃣ Update status janji temu
    const janjiTemu = await prisma.janjiTemu.update({
      where: { id },
      data: { status },
    });

    // 3️⃣ Ambil data siswa
    const siswa = await prisma.siswa.findUnique({
      where: { id: janjiTemu.idSiswa },
      select: { nama: true },
    });

    // 4️⃣ Tentukan pesan berdasarkan status
    let pesan = "";
    let pushTitle = "📅 Janji Temu";
    let pushBody = "";

    switch (status) {
      case "setujui":
        pesan = `Janji temu kamu disetujui`;
        pushBody = "Janji temu kamu telah disetujui";
        break;
      case "tolak":
        pesan = `Janji temu kamu ditolak`;
        pushBody = "Janji temu kamu ditolak";
        break;
      default:
        pesan = `${siswa.nama} mengajukan janji temu`;
        pushBody = "Pengajuan janji temu baru";
    }

    // 5️⃣ Push Notification (ke siswa)
    await sendNotificationToUsers([janjiTemu.idSiswa], {
      title: pushTitle,
      body: pushBody,
      icon: "/icons/icon-192.png",
      data: {
        url: "/siswa/janji-temu",
      },
    });

    // 6️⃣ DB Notification (SATU AJA)
    await createNotifikasi({
      createdBy: janjiTemu.idGuru,
      idGuru: janjiTemu.idGuru,
      idKelas: "",
      idSiswa: janjiTemu.idSiswa,
      idTerkait: janjiTemu.id,
      kategori: "Janji Temu",
      keterangan: pesan,
      redirectGuru: "/mengajar/janji-temu",
      redirectSiswa: "/siswa/janji-temu",
    });

    return janjiTemu;
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};
