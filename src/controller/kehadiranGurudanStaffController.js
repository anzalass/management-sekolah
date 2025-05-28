import { createAbsensiGurudanStaff } from "../services/KehadiranGurudanStaff.js";

export const createAbsensiGurudanStaffController = async (req, res, next) => {
  try {
    const data = {
      nip: req.user.nip,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      tanggal: new Date(req.body.tanggal),
    };
    await createAbsensiGurudanStaff(data);
    return res
      .status(201)
      .json({ message: "Berhasil membuat absensi guru dan staff" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
