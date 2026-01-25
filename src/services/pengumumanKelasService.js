import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  sendNotificationToUsers,
} from "./notifikasiService.js";

const prisma = new PrismaClient();

export const createPengumumanKelas = async (data) => {
  try {
    // 1️⃣ Create pengumuman
    const pengumuman = await prisma.pengumumanKelas.create({ data });

    // 2️⃣ Ambil siswa dari KELAS
    const siswaKelas = await prisma.daftarSiswaKelas.findMany({
      where: { idKelas: pengumuman.idKelas },
      select: { idSiswa: true },
    });

    // 3️⃣ Ambil siswa dari MAPEL
    const siswaMapel = await prisma.daftarSiswaMapel.findMany({
      where: { idKelas: pengumuman.idKelas },
      select: { idSiswa: true },
    });

    // 4️⃣ Gabung + hapus duplikat
    const userIds = [
      ...new Set([
        ...siswaKelas.map((s) => s.idSiswa),
        ...siswaMapel.map((s) => s.idSiswa),
      ]),
    ];

    // 5️⃣ CREATE NOTIFIKASI DB (SATU KALI SAJA)
    await createNotifikasi({
      createdBy: data.createdBy || "",
      idGuru: data.idGuru || "",
      idKelas: pengumuman.idKelas, // 🔥 kunci utama
      idSiswa: "", // kosong → notif berbasis kelas
      idTerkait: pengumuman.id,
      kategori: "Pengumuman",
      keterangan: pengumuman.title,
      redirectSiswa: "/siswa/pengumuman",
    });

    // 6️⃣ PUSH NOTIFICATION (KE SEMUA SISWA)
    if (userIds.length) {
      const payload = {
        title: "📢 Pengumuman Baru",
        body: pengumuman.title,
        icon: "/icons/icon-192.png",
        data: {
          url: "/siswa/pengumuman",
        },
      };

      await sendNotificationToUsers(userIds, payload);
    }

    return pengumuman;
  } catch (error) {
    console.log(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getAllPengumumanKelas = async () => {
  try {
    return await prisma.pengumumanKelas.findMany({
      include: { Kelas: true },
      orderBy: { createdOn: "desc" },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPengumumanKelasById = async (id) => {
  try {
    return await prisma.pengumumanKelas.findUnique({
      where: { id },
      include: { Kelas: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updatePengumumanKelas = async (id, data) => {
  try {
    return await prisma.pengumumanKelas.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePengumumanKelas = async (id) => {
  try {
    return await prisma.pengumumanKelas.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPengumumanKelasByKelasId = async (idKelas) => {
  try {
    return await prisma.pengumumanKelas.findMany({
      where: { idKelas: idKelas },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPengumumanKelasByGuru = async (idGuru) => {
  try {
    return await prisma.pengumumanKelas.findMany({
      where: { idGuru: idGuru },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllKelasAndMapelByGuruService = async (idGuru) => {
  try {
    const ta = await prisma.sekolah.findFirst({
      select: {
        tahunAjaran: true,
      },
    });
    // Ambil semua kelas berdasarkan idGuru
    const kelas = await prisma.kelas.findMany({
      where: { idGuru, tahunAjaran: ta.tahunAjaran },
      select: {
        id: true,
        nama: true,
      },
    });

    // Ambil semua mapel berdasarkan idGuru
    const mapel = await prisma.kelasDanMapel.findMany({
      where: { idGuru, tahunAjaran: ta.tahunAjaran },
      select: {
        id: true,
        namaMapel: true,
        kelas: true,
      },
    });

    // Gabungkan hasilnya menjadi satu array
    const result = [
      ...kelas.map((k) => ({
        id: k.id,
        nama: k.nama,
        type: "Kelas",
        tahunAjaran: k.tahunAjaran,
      })),
      ...mapel.map((m) => ({
        id: m.id,
        nama: m.namaMapel,
        type: "Mapel",
        kelas: m.kelas,
        tahunAjaran: m.tahunAjaran,
      })),
    ];

    return result;
  } catch (error) {
    console.error("Error getAllKelasAndMapelByGuruService:", error);
    throw new Error("Gagal mengambil data kelas dan mapel.");
  }
};
