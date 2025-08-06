import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/ImageHandler.js";

const prisma = new PrismaClient();

export const createMateriMapel = async (data, file) => {
  try {
    let UploadResult = null;

    if (file && file.buffer) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("File kosong saat dibaca dari buffer");
      }

      UploadResult = await uploadToCloudinary(
        file.buffer,
        "materi",
        data.judul
      );
    }

    console.log("pdf", file);
    console.log("res pdf", UploadResult);

    await prisma.materiMapel.create({
      data: {
        judul: data.judul,
        tanggal: new Date(),
        idKelasMapel: data.idKelasMapel,
        iframeGoogleSlide: data.iframeGoogleSlide,
        iframeYoutube: data.iframeGoogleSlide,
        konten: data.konten,
        pdfUrl: UploadResult?.secure_url || null,
        pdfUrlId: UploadResult?.public_id || null,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllMateriMapel = async () => {
  try {
    return await prisma.materiMapel.findMany();
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getMateriMapelById = async (id) => {
  try {
    return await prisma.materiMapel.findUnique({
      where: { id },
      include: { SummaryMateri: true, KelasMapel: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteMateriMapel = async (id) => {
  try {
    const dataMateri = await prisma.materiMapel.findUnique({
      where: { id },
    });

    if (!dataMateri) {
      throw new Error("Data materi tidak ditemukan");
    }

    // Hapus file dari Cloudinary (jika ada ID-nya)
    if (dataMateri.pdfUrlId) {
      await deleteFromCloudinary(dataMateri.pdfUrlId);
    }

    await prisma.summaryMateri.deleteMany({
      where: {
        idMateri: id,
      },
    });

    // Hapus dari database
    await prisma.materiMapel.delete({
      where: { id: dataMateri.id },
    });

    return { message: "Data berhasil dihapus" };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

// === SummaryMateri ===

export const createSummaryMateri = async (data) => {
  try {
    return await prisma.summaryMateri.create({ data });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllSummaryMateri = async () => {
  try {
    return await prisma.summaryMateri.findMany({
      include: { Siswa: true, MateriMapel: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getSummaryMateriById = async (id) => {
  try {
    return await prisma.summaryMateri.findUnique({
      where: { id },
      include: { Siswa: true, MateriMapel: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteSummaryMateri = async (id) => {
  try {
    return await prisma.summaryMateri.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getSummaryByMateriId = async (idMateri) => {
  try {
    return await prisma.summaryMateri.findMany({
      where: { idMateri },
      include: {
        Siswa: true,
        MateriMapel: true,
      },
    });
  } catch (error) {
    console.log(error);

    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const createTugasMapel = async (data, file) => {
  try {
    let UploadResult = null;

    if (file && file.buffer) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("File kosong saat dibaca dari buffer");
      }

      UploadResult = await uploadToCloudinary(file.buffer, "tugas", data.judul);
    }

    await prisma.tugasMapel.create({
      data: {
        judul: data.judul,
        deadline: new Date(`${data.deadline}T00:00:00Z`),
        idKelasMapel: data.idKelasMapel,
        iframeGoogleSlide: data.iframeGoogleSlide,
        iframeYoutube: data.iframeGoogleSlide,
        konten: data.konten,
        pdfUrl: UploadResult?.secure_url || null,
        pdfUrlId: UploadResult?.public_id || null,
      },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getAllTugasMapel = async () => {
  try {
    return await prisma.tugasMapel.findMany();
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getTugasMapelById = async (id) => {
  try {
    return await prisma.tugasMapel.findUnique({
      where: { id },
      include: { SummaryMateri: true, KelasMapel: true },
    });
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const deleteTugasMapel = async (id) => {
  try {
    const dataTugas = await prisma.tugasMapel.findUnique({
      where: { id },
    });

    if (!dataTugas) {
      throw new Error("Data materi tidak ditemukan");
    }

    // Hapus file dari Cloudinary (jika ada ID-nya)
    if (dataTugas.pdfUrlId) {
      await deleteFromCloudinary(dataTugas.pdfUrlId);
    }

    await prisma.summaryTugas.deleteMany({
      where: { idTugas: dataTugas.id },
    });

    // Hapus dari database
    await prisma.tugasMapel.delete({
      where: { id: dataTugas.id },
    });

    return { message: "Data berhasil dihapus" };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getMateriAndSummaryByMateriID = async (id) => {
  try {
    const materi = await prisma.materiMapel.findUnique({
      where: {
        id,
      },
      include: {
        SummaryMateri: {
          select: {
            id: true,
            nisSiswa: true,
            content: true,
            waktu: true,
            Siswa: {
              select: {
                foto: true,
                nama: true,
              },
            },
          },
        },
      },
    });

    if (!materi) return null;

    // Format summary jadi versi yang kamu mau
    const formattedSummary = materi.SummaryMateri.map((item) => ({
      id: item.id,
      nisSiswa: item.nisSiswa,
      nama: item.Siswa.nama,
      content: item.content,
      fotoSiswa: item.Siswa?.foto || null,
      waktu: item.createdAt,
    }));

    // Kembalikan data materi dengan summary yang sudah diformat
    return {
      ...materi,
      SummaryMateri: formattedSummary,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const getTugasAndSummaryByTugasID = async (id) => {
  try {
    const tugas = await prisma.tugasMapel.findUnique({
      where: {
        id,
      },

      include: {
        SummaryTugas: {
          select: {
            id: true,
            nisSiswa: true,
            content: true,
            waktu: true,
            Siswa: {
              select: {
                foto: true,
                nama: true,
              },
            },
          },
        },
      },
    });

    if (!tugas) return null;

    // Format summary jadi versi yang kamu mau
    const formattedSummary = tugas.SummaryTugas.map((item) => ({
      id: item.id,
      nisSiswa: item.nisSiswa,
      nama: item.Siswa.nama,
      content: item.content,
      fotoSiswa: item.Siswa?.foto || null,
      waktu: item.createdAt,
    }));

    // Kembalikan data materi dengan summary yang sudah diformat
    return {
      ...tugas,
      SummaryTugas: formattedSummary,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
