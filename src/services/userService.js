import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs/promises";

import bcrypt from "bcryptjs";
import {
  deleteFromCloudinary,
  deleteFromImageKit,
  uploadToCloudinary,
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
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(foto);

    let imageUploadResult = null;

    if (foto && foto.buffer && foto.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(foto.buffer, "guru", nip);
    }

    const newGuru = await prisma.guru.create({
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
        foto: imageUploadResult?.secure_url || null,
        fotoId: imageUploadResult?.public_id || null,
      },
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
            idGuru: nip, // or however you want to map this
            nama: data.data[index].nama,
            jenjangPendidikan: data.data[index].jenjangPendidikan,
            gelar: data.data[index].gelar,
            tahunLulus: data.data[index].tahunLulus,
          },
        });
      }
    });
  } catch (error) {
    console.log(error);
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
    const existingGuru = await prisma.guru.findUnique({ where: { id } });
    if (!existingGuru)
      throw new Error("Guru dengan ID tersebut tidak ditemukan");

    // Upload foto baru kalau ada
    let imageUploadResult = null;
    if (foto && foto.buffer && foto.buffer.length > 0) {
      if (existingGuru.fotoId) {
        try {
          await deleteFromCloudinary(existingGuru.fotoId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }
      imageUploadResult = await uploadToCloudinary(foto.buffer, "guru", nip);
      console.log("Foto baru di-upload:", imageUploadResult);
    }

    const passwordHash = password?.trim()
      ? await bcrypt.hash(password, 10)
      : "";

    await prisma.$transaction(async (tx) => {
      // 1️⃣ Update data guru utama
      await tx.guru.update({
        where: { id },
        data: {
          nip,
          nik,
          jabatan,
          nama,
          tempatLahir,
          tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
          alamat,
          agama,
          jenisKelamin,
          noTelepon,
          email,
          status,
          ...(passwordHash && { password: passwordHash }),
          ...(imageUploadResult && {
            foto: imageUploadResult.secure_url,
            fotoId: imageUploadResult.public_id,
          }),
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const deleteGuru = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existingGuru = await tx.guru.findUnique({ where: { id } });

      if (!existingGuru) {
        throw new Error("Guru dengan NIP tersebut tidak ditemukan");
      }
      if (existingGuru.fotoId) {
        try {
          await deleteFromImageKit(existingGuru.fotoId);
          console.log("Gambar berhasil dihapus dari ImageKit.");
        } catch (imageError) {
          console.warn(
            "Gagal menghapus gambar dari ImageKit:",
            imageError.message
          );
        }
      } else {
        console.log("Guru tidak memiliki fotoId, skip hapus gambar.");
      }
      await tx.riwayatPendidikanGuru.deleteMany({ where: { idGuru: id } });
      await tx.kehadiranGuru.deleteMany({
        where: { idGuru: id },
      });
      await tx.logs.deleteMany({
        where: { idGuru: id },
      });
      await tx.jadwalMengajar.deleteMany({ where: { idGuru: id } });
      await tx.perizinanGuru.deleteMany({ where: { idGuru: id } });

      await tx.guru.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Delete guru error:", error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const getGuruByID = async (id) => {
  const guru = await prisma.guru.findUnique({
    where: { id: id },
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
    kelas,
    tanggalLahir,
    tempatLahir,
    namaAyah,
    namaIbu,
    tahunLulus,
    password,
    noTeleponOrtu,
    alamat,
    agama,
    jenisKelamin,
    noTelepon,
    email,
    ekstraKulikulerPeminatan,
    ekstraKulikulerWajib,
  } = siswa;
  let imageUploadResult;

  if (foto && foto.buffer && foto.buffer.length > 0) {
    imageUploadResult = await uploadToCloudinary(foto.buffer, "siswa", nis);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.siswa.create({
        data: {
          nis,
          nik,
          nama,
          kelas,
          jurusan,
          tanggalLahir: new Date(`${tanggalLahir}T00:00:00Z`),
          tempatLahir,
          namaAyah,
          password: passwordHash,
          namaIbu,
          tahunLulus,
          alamat,
          poin: 0,
          agama,
          jenisKelamin,
          noTelepon,
          noTeleponOrtu,
          email,
          ekstraKulikulerPeminatan,
          ekstraKulikulerWajib,
          foto: imageUploadResult?.secure_url,
          fotoId: imageUploadResult?.public_id,
        },
      });
    });
    return;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const updateSiswa = async (id, siswa, foto) => {
  const {
    nik,
    nis,
    nama,
    kelas,
    jurusan,
    tanggalLahir,
    tempatLahir,
    namaAyah,
    namaIbu,
    tahunLulus,
    password,
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

    const passwordHash = password?.trim()
      ? await bcrypt.hash(password, 10)
      : "";

    // Ambil data siswa dari database, wajib di luar blok `if (foto)`
    const existingSiswa = await prisma.siswa.findUnique({
      where: { id: id },
    });

    if (!existingSiswa) {
      throw new Error("Siswa dengan ID tersebut tidak ditemukan");
    }

    // Kalau ada foto baru, hapus yang lama lalu upload yang baru
    if (foto && foto.buffer && foto.buffer.length > 0) {
      if (existingSiswa.fotoId) {
        try {
          await deleteFromCloudinary(existingSiswa.fotoId);
        } catch (err) {
          console.warn("Gagal hapus foto lama:", err.message);
        }
      }
      imageUploadResult = await uploadToCloudinary(foto.buffer, "siswa", nis);
      console.log("Foto baru di-upload:", imageUploadResult);
    }

    // Update menggunakan transaksi
    await prisma.$transaction(async (tx) => {
      await tx.siswa.update({
        where: { id: id },
        data: {
          nik,
          nis,
          nama,
          kelas,
          jurusan,
          password: password ? passwordHash : existingSiswa.password,
          tanggalLahir: tanggalLahir
            ? new Date(`${tanggalLahir}T00:00:00Z`)
            : undefined,
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
          foto: imageUploadResult?.secure_url || existingSiswa.foto,
          fotoId: imageUploadResult?.public_id || existingSiswa.fotoId,
        },
      });
    });

    return;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const deleteSiswa = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existingSiswa = await tx.siswa.findFirst({ where: { id } });

      if (!existingSiswa) {
        throw new Error("Siswa dengan NIS tersebut tidak ditemukan");
      }
      if (existingSiswa.fotoId) {
        try {
          await deleteFromCloudinary(existingSiswa.fotoId);
        } catch (imageKitError) {
          console.warn(
            "Gagal hapus file dari ImageKit:",
            imageKitError.message
          );
        }
      }
      await tx.catatanPerkembanganSiswa.deleteMany({
        where: { idSiswa: id },
      });
      await tx.summaryMateri.deleteMany({ where: { idSiswa: id } });
      await tx.summaryTugas.deleteMany({ where: { idSiswa: id } });
      await tx.nilaiSiswa.deleteMany({ where: { idSiswa: id } });
      await tx.daftarSiswaKelas.deleteMany({ where: { idSiswa: id } });
      await tx.daftarSiswaMapel.deleteMany({ where: { idSiswa: id } });
      await tx.kehadiranSiswa.deleteMany({ where: { idSiswa: id } });
      await tx.pelanggaran_Dan_Prestasi_Siswa.deleteMany({
        where: { idSiswa: id },
      });
      await tx.peminjaman_dan_Pengembalian.deleteMany({
        where: { idSiswa: id },
      });
      await tx.perizinanSiswa.deleteMany({ where: { idSiswa: id } });
      await tx.konseling.deleteMany({ where: { idSiswa: id } });

      await tx.siswa.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Error saat delete siswa:", error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const getSiswaByID = async (id) => {
  const siswa = await prisma.siswa.findUnique({
    where: { id: id },
    select: {
      id: true,
      nis: true,
      nik: true,
      nama: true,
      jurusan: true,
      tanggalLahir: true,
      tempatLahir: true,
      namaAyah: true,
      namaIbu: true,
      tahunLulus: true,
      alamat: true,
      alamat: true,
      agama: true,
      kelas: true,
      jenisKelamin: true,
      foto: true,
      noTelepon: true,
      noTeleponOrtu: true,
      email: true,
      ekstraKulikulerPeminatan: true,
      ekstraKulikulerWajib: true,
    },
  });
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
    const skip = (page - 1) * pageSize;
    const take = pageSize;

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
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getGuruByID,
  getSiswaByID,
};
