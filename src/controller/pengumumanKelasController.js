import * as pengumumanKelasService from "../services/pengumumanKelasService.js";

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

export const updatePengumumanKelas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { idKelas, title, time, content } = req.body;
    const result = await pengumumanKelasService.updatePengumumanKelas(id, {
      idKelas,
      title,
      time: new Date(),
      content,
    });
    return res.json({
      message: "Pengumuman kelas berhasil diupdate",
      data: result,
    });
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

export const createPengumumanKelas = async (req, res, next) => {
  try {
    const { idKelas, title, content } = req.body;
    const { idGuru } = req.user;

    // Waktu sekarang
    const time = new Date();

    // Jika user memilih "Semua"
    if (idKelas === "All") {
      // Ambil semua kelas yang diajar guru
      const kelasGuru =
        await pengumumanKelasService.getAllKelasAndMapelByGuruService(idGuru);

      // Filter hanya yang type-nya "Kelas"
      // const hanyaKelas = kelasGuru.filter((k) => k.type === "Kelas");

      // Buat pengumuman untuk setiap kelas
      const createPromises = kelasGuru.map((k) =>
        pengumumanKelasService.createPengumumanKelas({
          idKelas: k.id,
          title,
          content,
          time,
          idGuru,
        })
      );

      // Tunggu semua proses selesai
      const results = await Promise.all(createPromises);

      return res.status(201).json({
        message: "Pengumuman berhasil dikirim ke semua kelas",
        data: results,
      });
    } else if (idKelas === "Semua Mapel") {
      const kelasGuru = await getAllKelasAndMapelByGuruService(idGuru);

      // Filter hanya yang type-nya "Kelas"
      const hanyaKelas = kelasGuru.filter((k) => k.type === "Mapel");

      // Buat pengumuman untuk setiap kelas
      const createPromises = hanyaKelas.map((k) =>
        pengumumanKelasService.createPengumumanKelas({
          idKelas: k.id,
          title,
          content,
          time,
          idGuru,
        })
      );

      // Tunggu semua proses selesai
      const results = await Promise.all(createPromises);

      return res.status(201).json({
        message: "Pengumuman berhasil dikirim ke semua kelas",
        data: results,
      });
    }

    // Jika user memilih 1 kelas tertentu
    const result = await pengumumanKelasService.createPengumumanKelas({
      idKelas,
      title,
      content,
      time,
      idGuru,
    });

    return res.status(201).json({
      message: "Pengumuman kelas berhasil dibuat",
      data: result,
    });
  } catch (error) {
    console.error("Error createPengumumanKelas:", error);
    return res.status(500).json({
      message: error.message || "Gagal membuat pengumuman kelas",
      success: false,
    });
  }
};
