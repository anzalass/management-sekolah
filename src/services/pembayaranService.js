import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import { createNotifikasi } from "./notifikasiService.js";
const prisma = new PrismaClient();

export const createTagihan = async (data) => {
  try {
    const { opsi, siswaList = [], ...tagihanData } = data;
    console.log("opsi", opsi);
    console.log("kelas", tagihanData.kelas);

    return await prisma.$transaction(async (tx) => {
      let siswaTarget = [];

      if (opsi === "semua") {
        siswaTarget = await tx.siswa.findMany({
          where: {
            OR: [
              { tahunLulus: "" }, // kosong string
              { tahunLulus: null }, // null
            ],
          },
        });
      } else if (opsi === "kelas") {
        siswaTarget = await tx.siswa.findMany({
          where: {
            kelas: { contains: tagihanData.kelas || "", mode: "insensitive" },
            tahunLulus: "",
          },
        });
      } else if (opsi === "individu") {
        if (!siswaList.length) {
          throw new Error("Daftar siswa individu kosong");
        }
        siswaTarget = siswaList; // langsung pakai data dari client
      }

      if (!siswaTarget.length) {
        throw new Error("Tidak ada siswa ditemukan");
      }

      // mapping jadi array tagihan
      const tagihanArray = siswaTarget.map((siswa) => ({
        nama: tagihanData.nama,
        keterangan: tagihanData.keterangan,
        status: "BELUM_BAYAR" || "BELUM BAYAR",
        waktu: new Date(`${tagihanData.waktu}T00:00:00Z`),
        jatuhTempo: new Date(`${tagihanData.jatuhTempo}T00:00:00Z`),
        nominal: parseInt(tagihanData.nominal),
        nisSiswa: siswa.nis,
        namaSiswa: siswa.nama,
        idSiswa: siswa.id,
      }));

      return await tx.tagihan.createMany({ data: tagihanArray });
    });
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllTagihan = async (query) => {
  try {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const { nama, namaSiswa, nis } = query;

    const whereClause = {};

    if (nama) {
      whereClause.nama = {
        contains: nama,
        mode: "insensitive",
      };
    }

    if (namaSiswa) {
      whereClause.Siswa = {
        nama: {
          contains: namaSiswa,
          mode: "insensitive",
        },
      };
    }

    if (nis) {
      whereClause.Siswa = {
        nis: {
          contains: nis,
          mode: "insensitive",
        },
      };
    }

    const total = await prisma.tagihan.count({
      where: whereClause,
    });

    const data = await prisma.tagihan.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: whereClause,
      include: {
        Siswa: true,
      },
      orderBy: {
        waktu: "desc",
      },
    });

    return {
      data,
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

export const getTagihanById = async (id) => {
  try {
    return await prisma.tagihan.findUnique({
      where: { id },
      include: { Siswa: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateTagihan = async (id, data) => {
  try {
    return await prisma.$transaction(async (tx) => {
      return await tx.tagihan.update({
        where: { id },
        data: {
          jatuhTempo: new Date(`${data.jatuhTempo}T00:00:00Z`),
          waktu: new Date(`${data.waktu}T00:00:00Z`),
          nama: data.nama,
          keterangan: data.keterangan,
          nominal: parseInt(data.nominal),
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const bayarTagihan = async (idTagihan, metodeBayar) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const riwayatPembayaran = await tx.riwayatPembayaran.findFirst({
        where: {
          idTagihan: idTagihan,
        },
      });

      if (riwayatPembayaran) {
        throw new Error("Tagihan sudah dibayarkan");
      }
      // 1. Ambil data tagihan
      const tagihan = await tx.tagihan.findUnique({
        where: { id: idTagihan },
      });

      if (!tagihan) {
        throw new Error("Tagihan tidak ditemukan");
      }

      if (tagihan.status === "LUNAS") {
        throw new Error("Tagihan sudah dibayar");
      }

      // 2. Update status tagihan menjadi Dibayar
      const updatedTagihan = await tx.tagihan.update({
        where: { id: idTagihan },
        data: { status: "LUNAS" },
      });

      // 3. Tambahkan riwayat pembayaran
      const riwayat = await tx.riwayatPembayaran.create({
        data: {
          idTagihan: tagihan.id,
          idSiswa: tagihan.idSiswa || null,
          namaSiswa: tagihan.namaSiswa,
          nisSiswa: tagihan.nisSiswa,
          waktuBayar: new Date(),
          metodeBayar,
          status: "LUNAS",
        },
      });

      await createNotifikasi({
        createdBy: "",
        idGuru: "",
        idKelas: "",
        idSiswa: updatedTagihan.idSiswa,
        idTerkait: updatedTagihan.id,
        kategori: "Pembayaran",
        keterangan: `Tagihan ${updatedTagihan.nama} berhasil dibayar`,
        redirectSiswa: "/siswa/pembayaran",
      });

      return { updatedTagihan, riwayat };
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllRiwayatPembayaran = async ({
  page = 1,
  pageSize = 10,
  nisSiswa = "",
  namaSiswa = "",
  namaTagihan = "",
}) => {
  try {
    const skip = (page - 1) * pageSize;

    const where = {
      AND: [
        nisSiswa
          ? { nisSiswa: { contains: nisSiswa, mode: "insensitive" } }
          : {},
        namaSiswa
          ? { namaSiswa: { contains: namaSiswa, mode: "insensitive" } }
          : {},
        namaTagihan
          ? {
              Tagihan: {
                nama: { contains: namaTagihan, mode: "insensitive" },
              },
            }
          : {},
      ],
    };

    const total = await prisma.riwayatPembayaran.count({ where });
    const data = await prisma.riwayatPembayaran.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { waktuBayar: "desc" },
      include: { Tagihan: true }, // supaya bisa ambil info tagihan terkait
    });

    return {
      total,
      page,
      pageSize,
      data,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteTagihan = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      return await tx.tagihan.delete({
        where: { id },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const uploadBuktiTagihan = async (id, file) => {
  try {
    if (!file) {
      throw new Error("Harap upload file");
    }

    const tagihan = await prisma.tagihan.findUnique({
      where: {
        id: id,
      },
    });
    let imageUploadResult = null;
    if (file && file.buffer && file.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(
        file.buffer,
        "bukti_tagihan",
        tagihan.idSiswa
      );
    }

    const updated = await prisma.tagihan.update({
      where: {
        id,
      },
      data: {
        buktiUrl: imageUploadResult.secure_url,
        buktiId: imageUploadResult.public_id,
        status: "MENUNGGU_KONFIRMASI",
      },
    });

    return updated;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const buktiTidakValid = async (id) => {
  try {
    const tagihan = await prisma.tagihan.findUnique({
      where: {
        id,
      },
    });

    await deleteFromCloudinary(tagihan.buktiId);
    await prisma.tagihan.update({
      where: {
        id,
      },
      data: {
        status: "BUKTI_TIDAK_VALID",
        buktiId: "",
        buktiId: "",
      },
    });
    await createNotifikasi({
      createdBy: "",
      idGuru: "",
      idKelas: "",
      idSiswa: tagihan.idSiswa,
      idTerkait: id,
      kategori: "Pembayaran",
      keterangan: `Bukti pembayaran ${tagihan.nama} tidak valid`,
      redirectGuru: "",
      redirectSiswa: "/siswa/pembayaran",
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
