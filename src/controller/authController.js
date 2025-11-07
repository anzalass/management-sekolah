import {
  login,
  loginAdmin,
  resetPassword,
  ubahPasswordSiswa,
} from "../services/authService.js";

export const loginController = async (req, res) => {
  try {
    const result = await login(req.body);
    console.log(result);
    return res.status(200).json({
      message: "Login berhasil",
      data: result,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const loginController2 = async (req, res) => {
  try {
    const result = await login(req.body);

    // Simpan token di cookie (HTTP-only)
    res.cookie("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // ✅
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login berhasil",
      success: true,
      user: {
        id: result.idGuru,
        nip: result.nip,
        nama: result.nama,
        jabatan: result.jabatan,
        foto: result.foto,
        idKelas: result.idKelas || null,
        token: result.token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { nip } = req.params;
    const { password } = req.body;
    await resetPassword(nip, password);
    return res
      .status(200)
      .json({ message: "Password berhasil diubah", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const loginAdminController = async (req, res) => {
  try {
    const result = await loginAdmin(req.body);
    console.log(result);
    return res
      .status(200)
      .json({ message: "Login berhasil", data: result, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const ubahPasswordSiswaController = async (req, res) => {
  try {
    await ubahPasswordSiswa(
      req.user.idGuru,
      req.body.oldPassword,
      req.body.newPassword
    );
    return res
      .status(200)
      .json({ message: "Password berhasil diubah", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
