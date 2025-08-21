import * as pengumumanKelasService from "../services/pengumumanKelasService.js";

export const createPengumumanKelas = async (req, res, next) => {
  try {
    const { idKelas, title, time, content } = req.body;
    const result = await pengumumanKelasService.createPengumumanKelas({
      idKelas,
      title,
      time: new Date(),
      content,
    });
    res.status(201).json({
      message: "Pengumuman kelas berhasil dibuat",
      data: result,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getAllPengumumanKelas = async (req, res, next) => {
  try {
    const result = await pengumumanKelasService.getAllPengumumanKelas();
    res.json(result);
  } catch (error) {
    next(error);
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
    res.json(result);
  } catch (error) {
    next(error);
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
    res.json(result);
  } catch (error) {
    next(error);
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
    res.json({
      message: "Pengumuman kelas berhasil diupdate",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePengumumanKelas = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pengumumanKelasService.deletePengumumanKelas(id);
    res.json({ message: "Pengumuman kelas berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
