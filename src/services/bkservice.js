import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

const computeEffect = (jenis, poin) => {
  if (!jenis) return 0;
  return jenis.toLowerCase() === "pelanggaran" ? poin : -poin;
};

export const createPelanggaranPrestasi = async ({
  nisSiswa,
  waktu = new Date(),
  poin,
  jenis,
  keterangan,
}) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const siswa = await tx.siswa.findUnique({
        where: { nis: nisSiswa },
        select: { poin: true },
      });
      if (!siswa) throw new Error("Siswa tidak ditemukan");

      const record = await tx.pelanggaran_Dan_Prestasi_Siswa.create({
        data: { nisSiswa, waktu, poin, jenis, keterangan },
      });

      const effect = computeEffect(jenis, poin);
      const currentPoin = typeof siswa.poin === "number" ? siswa.poin : 0;

      await tx.siswa.update({
        where: { nis: nisSiswa },
        data: { poin: currentPoin + effect },
      });

      return record;
    });
  } catch (err) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPelanggaranPrestasiList = async ({
  nisSiswa = "",
  jenis = "",
  dateFrom,
  dateTo,
  page = 1,
  pageSize = 10,
}) => {
  try {
    const skip = (page - 1) * pageSize;
    const where = {};

    if (nisSiswa) where.nisSiswa = nisSiswa;
    if (jenis) where.jenis = { contains: jenis, mode: "insensitive" };
    if (dateFrom || dateTo) {
      where.waktu = {};
      if (dateFrom) where.waktu.gte = new Date(dateFrom);
      if (dateTo) where.waktu.lte = new Date(dateTo);
    }

    const [data, total] = await Promise.all([
      prisma.pelanggaran_Dan_Prestasi_Siswa.findMany({
        where,
        orderBy: { waktu: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.pelanggaran_Dan_Prestasi_Siswa.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getPelanggaranPrestasiById = async (id) => {
  try {
    const record = await prisma.pelanggaran_Dan_Prestasi_Siswa.findUnique({
      where: { id },
    });
    if (!record) throw new Error("Record tidak ditemukan");
    return record;
  } catch (err) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updatePelanggaranPrestasi = async (
  id,
  { poin, jenis, keterangan, waktu }
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.pelanggaran_Dan_Prestasi_Siswa.findUnique({
        where: { id },
      });
      if (!existing) throw new Error("Record tidak ditemukan");

      const siswa = await tx.siswa.findUnique({
        where: { nis: existing.nisSiswa },
        select: { poin: true },
      });
      if (!siswa) throw new Error("Siswa tidak ditemukan");

      const prevEffect = computeEffect(existing.jenis, existing.poin);
      const basePoin = typeof siswa.poin === "number" ? siswa.poin : 0;

      const newJenis = typeof jenis === "string" ? jenis : existing.jenis;
      const newPoin = typeof poin === "number" ? poin : existing.poin;
      const newEffect = computeEffect(newJenis, newPoin);

      const adjustedPoin = basePoin - prevEffect + newEffect;

      const updated = await tx.pelanggaran_Dan_Prestasi_Siswa.update({
        where: { id },
        data: {
          poin: newPoin,
          jenis: newJenis,
          keterangan: keterangan ?? existing.keterangan,
          waktu: waktu ? new Date(waktu) : existing.waktu,
        },
      });

      await tx.siswa.update({
        where: { nis: existing.nisSiswa },
        data: { poin: adjustedPoin },
      });

      return updated;
    });
  } catch (err) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deletePelanggaranPrestasi = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.pelanggaran_Dan_Prestasi_Siswa.findUnique({
        where: { id },
      });
      if (!existing) throw new Error("Record tidak ditemukan");

      const siswa = await tx.siswa.findUnique({
        where: { nis: existing.nisSiswa },
        select: { poin: true },
      });
      if (!siswa) throw new Error("Siswa tidak ditemukan");

      const prevEffect = computeEffect(existing.jenis, existing.poin);
      const currentPoin = typeof siswa.poin === "number" ? siswa.poin : 0;
      const adjustedPoin = currentPoin - prevEffect;

      await tx.pelanggaran_Dan_Prestasi_Siswa.delete({
        where: { id },
      });

      await tx.siswa.update({
        where: { nis: existing.nisSiswa },
        data: { poin: adjustedPoin },
      });

      return { id };
    });
  } catch (err) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Create Konseling
export const createKonseling = async (data) => {
  try {
    const konseling = await prisma.konseling.create({
      data,
    });
    return konseling;
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Get Konseling by ID
export const getKonselingById = async (id) => {
  try {
    return await prisma.konseling.findUnique({
      where: { id },
      include: {
        Siswa: true,
      },
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Update Konseling
export const updateKonseling = async (id, data) => {
  try {
    return await prisma.konseling.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// Delete Konseling
export const deleteKonseling = async (id) => {
  try {
    return await prisma.konseling.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllKonseling = async (filters = {}) => {
  const { nama, nis, tanggal } = filters;

  try {
    const konselingList = await prisma.konseling.findMany({
      where: {
        AND: [
          nama
            ? {
                Siswa: {
                  nama: {
                    contains: nama,
                    mode: "insensitive",
                  },
                },
              }
            : undefined,
          nis ? { nisSiswa: nis } : undefined,
          tanggal
            ? {
                tanggal: {
                  equals: new Date(tanggal),
                },
              }
            : undefined,
        ].filter(Boolean),
      },
      include: {
        Siswa: true,
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    return konselingList;
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
