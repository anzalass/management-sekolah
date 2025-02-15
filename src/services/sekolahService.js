import { PrismaClient } from "@prisma/client";
import { deleteFromImageKit, uploadToImageKit } from "../utils/ImageHandler.js";
const prisma = new PrismaClient();

export const updateSekolah = async (id, data) => {
  const {
    nama,
    npsn,
    kas,
    desa,
    kecamatan,
    kabupaten,
    provinsi,
    telephone,
    email,
    website,
    namaKepsek,
    logo,
  } = data;

  try {
    const sekolah = await prisma.sekolah.findUnique({
      where: { id },
    });
    if (!sekolah) {
      throw new Error("Sekolah dengan ID tersebut tidak ditemukan");
    }

    let logoUploadResult = null;
    if (logo !== null) {
      await deleteFromImageKit(sekolah.logoId);
      logoUploadResult = await uploadToImageKit(logo, "sekolah");
    }
    await prisma.sekolah.update({
      where: { id },
      data: {
        nama,
        npsn,
        kas,
        desa,
        kecamatan,
        kabupaten,
        provinsi,
        telephone,
        email,
        website,
        namaKepsek,
        logo: logoUploadResult?.url,
        logoId: logoUploadResult?.fileId,
      },
    });
  } catch (error) {
    console.error("Update sekolah gagal:", error.message);
  }
};
