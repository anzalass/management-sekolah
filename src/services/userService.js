import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcryptjs";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFotoSummaryMateriIdSiswa,
  deleteFotoSummaryTugasIdSiswa,
} from "./materiTugasSummaryService.js";

const createGuru = async (guru) => {
  const {
    nip,
    nik,
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
    const passwordHash = await bcrypt.hash("gurupassword", 10);

    const newGuru = await prisma.guru.create({
      data: {
        nip,
        nik,
        password: passwordHash,
        jabatan,
        alamat,
        nama,
        tempatLahir,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null, // <--- ini penting        alamat,
        agama,
        jenisKelamin,
        noTelepon,
        email,
        status,
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
    console.log(nip, data);

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

const updateGuru = async (id, guru) => {
  const {
    nip,
    nik,
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
    if (!existingGuru) {
      throw new Error("Guru dengan ID tersebut tidak ditemukan");
    }

    const updateData = {
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
    };

    await prisma.$transaction(async (tx) => {
      await tx.guru.update({
        where: { id },
        data: updateData,
      });
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(prismaErrorHandler(error));
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
      await deleteFotoSummaryMateriIdSiswa(id);
      await deleteFotoSummaryTugasIdSiswa(id);

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

const getAllGuruMaster = async () => {
  try {
    const data = await prisma.guru.findMany({
      select: {
        nama: true,
        id: true,
        jabatan: true,
      },
    });

    return {
      data,
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

const getAllSiswaMaster = async () => {
  try {
    const data = await prisma.siswa.findMany({});

    return {
      data,
    };
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const getNamaSiswa = async (id) => {
  try {
    const data = await prisma.siswa.findUnique({
      where: {
        id,
      },
      select: {
        nama: true,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

const updateFotoGuru = async (id, foto) => {
  try {
    // Cari data guru dulu
    const existing = await prisma.guru.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Guru tidak ditemukan");
    }

    let imageUrl;
    let imageId;

    // Upload ke Cloudinary kalau ada foto
    if (foto && foto.buffer && foto.buffer.length > 0) {
      if (existing.fotoId) {
        await deleteFromCloudinary(existing.fotoId); // fungsi hapus foto lama
      }
      const uploadResult = await uploadToCloudinary(
        foto.buffer,
        "guru",
        existing.nip
      );
      imageUrl = uploadResult.secure_url; // atau sesuai hasil return dari fungsi upload
      imageId = uploadResult.public_id;
    }

    // Update kolom foto di DB
    const updatedGuru = await prisma.guru.update({
      where: { id },
      data: {
        foto: imageUrl,
        fotoId: imageId,
      },
    });

    return updatedGuru;
  } catch (error) {
    console.error("Gagal update foto guru:", error);
    throw error;
  }
};

export const updatePassword = async (id, newPassword) => {
  try {
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password minimal 8 karakter");
    }

    // Hash password pakai bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update di database
    const updatedGuru = await prisma.guru.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return updatedGuru;
  } catch (error) {
    console.error("Gagal update password:", error);
    throw error;
  }
};

const updateFotoSiswa = async (id, foto) => {
  try {
    // Cari data guru dulu
    const existing = await prisma.siswa.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Guru tidak ditemukan");
    }

    let imageUrl;
    let imageId;

    // Upload ke Cloudinary kalau ada foto
    if (foto && foto.buffer && foto.buffer.length > 0) {
      if (existing.fotoId) {
        await deleteFromCloudinary(existing.fotoId); // fungsi hapus foto lama
      }
      const uploadResult = await uploadToCloudinary(
        foto.buffer,
        "siswa",
        existing.nip
      );
      imageUrl = uploadResult.secure_url;
      imageId = uploadResult.public_id; // atau sesuai hasil return dari fungsi upload
    }

    // Update kolom foto di DB
    const updatedSiswa = await prisma.siswa.update({
      where: { id },
      data: {
        foto: imageUrl,
        fotoId: imageId,
      },
    });

    return updatedSiswa;
  } catch (error) {
    console.error("Gagal update foto guru:", error);
    throw error;
  }
};

const updatePasswordSiswa = async (id, newPassword) => {
  try {
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password minimal 8 karakter");
    }

    // Hash password pakai bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update di database
    const updatedGuru = await prisma.siswa.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return updatedGuru;
  } catch (error) {
    console.error("Gagal update password:", error);
    throw error;
  }
};

const naikKelasSiswa = async (id, kelasBaru) => {
  try {
    await prisma.siswa.update({
      where: {
        id,
      },
      data: {
        kelas: kelasBaru,
      },
    });
  } catch (error) {
    console.error("Gagal update password:", error);
    throw error;
  }
};

const luluskanSiswa = async (id, lulus, tahun) => {
  try {
    // Cari data siswa dulu
    const existing = await prisma.siswa.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Siswa tidak ditemukan");
    }

    const updated = await prisma.siswa.update({
      where: { id },
      data: {
        tahunLulus: lulus ? tahun ?? new Date().getFullYear().toString() : null,
      },
    });

    return updated;
  } catch (error) {
    console.error("Gagal mengubah status lulus siswa:", error);
    throw error;
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
  getAllSiswaMaster,
  getNamaSiswa,
  getAllGuruMaster,
  updateFotoGuru,
  updatePasswordSiswa,
  updateFotoSiswa,
  naikKelasSiswa,
  luluskanSiswa,
};

// const pushRiwayatPendidikan = () => {
//   if (!riwayatPendidikanGuru.jenjangPendidikan) {
//     alert('Jenjang Pendidikan is required');
//     return;
//   }

//   if (
//     riwayatPendidikanGuru.jenjangPendidikan !== 'SD' &&
//     riwayatPendidikanGuru.jenjangPendidikan !== 'SMP' &&
//     riwayatPendidikanGuru.jenjangPendidikan !== 'SMA' &&
//     !riwayatPendidikanGuru.gelar
//   ) {
//     alert('Gelar is required for this Jenjang Pendidikan');
//     return;
//   }

//   if (!riwayatPendidikanGuru.nama) {
//     alert('Nama Institusi is required');
//     return;
//   }

//   if (!riwayatPendidikanGuru.tahunLulus) {
//     alert('Tahun Lulus is required');
//     return;
//   }

//   // Jika validasi lolos, push data ke array
//   setRiwayatPendidikanGuruArr((prev) => [...prev, riwayatPendidikanGuru]);

//   setRiwayatPendidikanGuru({
//     id: '',
//     jenjangPendidikan: '',
//     nama: '',
//     gelar: '',
//     tahunLulus: ''
//   });
// };

// const hapusRiwayatPendidikan = async (id: string) => {
//   try {
//     await api.delete(`user/delete-riwayat-pendidikan/${id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${session?.user?.token}`
//       }
//     });

//     setData((prevData) => prevData.filter((r) => r.id !== id));
//   } catch (error: any) {
//     toast.error(error.response?.data?.message || 'Terjadi kesalahan');
//   }
// };
