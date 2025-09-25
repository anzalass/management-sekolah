import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
dotenv.config();
const prisma = new PrismaClient(); // pastikan path ini sesuai

export const login = async (auth) => {
  const { nip, password, type } = auth;

  try {
    if (type === "Guru") {
      const guru = await prisma.guru.findUnique({
        where: { nip },
      });

      if (!guru || !guru.password) {
        throw new Error("NIP atau password salah");
      }

      const isMatch = await bcrypt.compare(password, guru.password);

      if (!isMatch) {
        throw new Error("NIP atau password salah");
      }

      const token = jwt.sign(
        {
          idGuru: guru.id, // ⬅️ Tambahkan ini
          nip: guru.nip,
          nama: guru.nama,
          jabatan: guru.jabatan,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );

      return {
        token,
        idGuru: guru.id,
        nip: guru.nip,
        nama: guru.nama,
        jabatan: guru.jabatan,
        foto: guru.foto,
      };
    } else {
      const siswa = await prisma.siswa.findUnique({
        where: { nis: nip },
      });

      const sekolah = await prisma.sekolah.findFirst();

      if (!siswa || !siswa.password) {
        throw new Error("NIS atau password salah");
      }

      const kelas = await prisma.daftarSiswaKelas.findMany({
        where: {
          idSiswa: siswa.id,
        },
      });

      const kelas2 = await prisma.kelas.findFirst({
        where: {
          id: { in: kelas.map((k) => k.idKelas) },
          tahunAjaran: sekolah.tahunAjaran,
        },
      });

      const isMatch = await bcrypt.compare(password, siswa.password);

      if (!isMatch) {
        throw new Error("NIS atau password salah");
      }

      const token = jwt.sign(
        {
          idGuru: siswa.id, // ⬅️ Tambahkan ini
          nip: siswa.nis,
          jabatan: "Siswa",
          nama: siswa.nama,
          idKelas: kelas2?.id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );

      return {
        token,
        idGuru: siswa.id,
        nip: siswa.nis,
        nama: siswa.nama,
        jabatan: "Siswa",
        foto: siswa.foto,
        idKelas: kelas2.id,
      };
    }
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (nip, password) => {
  try {
    const res = await prisma.$transaction(async (tx) => {
      const passwordHash = bcrypt.hash(password, 10);
      await tx.guru.update({
        where: { nip },
        data: {
          password: passwordHash,
        },
      });
      return "Password berhasil diubah";
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const loginAdmin = async (auth) => {
  const { email, password } = auth;

  try {
    const user = await prisma.guru.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const result = {
      token,
    };

    return result;
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};

export const ubahPasswordSiswa = async (userId, oldPassword, newPassword) => {
  try {
    // Ambil user berdasarkan id
    const user = await prisma.siswa.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    // Cek password lama
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Password lama tidak sesuai");
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password baru
    await prisma.siswa.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password berhasil diubah" };
  } catch (error) {
    console.log(error);
    const errorMessage = prismaErrorHandler(error);
    throw new Error(errorMessage);
  }
};
