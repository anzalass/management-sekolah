import { PrismaClient } from "@prisma/client";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import {
  createNotifikasi,
  sendNotificationToUsers,
} from "./notifikasiService.js";
const prisma = new PrismaClient();

/**
 * Create WeeklyActivity dengan multiple foto
 */
export const createWeeklyActivity = async (
  idKelas,
  judul,
  content,
  waktu,
  files
) => {
  try {
    // ===============================
    // 1️⃣ UPLOAD FOTO (DI LUAR TX)
    // ===============================
    let uploadedPhotos = [];

    if (files && files.length > 0) {
      uploadedPhotos = await Promise.all(
        files.map(async (file, index) => {
          const uploaded = await uploadToCloudinary(
            file.buffer,
            "weekly_activity",
            `weekly_${index}`
          );

          return {
            fotoUrl: uploaded.secure_url,
            fotoId: uploaded.public_id,
          };
        })
      );
    }

    // ===============================
    // 2️⃣ TRANSACTION KHUSUS DATABASE
    // ===============================
    const result = await prisma.$transaction(async (tx) => {
      // Weekly Activity
      const weeklyActivity = await tx.weeklyActivity.create({
        data: {
          judul,
          idKelas,
          content,
          waktu: new Date(waktu),
        },
      });

      // Foto (BATCH)
      if (uploadedPhotos.length > 0) {
        await tx.fotoWeeklyActivity.createMany({
          data: uploadedPhotos.map((foto) => ({
            idWeeklyActivity: weeklyActivity.id,
            fotoUrl: foto.fotoUrl,
            fotoId: foto.fotoId,
          })),
        });
      }

      // Ambil siswa
      const daftarSiswa = await tx.daftarSiswaKelas.findMany({
        where: { idKelas },
        select: { idSiswa: true },
      });

      return {
        weeklyActivity,
        userIds: daftarSiswa.map((s) => s.idSiswa),
      };
    });

    // ===============================
    // 3️⃣ SIDE EFFECT (LUAR TX)
    // ===============================
    if (result.userIds.length > 0) {
      await sendNotificationToUsers(result.userIds, {
        title: "📸 Weekly Activity Baru",
        body: judul,
        icon: "/icons/icon-192.png",
        data: {
          url: "/siswa/weekly-activity",
        },
      });
    }

    await createNotifikasi({
      createdBy: "",
      idGuru: "",
      idKelas,
      idSiswa: "",
      idTerkait: result.weeklyActivity.id,
      kategori: "Weekly Activity",
      keterangan: judul,
      redirectSiswa: "/siswa/weekly-activity",
    });

    // ===============================
    // 4️⃣ RETURN DATA LENGKAP
    // ===============================
    return await prisma.weeklyActivity.findUnique({
      where: { id: result.weeklyActivity.id },
      include: { FotoWeeklyActivity: true },
    });
  } catch (error) {
    console.error("Error createWeeklyActivity:", error);
    throw new Error(prismaErrorHandler(error));
  }
};

/**
 * Get WeeklyActivity by idKelas
 */
export const getWeeklyActivityByIdKelas = async (idKelas) => {
  try {
    return await prisma.weeklyActivity.findMany({
      where: { idKelas: idKelas },
      include: { FotoWeeklyActivity: true },
      orderBy: { waktu: "desc" },
    });
  } catch (error) {
    console.error("Error getWeeklyActivityByIdKelas:", error);
    throw error;
  }
};

/**
 * Delete WeeklyActivity + semua foto (Cloudinary juga)
 */
export const deleteWeeklyActivity = async (id) => {
  try {
    // 1. Ambil semua foto dulu
    const photos = await prisma.fotoWeeklyActivity.findMany({
      where: { idWeeklyActivity: id },
    });

    // 2. Hapus dari Cloudinary satu-satu
    if (photos.length > 0) {
      await Promise.all(
        photos.map((photo) => deleteFromCloudinary(photo.fotoId))
      );
    }

    // 3. Hapus foto di database
    await prisma.fotoWeeklyActivity.deleteMany({
      where: { idWeeklyActivity: id },
    });

    // 4. Hapus WeeklyActivity
    return await prisma.weeklyActivity.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleteWeeklyActivity:", error);
    throw error;
  }
};

export const deleteWeeklyActivityIdKelas = async (idKelas) => {
  try {
    // 1. Ambil semua WeeklyActivity dari kelas ini
    const weeklyActivities = await prisma.weeklyActivity.findMany({
      where: { idKelas },
    });

    // Ambil semua id WeeklyActivity
    const weeklyIds = weeklyActivities.map((w) => w.id);

    // 2. Ambil semua foto yang terkait dengan weeklyIds
    const photos = await prisma.fotoWeeklyActivity.findMany({
      where: {
        idWeeklyActivity: { in: weeklyIds },
      },
    });

    // 3. Hapus foto dari Cloudinary (kalau ada)
    if (photos.length > 0) {
      await Promise.all(
        photos.map((photo) => deleteFromCloudinary(photo.fotoId))
      );
    }

    // 4. Hapus foto di database
    await prisma.fotoWeeklyActivity.deleteMany({
      where: {
        idWeeklyActivity: { in: weeklyIds },
      },
    });

    // 5. Hapus semua WeeklyActivity untuk kelas ini
    await prisma.weeklyActivity.deleteMany({
      where: { idKelas },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleteWeeklyActivityIdKelas:", error);
    throw error;
  }
};
