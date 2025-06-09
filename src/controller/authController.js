import { login, loginAdmin, resetPassword } from "../services/authService.js";

export const loginController = async (req, res) => {
  try {
    const result = await login(req.body);
    console.log(result);
    return res.status(200).json({ message: "Login berhasil", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { nip } = req.params;
    const { password } = req.body;
    await resetPassword(nip, password);
    return res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const loginAdminController = async (req, res) => {
  try {
    const result = await loginAdmin(req.body);
    console.log(result);
    return res.status(200).json({ message: "Login berhasil", data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};