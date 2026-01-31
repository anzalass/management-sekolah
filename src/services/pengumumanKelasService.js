import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  sendNotificationToUsers,
} from "./notifikasiService.js";
import { uploadToCloudinary } from "../utils/ImageHandler.js";

const prisma = new PrismaClient();

export const createPengumumanKelas = async (data, image) => {
  try {
    let fotoUrl = null;
    let fotoId = null;

    // 1️⃣ UPLOAD IMAGE (JIKA ADA)
    if (image?.buffer?.length) {
      const uploadResult = await uploadToCloudinary(
        image.buffer,
        "pengumuman",
        `pengumuman_${Date.now()}`
      );

      fotoUrl = uploadResult.secure_url;
      fotoId = uploadResult.public_id;
    }

    // 2️⃣ CREATE PENGUMUMAN
    const pengumuman = await prisma.pengumumanKelas.create({
      data: {
        ...data,
        fotoUrl,
        fotoId,
      },
    });

    // 3️⃣ AMBIL SISWA KELAS
    const siswaKelas = await prisma.daftarSiswaKelas.findMany({
      where: { idKelas: pengumuman.idKelas },
      select: { idSiswa: true },
    });

    // 4️⃣ AMBIL SISWA MAPEL
    const siswaMapel = await prisma.daftarSiswaMapel.findMany({
      where: { idKelas: pengumuman.idKelas },
      select: { idSiswa: true },
    });

    const userIds = [
      ...new Set([
        ...siswaKelas.map((s) => s.idSiswa),
        ...siswaMapel.map((s) => s.idSiswa),
      ]),
    ];

    // 5️⃣ NOTIFIKASI DB
    await createNotifikasi({
      createdBy: "",
      idGuru: data.idGuru,
      idKelas: pengumuman.idKelas,
      idSiswa: "",
      idTerkait: pengumuman.id,
      kategori: "Pengumuman",
      keterangan: pengumuman.title,
      redirectSiswa: "/siswa/pengumuman",
    });

    // 6️⃣ PUSH NOTIF
    if (userIds.length) {
      await sendNotificationToUsers(userIds, {
        title: "📢 Pengumuman Baru",
        body: pengumuman.title,
        icon: "/icons/icon-192.png",
        data: { url: "/siswa/pengumuman" },
      });
    }

    return pengumuman;
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const updatePengumumanKelas = async (id, data, image) => {
  try {
    let updateData = { ...data };

    if (image?.buffer?.length) {
      const uploadResult = await uploadToCloudinary(
        image.buffer,
        "cms/pengumuman",
        `pengumuman_${Date.now()}`
      );

      updateData.fotoUrl = uploadResult.secure_url;
      updateData.fotoId = uploadResult.public_id;
    }

    return await prisma.pengumumanKelas.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.error(error);
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

export const deletePengumumanKelas = async (id) => {
  try {
    // 1️⃣ Ambil data dulu (buat dapet fotoId)
    const pengumuman = await prisma.pengumumanKelas.findUnique({
      where: { id },
      select: {
        id: true,
        fotoId: true,
      },
    });

    if (!pengumuman) {
      throw new Error("Pengumuman tidak ditemukan");
    }

    // 2️⃣ Hapus image di Cloudinary
    if (pengumuman.fotoId) {
      await deleteFromCloudinary(pengumuman.fotoId);
    }

    // 3️⃣ Hapus data di DB
    return await prisma.pengumumanKelas.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
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
