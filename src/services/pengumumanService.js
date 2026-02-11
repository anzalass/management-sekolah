import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  sendNotificationToUsers,
} from "./notifikasiService.js";
import dotenv from "dotenv";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

dotenv.config();

export const createPengumuman = async (data, image) => {
  const { title, time, content } = data;

  try {
    let imageResult = null;

    // 1️⃣ UPLOAD IMAGE (JIKA ADA)
    if (image?.buffer) {
      imageResult = await uploadToCloudinary(
        image.buffer,
        "pengumuman",
        `pengumuman-${Date.now()}`
      );
    }

    console.log(imageResult);

    // 2️⃣ CREATE PENGUMUMAN
    const pengumuman = await prisma.pengumuman.create({
      data: {
        title,
        time: new Date(`${time}T00:00:00Z`),
        content,
        fotoUrl: imageResult?.secure_url || null,
        fotoId: imageResult?.public_id || null,
      },
    });

    // 3️⃣ AMBIL SEMUA SISWA
    const siswa = await prisma.siswa.findMany({
      select: { id: true },
    });

    const userIds = siswa.map((s) => s.id);

    // 4️⃣ PUSH NOTIFICATION
    await sendNotificationToUsers(userIds, {
      title: "📢 Pengumuman Baru",
      body: pengumuman.title,
      icon: "/icons/icon-192.png",
      data: {
        url: "/siswa/pengumuman",
      },
    });

    // 5️⃣ DB NOTIFIKASI (GLOBAL)
    await createNotifikasi({
      createdBy: data.createdBy || "",
      idGuru: "",
      idKelas: "",
      idSiswa: "",
      idTerkait: pengumuman.id,
      kategori: "Pengumuman",
      keterangan: pengumuman.title,
      redirectSiswa: "/siswa/pengumuman",
    });

    return pengumuman;
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const updatePengumuman = async (id, data, image) => {
  const { title, time, content } = data;

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.pengumuman.findUnique({
        where: { id },
        select: { fotoId: true },
      });

      console.log("paramimage", image);

      let imageResult = null;

      // 1️⃣ JIKA ADA IMAGE BARU
      if (image && image.buffer && image.buffer.length > 0) {
        // hapus image lama
        if (existing?.fotoId) {
          await deleteFromCloudinary(existing.fotoId);
        }

        imageResult = await uploadToCloudinary(
          image.buffer,
          "pengumuman",
          `pengumuman-${Date.now()}`
        );
      }

      console.log(imageResult);

      // 2️⃣ UPDATE DB
      return await tx.pengumuman.update({
        where: { id },
        data: {
          title,
          time: new Date(`${time}T00:00:00Z`),
          content,
          ...(imageResult && {
            fotoUrl: imageResult.secure_url,
            fotoId: imageResult.public_id,
          }),
        },
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};
export const deletePengumuman = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const pengumuman = await tx.pengumuman.findUnique({
        where: { id },
        select: { fotoId: true },
      });

      if (!pengumuman) {
        throw new Error("Pengumuman tidak ditemukan");
      }

      // 1️⃣ DELETE IMAGE
      if (pengumuman.fotoId) {
        await deleteFromCloudinary(pengumuman.fotoId);
      }

      // 2️⃣ DELETE DB
      return await tx.pengumuman.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
  }
};

export const getPengumumanById = async (id) => {
  const pengumuman = await prisma.pengumuman.findUnique({ where: { id } });
  if (!pengumuman) {
    throw new Error("Pengumuman not found");
  }
  return pengumuman;
};

export const getAllPengumuman = async ({
  page = 1,
  pageSize = 10,
  title = "",
  time = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    let where = {};

    console.log("test skip : " + skip);
    console.log("test take : " + take);

    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }

    if (time) {
      where.time = new Date(`${time}T00:00:00Z`);
    }

    const data = await prisma.pengumuman.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdOn: "desc",
      },
    });

    console.log("test take : " + data);

    return {
      data,
      page,
      totaData: await prisma.pengumuman.count({ where }),
      pageSize,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
