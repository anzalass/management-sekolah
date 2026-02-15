import * as pengumumanKelasService from "../services/pengumumanKelasService.js";
import memoryUpload from "../utils/multer.js";

export const getAllPengumumanKelas = async (req, res, next) => {
  try {
    const result = await pengumumanKelasService.getAllPengumumanKelas();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPengumumanKelasById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pengumumanKelasService.getPengumumanKelasById(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: "Pengumuman kelas tidak ditemukan" });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPengumumanKelasByKelasId = async (req, res, next) => {
  try {
    const { idKelas } = req.params;
    const result = await pengumumanKelasService.getPengumumanKelasByKelasId(
      idKelas
    );
    if (!result) {
      return res
        .status(404)
        .json({ message: "Pengumuman kelas tidak ditemukan" });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getPengumumanKelasByKelasByGuru = async (req, res, next) => {
  try {
    const result = await pengumumanKelasService.getPengumumanKelasByGuru(
      req.user.idGuru
    );
    if (!result) {
      return res
        .status(404)
        .json({ message: "Pengumuman kelas tidak ditemukan" });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deletePengumumanKelas = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pengumumanKelasService.deletePengumumanKelas(id);
    return res.json({ message: "Pengumuman kelas berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllKelasAndMapelByGuruController = async (req, res) => {
  try {
    const result =
      await pengumumanKelasService.getAllKelasAndMapelByGuruService(
        req.user.idGuru
      );
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createPengumumanKelas = async (req, res) => {
  try {
    const { idKelas, title, content, time } = req.body;
    const { idGuru } = req.user;
    const image = req.file || null;

    if (!idKelas || !title || !content) {
      return res.status(400).json({ message: "Data wajib diisi" });
    }

    // 🔥 SEMUA KELAS
    if (idKelas === "All" || idKelas === "Semua Mapel") {
      const kelasGuru =
        await pengumumanKelasService.getAllKelasAndMapelByGuruService(idGuru);

      const target =
        idKelas === "All"
          ? kelasGuru.filter((k) => k.type === "Kelas")
          : kelasGuru.filter((k) => k.type === "Mapel");

      const results = await Promise.all(
        target.map((k) =>
          pengumumanKelasService.createPengumumanKelas(
            { idKelas: k.id, title, content, time, idGuru },
            image
          )
        )
      );

      return res.status(201).json({
        message: "Pengumuman berhasil dikirim",
        data: results,
      });
    }

    // 🔥 SATU KELAS
    const result = await pengumumanKelasService.createPengumumanKelas(
      { idKelas, title, content, time: new Date(time), idGuru },
      image
    );

    res.status(201).json({
      message: "Pengumuman kelas berhasil dibuat",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePengumumanKelas = async (req, res) => {
  try {
    const { id } = req.params;
    const { idKelas, title, content } = req.body;
    const image = req.file || null;

    const result = await pengumumanKelasService.updatePengumumanKelas(
      id,
      { idKelas, title, content, time: new Date() },
      image
    );

    res.json({
      message: "Pengumuman kelas berhasil diupdate",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
