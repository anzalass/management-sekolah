import {
  createJenisNilai,
  deleteJenisNilai,
  getAllNilaiSiswaByIdKelas,
  getJenisNilaiByKelasMapel,
  updateNilaiSiswa,
} from "../services/penilaianService.js";

// POST /jenis-nilai
export const createJenisNilaiController = async (req, res) => {
  try {
    const data = req.body;
    const newJenis = await createJenisNilai(data);
    res.status(201).json(newJenis);
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Gagal membuat jenis nilai" });
  }
};

// DELETE /jenis-nilai/:id
export const deleteJenisNilaiController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteJenisNilai(id);
    res.json(deleted);
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Gagal menghapus jenis nilai" });
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
    res
      .status(400)
      .json({ error: error.message || "Gagal mengambil data jenis nilai" });
  }
};

// PATCH /nilai-siswa/:id
export const updateNilaiSiswaController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await updateNilaiSiswa(id, data);
    res.json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message || "Gagal memperbarui nilai siswa" });
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
