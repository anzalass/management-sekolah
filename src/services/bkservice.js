import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

const computeEffect = (jenis, poin) => {
  if (!jenis) return 0;
  return jenis.toLowerCase() === "pelanggaran" ? -poin : poin;
};

export const createPelanggaranPrestasi = async ({
  idSiswa,
  waktu = new Date(),
  poin,
  jenis,
  keterangan,
}) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const siswa = await tx.siswa.findUnique({
        where: { id: idSiswa },
        select: { poin: true, nis: true },
      });
      if (!siswa) throw new Error("Siswa tidak ditemukan");

      const record = await tx.pelanggaran_Dan_Prestasi_Siswa.create({
        data: {
          idSiswa,
          nisSiswa: siswa.nis,
          waktu,
          poin,
          jenis,
          keterangan,
        },
      });

      const effect = computeEffect(jenis, poin);
      const currentPoin = typeof siswa.poin === "number" ? siswa.poin : 0;

      await tx.siswa.update({
        where: { id: idSiswa },
        data: { poin: currentPoin + effect },
      });

      return record;
    });
  } catch (err) {
    console.log(err);
    const errorMessage = prismaErrorHandler(err);
    throw new Error(errorMessage);
  }
};

// service
export const getPelanggaranPrestasiList = async ({
  nisSiswa = "",
  jenis = "",
  namaSiswa = "",
  waktu = "",
  page = 1,
  pageSize = 10,
}) => {
  try {
    const take = parseInt(pageSize, 10) || 10; // default 10
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    // Bangun where clause
    const where = {
      AND: [
        nisSiswa ? { nisSiswa } : undefined,
        jenis ? { jenis: { contains: jenis, mode: "insensitive" } } : undefined,
        namaSiswa
          ? { Siswa: { nama: { contains: namaSiswa, mode: "insensitive" } } }
          : undefined,
        waktu ? { waktu: new Date(`${waktu}T00:00:00Z`) } : undefined,
      ].filter(Boolean),
    };

    const [data, total] = await Promise.all([
      prisma.pelanggaran_Dan_Prestasi_Siswa.findMany({
        where,
        orderBy: { waktu: "desc" },
        take,
        skip,
        include: {
          Siswa: { select: { nama: true } },
        },
      }),
      prisma.pelanggaran_Dan_Prestasi_Siswa.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  } catch (err) {
    console.error(err);
    const errorMessage = prismaErrorHandler(err);
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
      // Cek record lama
      const existing = await tx.pelanggaran_Dan_Prestasi_Siswa.findUnique({
        where: { id },
      });
      if (!existing) throw new Error("Record tidak ditemukan");

      // Cek siswa
      const siswa = await tx.siswa.findUnique({
        where: { nis: existing.nisSiswa },
        select: { poin: true },
      });
      if (!siswa) throw new Error("Siswa tidak ditemukan");

      // Hitung efek lama dan baru
      const prevEffect = computeEffect(existing.jenis, existing.poin);
      const basePoin = typeof siswa.poin === "number" ? siswa.poin : 0;

      const newJenis = typeof jenis === "string" ? jenis : existing.jenis;
      const newPoin = typeof poin === "number" ? poin : existing.poin;
      const newEffect = computeEffect(newJenis, newPoin);

      // Balikin poin lama dulu, baru masukin poin baru
      const adjustedPoin = basePoin - prevEffect + newEffect;

      // Update record pelanggaran/prestasi
      const updated = await tx.pelanggaran_Dan_Prestasi_Siswa.update({
        where: { id },
        data: {
          idSiswa: existing.idSiswa,
          poin: newPoin,
          jenis: newJenis,
          keterangan: keterangan ?? existing.keterangan,
          waktu: waktu ? new Date(waktu) : existing.waktu,
        },
      });

      // Update total poin siswa
      await tx.siswa.update({
        where: { id: existing.idSiswa },
        data: { poin: adjustedPoin },
      });

      return updated;
    });
  } catch (err) {
    console.log(err);
    const errorMessage = prismaErrorHandler(err);
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
    const siswa = await prisma.siswa.findUnique({
      where: {
        id: data.idSiswa,
      },
    });

    const konseling = await prisma.konseling.create({
      data: {
        namaSiswa: data.namaSiswa,
        keterangan: data.keterangan,
        idSiswa: data.idSiswa,
        kategori: data.kategori,
        nisSiswa: siswa.nis,
        tanggal: new Date(`${data.tanggal}T00:00:00Z`),
      },
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
    const siswa = await prisma.siswa.findUnique({
      where: {
        id: data.idSiswa,
      },
    });
    return await prisma.konseling.update({
      where: { id },
      data: {
        idSiswa: data.idSiswa,
        keterangan: data.keterangan,
        nisSiswa: data.nisSiswa,
        namaSiswa: data.namaSiswa,
        tanggal: new Date(`${data.tanggal}T00:00:00Z`),
      },
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

export const getAllKonseling = async (
  filters = {},
  page = 1,
  pageSize = 10
) => {
  const { nama, nis, tanggal } = filters;

  try {
    // Filter utama
    const whereClause = {
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
    };

    // Hitung total data
    const total = await prisma.konseling.count({ where: whereClause });

    // Ambil data sesuai page & pageSize
    const konselingList = await prisma.konseling.findMany({
      where: whereClause,
      include: {
        Siswa: true,
      },
      orderBy: {
        tanggal: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: konselingList,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getKonselingBySiswa = async (idSiswa) => {
  try {
    const result = await prisma.konseling.findMany({
      where: {
        idSiswa,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
