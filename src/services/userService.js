import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcryptjs";
import { deleteFromImageKit, uploadToImageKit } from "../utils/ImageHandler.js";

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
    RiwayatPendidikanGuru,
  } = guru;

  try {
    let newGuru;
    const passwordHash = await bcrypt.hash(password, 10);
    const imageUploadResult = foto
      ? await uploadToImageKit(foto, "guru")
      : null;

    await prisma.$transaction(async (prisma) => {
      newGuru = await prisma.guru.create({
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
          foto: imageUploadResult?.url,
          fotoId: imageUploadResult?.fileId,
        },
      });
    });

    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createRiwayatPendidikan = async (nip, data) => {
  console.log("well", data.data);

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
    throw new Error(error.message);
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
    throw new Error(error.message);
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
        await deleteFromImageKit(existingGuru.fotoId);
      }
      imageUploadResult = await uploadToImageKit(foto, "guru");
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
    throw new Error(error.message);
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
    });
  } catch (error) {
    throw new Error(error.message);
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
          foto: imageUploadResult?.url,
          fotoId: imageUploadResult?.fileId,
        },
      });
    });
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateSiswa = async (nis, siswa, foto) => {
  const {
    nik,
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
    await prisma.$transaction(async (tx) => {
      const existingSiswa = await tx.siswa.findUnique({ where: { nis } });
      if (!existingSiswa) {
        throw new Error("Siswa dengan NIS tersebut tidak ditemukan");
      }
      let imageUploadResult = null;
      if (foto) {
        if (existingSiswa.fotoId) {
          await deleteFromImageKit(existingSiswa.fotoId);
        }
        imageUploadResult = await uploadToImageKit(foto, "siswa");
      }
      await tx.siswa.update({
        where: { nis },
        data: {
          nik,
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
          foto: imageUploadResult?.url,
          fotoId: imageUploadResult?.fileId,
        },
      });
    });
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteSiswa = async (nis) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existingSiswa = await tx.siswa.findUnique({ where: { nis } });
      if (!existingSiswa) {
        throw new Error("Siswa dengan NIS tersebut tidak ditemukan");
      }
      await deleteFromImageKit(existingSiswa.fotoId);
      await tx.siswa.delete({ where: { nis } });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSiswaByNis = async (nis) => {
  const siswa = await prisma.siswa.findUnique({ where: { nis } });
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
    console.error("Error di getAllGuru:", error); // Log error di backend
    throw new Error(error.message || "Terjadi kesalahan pada server");
  }
};

const getAllSiswa = async ({ page = 1, nama = "", nis = "", kelas = "" }) => {
  try {
    const skip = (page - 1) * 10; // Menghitung jumlah data yang dilewati
    const take = 10; // Mengambil jumlah data sesuai pageSize

    const data = await prisma.siswa.findMany({
      skip: skip,
      take: take,
      where: {
        AND: [
          {
            nama: {
              contains: nama, // Pencarian berdasarkan nama
              mode: "insensitive", // Tidak case-sensitive
            },
          },
          {
            nis: {
              contains: nis, // Pencarian berdasarkan nis
              mode: "insensitive", // Tidak case-sensitive
            },
          },
          {
            kelas: {
              contains: kelas, // Pencarian berdasarkan kelas
              mode: "insensitive", // Tidak case-sensitive
            },
          },
        ],
      },
    });

    return data;
  } catch (error) {
    console.error("Error getting all guru:", error);
    throw new Error("Failed to fetch all guru.");
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
