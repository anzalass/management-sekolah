import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";
import { createNotifikasi } from "./notifikasiService.js";
const prisma = new PrismaClient();

export const createKelasMapel = async (data, banner) => {
  const { idGuru, namaMapel, ruangKelas, kelas, nipGuru, namaGuru } = data;
  try {
    const tahunAjaran = await prisma.sekolah.findFirst();

    let imageUploadResult = null;

    if (banner && banner.buffer && banner.buffer.length > 0) {
      imageUploadResult = await uploadToCloudinary(
        banner.buffer,
        "kelas",
        namaMapel
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.create({
        data: {
          idGuru: idGuru,
          namaMapel,
          ruangKelas,
          nipGuru,
          namaGuru,
          kelas: kelas,
          banner: imageUploadResult?.secure_url || "",
          bannerId: imageUploadResult?.public_id || "",
          tahunAjaran: tahunAjaran.tahunAjaran,
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getDetailKelasMapel = async (id, idSiswa) => {
  try {
    const detail = await prisma.kelasDanMapel.findUnique({
      where: { id },
      include: {
        MateriMapel: {
          include: {
            SummaryMateri: {
              where: { idSiswa },
            },
          },
        },
        TugasMapel: {
          include: {
            SummaryTugas: {
              where: { idSiswa },
            },
          },
        },
        UjianIframe: {
          include: {
            SelesaiUjian: {
              where: { idSiswa },
            },
          },
        },
      },
    });

    if (!detail) return null;

    // mapping: tambahin atribut past
    const materiWithPast = detail.MateriMapel.map((materi) => ({
      ...materi,
      past: materi.SummaryMateri.length > 0,
    }));

    const tugasWithPast = detail.TugasMapel.map((tugas) => ({
      ...tugas,
      past: tugas.SummaryTugas.length > 0,
    }));

    const ujianWithPast = detail.UjianIframe.map((ujian) => ({
      ...ujian,
      past: ujian.SelesaiUjian.length > 0,
    }));

    return {
      ...detail,
      MateriMapel: materiWithPast,
      TugasMapel: tugasWithPast,
      UjianMapel: ujianWithPast,
    };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const updateKelasMapel = async (id, data, banner) => {
  const { namaMapel, ruangKelas, kelas } = data;
  let imageUploadResult = null;

  const oldKelas = await prisma.kelasDanMapel.findUnique({
    where: {
      id: id,
    },
  });

  if (banner && banner.buffer && banner.buffer.length > 0) {
    if (oldKelas.bannerId) {
      try {
        await deleteFromCloudinary(oldKelas.bannerId);
      } catch (err) {
        console.warn("Gagal hapus foto lama:", err.message);
      }
    }
    imageUploadResult = await uploadToCloudinary(
      banner.buffer,
      "cms",
      namaMapel
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.kelasDanMapel.update({
        where: { id },
        data: {
          namaMapel,
          ruangKelas,
          kelas,
          banner: imageUploadResult.secure_url
            ? imageUploadResult?.secure_url
            : oldKelas.banner,
          bannerId: imageUploadResult.public_id
            ? imageUploadResult.public_id
            : oldKelas.bannerId,
        },
      });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteKelasMapel = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.summaryMateri.deleteMany({
        where: {
          idKelasMapel: id,
        },
      });
      await tx.ujianIframe.deleteMany({
        where: {
          idKelasMapel: id,
        },
      });
      await tx.summaryTugas.deleteMany({
        where: {
          idKelasMapel: id,
        },
      });

      await tx.nilaiSiswa.deleteMany({
        where: {
          idKelasDanMapel: id,
        },
      });

      await tx.materiMapel.deleteMany({
        where: {
          idKelasMapel: id,
        },
      });

      await tx.tugasMapel.deleteMany({
        where: {
          idKelasMapel: id,
        },
      });

      await tx.jenisNilai.deleteMany({
        where: {
          idKelasMapel: id,
        },
      });

      await tx.daftarSiswaMapel.deleteMany({
        where: {
          idKelas: id,
        },
      });

      await tx.kelasDanMapel.delete({ where: { id } });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const addSiswatoKelasKelasMapel = async (data) => {
  const { idSiswa, idKelas, nisSiswa, namaSiswa } = data;
  try {
    await prisma.$transaction(async (tx) => {
      // Cek apakah siswa dengan NIS sudah ada di kelas ini
      const existing = await tx.daftarSiswaMapel.findFirst({
        where: {
          idSiswa,
          idKelas,
        },
      });

      if (existing) {
        throw new Error("Siswa dengan NIS tersebut sudah ada di dalam kelas.");
      }

      const kelas = await tx.kelasDanMapel.findUnique({
        where: {
          id: idKelas,
        },
        select: {
          namaMapel: true,
          idGuru: true,
          id: true,
        },
      });

      // Tambahkan siswa jika belum ada
      const addSiswa = await tx.daftarSiswaMapel.create({
        data: { idKelas, namaSiswa, nisSiswa, idSiswa },
      });

      if (addSiswa) {
        await createNotifikasi({
          idSiswa: addSiswa.idSiswa,
          idTerkait: addSiswa.id,
          kategori: "Menambah Siswa",
          createdBy: kelas.idGuru,
          idKelas: kelas.id,
          redirectSiswa: "/siswa/kelas",
          keterangan: `Anda ditambahkan ke dalam kelas ${kelas.namaMapel}`,
        });
      }
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const removeSiswaFromKelasMapel = async (id) => {
  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.daftarSiswaMapel.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Data tidak ditemukan, tidak bisa dihapus");
      }

      const removeSiswa = await tx.daftarSiswaMapel.delete({
        where: { id },
      });

      const kelas = await tx.kelasDanMapel.findUnique({
        where: {
          id: id,
        },
        select: {
          namaMapel: true,
          idGuru: true,
          id: true,
        },
      });

      if (removeSiswa) {
        await createNotifikasi({
          idSiswa: removeSiswa.idSiswa,
          idTerkait: removeSiswa.id,
          kategori: "Menghapus Siswa",
          createdBy: kelas.idGuru,
          idKelas: removeSiswa.idKelas,
          redirectSiswa: "/siswa/kelas",
          keterangan: `Anda dihapus dari kelas ${kelas.namaMapel}`,
        });
      }
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getKelasMapelById = async (id) => {
  try {
    const data = await prisma.kelasDanMapel.findUnique({
      where: {
        id,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
