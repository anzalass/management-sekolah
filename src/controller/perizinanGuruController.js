export const createPerizinanGuruController = async (req, res, next) => {
  try {
    const data = {
      nip: req.user.nip,
      jenis: req.body.jenis,
      keterangan: req.body.keterangan,
      time: req.body.time,
      endTime: req.body.endTime,
    };
    await createPerizinanGuru(data);
    return res.status(201).json({ message: "Berhasil membuat perizinan guru" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePerizinanGuruController = async (req, res, next) => {
  try {
    await updatePerizinanGuru(req.params.id, req.body);
    return res
      .status(200)
      .json({ message: "Berhasil mengupdate perizinan guru" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePerizinanGuruController = async (req, res, next) => {
  try {
    await deletePerizinanGuru(req.params.id);
    return res
      .status(200)
      .json({ message: "Berhasil menghapus perizinan guru" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPerizinanGuruByIdController = async (req, res, next) => {
  try {
    const perizinanGuru = await getPerizinanGuruById(req.params.id);
    return res.status(200).json(perizinanGuru);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
