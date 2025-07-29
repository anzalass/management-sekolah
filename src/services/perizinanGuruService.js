import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

export const createPerizinanGuru = async (data, foto) => {
  try {
    const existingGuru = await prisma.guru.findUnique({
      where: { nip: data.nip },
    });
    if (!existingGuru) {
      throw new Error(`Guru dengan NIP ${data.nip} tidak ditemukan`);
    }
    let imageUploadResult = null;

    if (foto && foto.buffer) {
      imageUploadResult = await uploadToCloudinary(
        foto.buffer,
        "izinguru",
        data.nip
      );
    }

    await prisma.perizinanGuru.create({
      data: {
        nipGuru: data.nip,
        keterangan: data.keterangan,
        time: new Date(`${data.time}T00:00:00Z`),
        status: "menunggu",
        bukti: imageUploadResult?.secure_url ?? "", // pastikan tetap string
        bukti_id: imageUploadResult?.public_id ?? "",
      },
    });
  } catch (error) {
    console.log("a", error);
    throw new Error(error.message);
  }
};

export const updateStatusPerizinanGuru = async (id, status) => {
  try {
    return await prisma.perizinanGuru.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePerizinanGuru = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.delete({ where: { id } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPerizinanGuruById = async (id) => {
  const perizinanGuru = await prisma.perizinanGuru.findUnique({
    where: { id },
  });
  if (!perizinanGuru) {
    throw new Error("Perizinan Guru not found");
  }
  return perizinanGuru;
};

export const getPerizinanGuru = async ({
  nama = "",
  nip = "",
  tanggal = "",
  page = 1,
  pageSize = 10,
}) => {
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      nip ? { nipGuru: { contains: nip } } : {},
      nama
        ? {
            Guru: {
              nama: {
                contains: nama,
                mode: "insensitive",
              },
            },
          }
        : {},
      tanggal
        ? {
            time: {
              gte: new Date(tanggal + "T00:00:00.000Z"),
              lte: new Date(tanggal + "T23:59:59.999Z"),
            },
          }
        : {},
    ],
  };

  const [dataRaw, total] = await Promise.all([
    prisma.perizinanGuru.findMany({
      where,
      include: {
        Guru: {
          select: {
            nama: true,
            nip: true,
          },
        },
      },
      orderBy: {
        time: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.perizinanGuru.count({ where }),
  ]);

  // Mapping agar nama & nip keluar langsung tanpa nested Guru
  const data = dataRaw.map((item) => ({
    ...item,
    nama: item.Guru?.nama || null,
    nip: item.Guru?.nip || null,
    Guru: undefined,
  }));

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
