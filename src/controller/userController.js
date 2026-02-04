import {
  createGuru,
  updateGuru,
  deleteGuru,
  createSiswa,
  updateSiswa,
  deleteSiswa,
  getAllGuru,
  getAllSiswa,
  createRiwayatPendidikan,
  deleteRiwayatPendidikan,
  getGuruByID,
  getSiswaByID,
  getAllSiswaMaster,
  getAllGuruMaster,
  updateFotoGuru,
  updatePassword,
  updateFotoSiswa,
  updatePasswordSiswa,
  naikKelasSiswa,
  luluskanSiswa,
} from "../services/userService.js";
import memoryUpload from "../utils/multer.js";
import upload from "../utils/multer.js";

export const createGuruController = async (req, res) => {
  memoryUpload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const result = await createGuru(req.body, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat guru", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const updateFotoGuruController = async (req, res) => {
  memoryUpload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const result = await updateFotoGuru(req.params.idGuru, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat guru", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const updateFotoSiswaController = async (req, res) => {
  memoryUpload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const result = await updateFotoSiswa(req.params.idSiswa, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat guru", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const createRiwayatPendidikanController = async (req, res, next) => {
  try {
    await createRiwayatPendidikan(req.params.idGuru, req.body);
    return res
      .status(201)
      .json({ message: "Berhasil membuat riwayat pendidikan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePasswordController = async (req, res) => {
  const { idGuru } = req.params;
  const { newPassword } = req.body;

  if (!idGuru) {
    return res.status(400).json({ message: "ID guru tidak boleh kosong" });
  }

  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password baru minimal 8 karakter" });
  }

  try {
    const updatedGuru = await updatePassword(idGuru, newPassword);

    return res.status(200).json({
      message: "Password berhasil diupdate",
      data: {
        id: updatedGuru.id,
        nama: updatedGuru.nama,
        nip: updatedGuru.nip,
      },
    });
  } catch (error) {
    console.error("Gagal update password guru:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Terjadi kesalahan server" });
  }
};

export const updatePasswordSiswaController = async (req, res) => {
  const { idSiswa } = req.params;
  const { newPassword } = req.body;

  if (!idSiswa) {
    return res.status(400).json({ message: "ID guru tidak boleh kosong" });
  }

  console.log(newPassword);

  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password baru minimal 8 karakter" });
  }

  try {
    const updatedSiswa = await updatePasswordSiswa(idSiswa, newPassword);

    return res.status(200).json({
      message: "Password berhasil diupdate",
      data: {
        id: updatedSiswa.id,
        nama: updatedSiswa.nama,
        nis: updatedSiswa.nis,
      },
    });
  } catch (error) {
    console.error("Gagal update password guru:", error);
    return res
      .status(500)
      .json({ message: error?.message || "Terjadi kesalahan server" });
  }
};

export const naikKelasController = async (req, res) => {
  try {
    const { idSiswa } = req.params;
    const { kelasBaru } = req.body;

    if (!kelasBaru) {
      return res.status(400).json({ message: "Kelas baru wajib diisi" });
    }

    const updated = await naikKelasSiswa(idSiswa, kelasBaru);
    res.json({ message: "Siswa berhasil naik kelas", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Terjadi kesalahan" });
  }
};

/**
 * Luluskan / Ga Luluskan Siswa
 */
export const luluskanController = async (req, res) => {
  try {
    const { idSiswa } = req.params;
    const { lulus, tahun } = req.body;

    if (lulus === undefined) {
      return res.status(400).json({ message: "Status lulus wajib diisi" });
    }

    const updated = await luluskanSiswa(idSiswa, lulus, tahun);
    res.json({
      message: `Siswa berhasil ${lulus ? "diluluskan" : "tidak diluluskan"}`,
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Terjadi kesalahan" });
  }
};

export const deleteRiwayatPendidikanController = async (req, res, next) => {
  try {
    await deleteRiwayatPendidikan(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus riwayat pendidikan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateGuruController = async (req, res, next) => {
  upload.single("foto")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      console.log("Uploaded file:", req.file); // 👈 DEBUG
      const result = await updateGuru(req.params.idGuru, req.body, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil mengupdate guru", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deleteGuruController = async (req, res, next) => {
  try {
    await deleteGuru(req.params.idGuru);
    return res.status(200).json({ message: "Berhasil menghapus guru" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getGuruByIDController = async (req, res, next) => {
  try {
    const result = await getGuruByID(req.params.idGuru);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan guru", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createSiswaController = async (req, res, next) => {
  memoryUpload.single("foto")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const result = await createSiswa(req.body, req.file);
      return res
        .status(201)
        .json({ message: "Berhasil membuat siswa", data: result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const updateSiswaController = async (req, res, next) => {
  memoryUpload.single("foto")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Gagal upload foto", error: err.message });
    }

    try {
      const result = await updateSiswa(req.params.idSiswa, req.body, req.file);
      return res.status(201).json({
        message: "Berhasil mengupdate siswa",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

export const deleteSiswaController = async (req, res, next) => {
  try {
    await deleteSiswa(req.params.idSiswa);
    return res.status(200).json({ message: "Berhasil menghapus siswa" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSiswaByIDController = async (req, res, next) => {
  try {
    const result = await getSiswaByID(req.params.idSiswa);
    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan siswa", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllGuruController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await getAllGuru({
      page,
      pageSize,
      nama: req.query.nama || "",
      nip: req.query.nip || "",
    });

    return res.status(200).json({
      message: "Berhasil mendapatkan semua guru",
      result,
    });
  } catch (error) {
    console.error("Error di getAllGuruController:", error); // Log error di backend
    return res.status(500).json({ message: error.message });
  }
};

export const getAllGuruMasterController = async (req, res, next) => {
  try {
    const result = await getAllGuruMaster();

    return res.status(200).json({
      message: "Berhasil mendapatkan semua guru",
      result,
    });
  } catch (error) {
    console.error("Error di getAllGuruController:", error); // Log error di backend
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSiswaController = async (req, res, next) => {
  try {
    const result = await getAllSiswa({
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
      nama: req.query.nama || "",
      nis: req.query.nis || "",
      kelas: req.query.kelas || "",
    });

    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan semua siswa", result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllSiswaMasterController = async (req, res, next) => {
  try {
    const result = await getAllSiswaMaster();

    return res
      .status(200)
      .json({ message: "Berhasil mendapatkan semua siswa", result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
