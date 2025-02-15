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
    const passwordHash = await bcrypt.hash(password, 10);
    const imageUploadResult = foto
      ? await uploadToImageKit(foto, "guru")
      : null;

    await prisma.$transaction(async (prisma) => {
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
          foto: imageUploadResult?.url,
          fotoId: imageUploadResult?.fileId,
        },
      });

      if (RiwayatPendidikanGuru?.length) {
        const pendidikanData = RiwayatPendidikanGuru.map((pendidikan) => ({
          nip: newGuru.nip,
          nama: pendidikan.nama,
          fakultas: pendidikan.fakultas,
          jurusan: pendidikan.jurusan,
          tahunLulus: pendidikan.tahunLulus,
        }));

        await prisma.riwayatPendidikanGuru.createMany({ data: pendidikanData });
      }
    });
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateGuru = async (nip, guru, foto) => {
  const {
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
    return await prisma.$transaction(async (tx) => {
      const existingGuru = await tx.guru.findUnique({ where: { nip } });
      if (!existingGuru)
        throw new Error("Guru dengan NIP tersebut tidak ditemukan");

      let imageUploadResult = null;

      if (foto) {
        if (existingGuru.fotoId) {
          await deleteFromImageKit(existingGuru.fotoId);
        }
        imageUploadResult = await uploadToImageKit(foto, "guru");
      }
      await tx.guru.update({
        where: { nip },
        data: {
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
          foto: imageUploadResult?.url || existingGuru.foto,
          fotoId: imageUploadResult?.fileId || existingGuru.fotoId,
        },
      });
      return;
    });
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
  const guru = await prisma.guru.findUnique({ where: { nip } });
  if (!guru) {
    throw new Error("Guru tidak ditemukan");
  } else {
    return guru;
  }
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

export {
  createGuru,
  updateGuru,
  deleteGuru,
  getGuruByNip,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getSiswaByNis,
};
