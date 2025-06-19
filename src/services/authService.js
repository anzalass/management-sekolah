import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();// pastikan path ini sesuai

export const login = async (auth) => {
  const { nip, password } = auth;

  try {
    const guru = await prisma.guru.findUnique({
      where: { nip },
    });

    if (!guru || !guru.password) {
      throw new Error('NIP atau password salah');
    }

    const isMatch = await bcrypt.compare(password, guru.password);

    if (!isMatch) {
      throw new Error('NIP atau password salah');
    }

    const token = jwt.sign(
      {
        guruId: guru.id,         // ⬅️ Tambahkan ini
        nip: guru.nip,
        nama: guru.nama,
        jabatan: guru.jabatan,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '3d' }
    );

    return {
      token,
      nip: guru.nip,
      nama: guru.nama,
      jabatan: guru.jabatan,
      foto: guru.foto,
    };
  } catch (error) {
    throw new Error(error.message || 'Terjadi kesalahan saat login');
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
    const user = await prisma.user.findUnique({
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
    throw new Error(error.message);
  }
};