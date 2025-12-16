import { PrismaClient } from "@prisma/client";
import { uploadToCloudinary } from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

export const createPerizinanGuru = async (data, foto) => {
  try {
    const existingGuru = await prisma.guru.findUnique({
      where: { id: data.idGuru },
    });
    if (!existingGuru) {
      throw new Error(`Guru dengan NIP ${data.nip} tidak ditemukan`);
    }
    let imageUploadResult = null;

    if (foto && foto.buffer) {
      imageUploadResult = await uploadToCloudinary(
        foto.buffer,
        "izinguru",
        data.idGuru
      );
    }

    await prisma.perizinanGuru.create({
      data: {
        idGuru: data.idGuru,
        keterangan: data.keterangan,
        time: new Date(`${data.time}T00:00:00Z`),
        status: "menunggu",
        bukti: imageUploadResult?.secure_url ?? "", // pastikan tetap string
        bukti_id: imageUploadResult?.public_id ?? "",
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateStatusPerizinanGuru = async (id, status) => {
  try {
    // 1. Ambil data perizinan
    const izin = await prisma.perizinanGuru.findUnique({
      where: { id },
      include: { Guru: true }, // opsional, untuk log/error
    });

    if (!izin) {
      throw new Error("Perizinan tidak ditemukan");
    }

    // 2. Jika status "disetujui", cek dan buat kehadiran (jika belum ada hari ini)
    if (status === "disetujui") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // Cek apakah guru sudah punya kehadiran hari ini
      const existingKehadiran = await prisma.kehadiranGuru.findFirst({
        where: {
          idGuru: izin.idGuru,
          jamMasuk: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      // Jika belum ada, buat baru
      if (!existingKehadiran) {
        await prisma.kehadiranGuru.create({
          data: {
            idGuru: izin.idGuru,
            jamMasuk: new Date(),
            jamPulang: new Date(), // bisa null jika belum pulang, tapi sesuaikan logika
            lokasiMasuk: "izin",
            lokasiPulang: "izin",
            fotoMasuk: "izin",
            status: "Izin",
          },
        });
      }
      // Jika sudah ada, biarkan saja (tidak buat duplikat)
    }

    // 3. Update status perizinan
    return await prisma.perizinanGuru.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error("Error updateStatusPerizinanGuru:", error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
export const deletePerizinanGuru = async (id) => {
  try {
    await prisma.$transaction(async () => {
      await prisma.perizinanGuru.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
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
      nip
        ? {
            Guru: {
              nip: {
                contains: nip,
                mode: "insensitive",
              },
            },
          }
        : {},
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
