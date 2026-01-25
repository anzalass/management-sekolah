import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  createNotifikasi,
  sendNotificationToUsers,
} from "./notifikasiService.js";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();

export const createPengumuman = async (data) => {
  const { title, time, content } = data;

  try {
    // 1️⃣ CREATE PENGUMUMAN
    const pengumuman = await prisma.pengumuman.create({
      data: {
        title,
        time: new Date(`${time}T00:00:00Z`),
        content,
      },
    });

    // 2️⃣ AMBIL SEMUA SISWA (UNTUK PUSH)
    const siswa = await prisma.siswa.findMany({
      select: { id: true },
    });

    const userIds = siswa.map((s) => s.id);

    // 3️⃣ PUSH NOTIFICATION (BANYAK USER)
    const payload = {
      title: "📢 Pengumuman Baru",
      body: pengumuman.title,
      icon: "/icons/icon-192.png",
      data: {
        url: `${process.env.SERVER_FE}/siswa/pengumuman`,
      },
    };

    await sendNotificationToUsers(userIds, payload);

    // 4️⃣ CREATE NOTIFIKASI DB (SATU SAJA ‼️)
    await createNotifikasi({
      createdBy: data.createdBy || "",
      idGuru: "", // ❗ kosong
      idKelas: "", // ❗ kosong (GLOBAL)
      idSiswa: "", // ❗ kosong
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

export const updatePengumuman = async (id, data) => {
  const { title, time, content } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.pengumuman.update({
        where: { id },
        data: { title, time: new Date(`${time}T00:00:00Z`), content },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePengumuman = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.pengumuman.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
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
