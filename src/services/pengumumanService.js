import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import { sendNotificationToUsers } from "./notifikasiService.js";
const prisma = new PrismaClient();

export const createPengumuman = async (data) => {
  const { title, time, content } = data;

  try {
    const pengumuman = await prisma.pengumuman.create({
      data: {
        title,
        time: new Date(`${time}T00:00:00Z`),
        content,
      },
    });

    const siswa = await prisma.siswa.findMany({
      select: { id: true },
    });

    const userIds = siswa.map((s) => s.id);

    const payload = {
      title: "📢 " + pengumuman.title,
      body: pengumuman.content.slice(0, 100),
      icon: "/icons/icon-192.png",
      data: {
        url: `/pengumuman/${pengumuman.id}`,
      },
    };

    await sendNotificationToUsers(userIds, payload);

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
