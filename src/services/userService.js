import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcryptjs";
import {
  deleteFromCloudinary,
  deleteFromImageKit,
  uploadToCloudinary,
  uploadToImageKit,
} from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";

const createGuru = async (guru, foto) => {
  const {
    nip,
    nik,
    password,
    jabatan,
    nama,
    tempatLahir,
    tanggalLahir,
    alamat,
    agama,
    jenisKelamin,
    noTelepon,
    email,
    status,
  } = guru;

  try {
    let newGuru;
    const passwordHash = await bcrypt.hash(password, 10);

    // Upload foto ke Cloudinary jika ada
    const imageUploadResult = foto
      ? await uploadToCloudinary(foto.buffer, "guru", nip) // Pakai nip sebagai nama file unik
      : null;

    console.log(imageUploadResult);

    await prisma.$transaction(async (tx) => {
      newGuru = await tx.guru.create({
        data: {
          nip,
          nik,
          password: passwordHash,
          jabatan,
          nama,
          tempatLahir,
          tanggalLahir,
          alamat,
          agama,
          jenisKelamin,
          noTelepon,
          email,
          status,
          foto: imageUploadResult?.secure_url,
          fotoId: imageUploadResult?.public_id,
        },
      });
    });

    return newGuru;
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const createRiwayatPendidikan = async (nip, data) => {
  try {
    await prisma.$transaction(async (prisma) => {
      for (let index = 0; index < data.data.length; index++) {
        await prisma.riwayatPendidikanGuru.create({
          data: {
            nip: nip, // or however you want to map this
            nama: data.data[index].nama,
            jenjangPendidikan: data.data[index].jenjangPendidikan,
            gelar: data.data[index].gelar,
            tahunLulus: data.data[index].tahunLulus,
          },
        });
      }
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const deleteRiwayatPendidikan = async (id) => {
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.riwayatPendidikanGuru.deleteMany({
        where: { id: id },
      });
    });
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const updateGuru = async (id, guru, foto) => {
  const {
    nip,
    nik,
    password,
    jabatan,
    nama,
    tempatLahir,
    tanggalLahir,
    alamat,
    agama,
    jenisKelamin,
    noTelepon,
    email,
    status,
  } = guru;

  try {
    // 1️⃣ Ambil data guru di luar transaksi
    const existingGuru = await prisma.guru.findUnique({ where: { id } });
    if (!existingGuru)
      throw new Error("Guru dengan NIP tersebut tidak ditemukan");

    // 2️⃣ Upload foto (jika ada) di luar transaksi
    let imageUploadResult = null;
    if (foto) {
      if (existingGuru.fotoId) {
        await deleteFromCloudinary(existingGuru.fotoId);
      }
      imageUploadResult = await uploadToCloudinary(foto.buffer, "guru", nip);
    }
    let passwordHash = "";
    if (password !== "") {
      passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.guru.update({
          where: { id },
          data: {
            nik,
            ...(passwordHash && { password: passwordHash }), // Update password jika tidak kosong
            jabatan,
            nama,
            tempatLahir,
            tanggalLahir,
            alamat,
            agama,
            jenisKelamin,
            noTelepon,
            email,
            status,
            foto: imageUploadResult?.url || existingGuru.foto,
            fotoId: imageUploadResult?.fileId || existingGuru.fotoId,
            nip, // Sekalian update NIP di sini
          },
        });

        await tx.kelas.updateMany({
          where: { nip: existingGuru.nip },
          data: { nip },
        });

        await tx.kehadiran_Guru_Dan_Staff.updateMany({
          where: { nip: existingGuru.nip },
          data: { nip },
        });

        await tx.riwayatPendidikanGuru.updateMany({
          where: { nip: existingGuru.nip },
          data: { nip },
        });

        await tx.perizinanGuru.updateMany({
          where: { nip: existingGuru.nip },
          data: { nip },
        });

        await tx.logs.updateMany({
          where: { nip: existingGuru.nip },
          data: { nip },
        });
      },
      { timeout: 10000 } // Tambah timeout jika transaksi lama
    );
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const deleteGuru = async (nip) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existingGuru = await tx.guru.findUnique({ where: { nip } });
      if (!existingGuru) {
        throw new Error("Guru dengan NIP tersebut tidak ditemukan");
      }
      await deleteFromImageKit(existingGuru.fotoId);
      await tx.guru.delete({ where: { nip } });
      await tx.riwayatPendidikanGuru.deleteMany({ where: { nip } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const getGuruByNip = async (nip) => {
  const guru = await prisma.guru.findUnique({
    where: { id: nip },
    select: {
      nip: true,
      nik: true,
      nama: true,
      jabatan: true,
      tempatLahir: true,
      tanggalLahir: true,
      alamat: true,
      agama: true,
      jenisKelamin: true,
      noTelepon: true,
      email: true,
      status: true,
      foto: true,
      fotoId: true,
      RiwayatPendidikanGuru: true, // Tetap mengambil relasi
    },
  });

  if (!guru) {
    throw new Error("Guru tidak ditemukan");
  }
  return guru;
};

const createSiswa = async (siswa, foto) => {
  const {
    nis,
    nik,
    nama,
    jurusan,
    tanggalLahir,
    tempatLahir,
    namaAyah,
    namaIbu,
    tahunLulus,
    poin,
    noTeleponOrtu,
    alamat,
    agama,
    jenisKelamin,
    noTelepon,
    email,
    ekstraKulikulerPeminatan,
    ekstraKulikulerWajib,
  } = siswa;

  const imageUploadResult = foto ? await uploadToImageKit(foto, "siswa") : null;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.siswa.create({
        data: {
          nis,
          nik,
          nama,
          jurusan,
          tanggalLahir: new Date(`${tanggalLahir}T00:00:00Z`),
          tempatLahir,
          namaAyah,
          namaIbu,
          tahunLulus,
          alamat,
          agama,
          jenisKelamin,
          noTelepon,
          noTeleponOrtu,
          email,
          ekstraKulikulerPeminatan,
          ekstraKulikulerWajib,
          foto: imageUploadResult?.url,
          fotoId: imageUploadResult?.fileId,
        },
      });
    });
    return;
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const updateSiswa = async (id, siswa, foto) => {
  const {
    nik,
    nis,
    nama,
    jurusan,
    tanggalLahir,
    tempatLahir,
    namaAyah,
    namaIbu,
    tahunLulus,
    poin,
    alamat,
    agama,
    jenisKelamin,
    noTelepon,
    email,
    ekstraKulikulerPeminatan,
    ekstraKulikulerWajib,
  } = siswa;
  try {
    let imageUploadResult = null;
    let existingSiswa = null;
    if (foto) {
      existingSiswa = await prisma.siswa.findUnique({
        where: { id: id },
      });
      if (!existingSiswa) {
        throw new Error("Siswa dengan NIS tersebut tidak ditemukan");
      }

      if (existingSiswa.fotoId) {
        await deleteFromImageKit(existingSiswa.fotoId);
      }

      imageUploadResult = await uploadToImageKit(foto, "siswa");
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.siswa.update({
          where: { id: nis },
          data: {
            nik,
            nis,
            nama,
            jurusan,
            tanggalLahir: new Date(`${tanggalLahir}T00:00:00Z`),
            tempatLahir,
            namaAyah,
            namaIbu,
            tahunLulus,
            poin,
            alamat,
            agama,
            jenisKelamin,
            noTelepon,
            email,
            ekstraKulikulerPeminatan,
            ekstraKulikulerWajib,
            foto: imageUploadResult?.url,
            fotoId: imageUploadResult?.fileId,
          },
        });

        await tx.daftarSiswa.updateMany({
          where: { nis: existingSiswa.nis },
          data: { nis: nis },
        });
        await tx.daftarSiswaKelas.updateMany({
          where: { nis: existingSiswa.nis },
          data: { nis: nis },
        });
        await tx.nilaiSiswa.updateMany({
          where: { nis: existingSiswa.nis },
          data: { nis: nis },
        });
        await tx.kehadiranSiswa.updateMany({
          where: { nis: existingSiswa.nis },
          data: { nis: nis },
        });
        await tx.pelanggaran_Dan_Prestasi_Siswa.updateMany({
          where: { nis: existingSiswa.nis },
          data: { nis: nis },
        });
        await tx.peminjaman_dan_Pengembalian.updateMany({
          where: { nis: existingSiswa.nis },
          data: { nis: nis },
        });
      },
      { timeout: 10000 }
    );

    return;
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const deleteSiswa = async (nis) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existingSiswa = await tx.siswa.findFirst({ where: { nis: nis } });
      if (!existingSiswa) {
        throw new Error("Siswa dengan NIS tersebut tidak ditemukan");
      }
      await deleteFromImageKit(existingSiswa.fotoId);
      await tx.siswa.delete({ where: { nis: nis } });
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const getSiswaByNis = async (nis) => {
  const siswa = await prisma.siswa.findUnique({ where: { id: nis } });
  if (!siswa) {
    throw new Error("Siswa dengan NIS tersebut tidak ditemukan");
  } else {
    return siswa;
  }
};

const getAllGuru = async ({ page = 1, pageSize = 10, nama = "", nip = "" }) => {
  try {
    const skip = (page - 1) * pageSize; // Hitung pagination

    const data = await prisma.guru.findMany({
      skip,
      take: pageSize,
      where: {
        AND: [
          {
            nama: {
              contains: nama, // Pastikan tidak undefined
              mode: "insensitive",
            },
          },
          {
            nip: {
              contains: nip, // Pastikan tidak undefined
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const totalGuru = await prisma.guru.count({
      where: {
        AND: [
          {
            nama: {
              contains: nama,
              mode: "insensitive",
            },
          },
          {
            nip: {
              contains: nip,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return {
      data,
      total: totalGuru,
      page,
      pageSize,
      totalPages: Math.ceil(totalGuru / pageSize),
    };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const getAllSiswa = async ({
  page = 1,
  pageSize = 10,
  nama = "",
  nis = "",
  kelas = "",
}) => {
  try {
    const skip = (page - 1) * 10;
    const take = 10;

    const where = {};

    if (nama) {
      where.nama = { contains: nama, mode: "insensitive" };
    }

    if (nis) {
      where.nis = { contains: nis, mode: "insensitive" };
    }

    if (kelas) {
      where.kelas = { contains: kelas, mode: "insensitive" };
    }

    const data = await prisma.siswa.findMany({
      skip,
      take,
      where,
    });

    const totalSiswa = await prisma.siswa.count({
      where,
    });

    return {
      data,
      total: totalSiswa,
      page,
      pageSize,
      totalPages: Math.ceil(totalSiswa / pageSize),
    };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export {
  createRiwayatPendidikan,
  deleteRiwayatPendidikan,
  getAllGuru,
  getAllSiswa,
  createGuru,
  updateGuru,
  deleteGuru,
  getGuruByNip,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getSiswaByNis,
};
