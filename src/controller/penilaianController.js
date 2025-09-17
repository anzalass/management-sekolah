import {
  createJenisNilai,
  deleteJenisNilai,
  getAllNilaiSiswaByIdKelas,
  getJenisNilaiByKelasMapel,
  getRekapNilaiKelasBaru,
  updateJenisNilai,
  deleteNilaiSiswa,
  updateNilaiSiswa,
  createNilaiSiswa,
} from "../services/penilaianService.js";

// POST /jenis-nilai
export const createJenisNilaiController = async (req, res) => {
  try {
    const data = req.body;
    await createJenisNilai(data);
    return res
      .status(201)
      .json({ message: "Berhasil membuat jenis nilai", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// DELETE /jenis-nilai/:id
export const deleteJenisNilaiController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteJenisNilai(id);
    return res
      .status(201)
      .json({ message: "Berhasil menghapus jenis nilai", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateJenisNilaiController = async (req, res) => {
  try {
    const { id } = req.params;
    await updateJenisNilai(id, req.body);
    return res
      .status(201)
      .json({ message: "Berhasil mengubah jenis nilai", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// GET /jenis-nilai/kelas/:idKelasMapel
export const getJenisNilaiAndNilaiSiswaByKelasMapelController = async (
  req,
  res
) => {
  try {
    const { idKelasMapel } = req.params;
    const jenisNilai = await getJenisNilaiByKelasMapel(idKelasMapel);
    const nilaiSiswa = await getAllNilaiSiswaByIdKelas(idKelasMapel);
    res.json({
      jenisNilai,
      nilaiSiswa,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// PATCH /nilai-siswa/:id
export const updateNilaiSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await updateNilaiSiswa(id, data);
    return res
      .status(201)
      .json({ message: "Berhasil mengupdate nilai", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const createNilaiSiswaController = async (req, res) => {
  try {
    const data = req.body;
    await createNilaiSiswa(data);
    return res
      .status(201)
      .json({ message: "Berhasil membuat nilai", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deletedNilaiSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNilaiSiswa(id);
    return res
      .status(201)
      .json({ message: "Berhasil menghapus nilai", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// // GET /nilai-siswa/kelas/:idKelasDanMapel
// export const getAllNilaiSiswaByIdKelasController = async (req, res) => {
//   try {
//     const { idKelasDanMapel } = req.params;
//     const nilaiSiswa = await getAllNilaiSiswaByIdKelas(idKelasDanMapel);
//     res.json(nilaiSiswa);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: error.message || "Gagal mengambil nilai siswa" });
//   }
// };

export const getRekapNilaiKelasBaruController = async (req, res) => {
  try {
    const result = await getRekapNilaiKelasBaru(req.params.idKelas);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
