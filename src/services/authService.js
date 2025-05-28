import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const login = async (auth) => {
  const { nip, password } = auth;
  console.log(auth);

  try {
    const guru = await prisma.guru.findUnique({
      where: { nip },
    });
    if (!guru) {
      throw new Error("Guru tidak ditemukan");
    }
    const isMatch = await bcrypt.compare(password, guru?.password);
    if (!guru || !isMatch) {
      throw new Error("Invalid credentials");
    } else {
      const token = jwt.sign(
        {
          nip: guru.nip,
          nama: guru.nama,
          jabatan: guru.jabatan,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );

      const result = {
        token,
        nip: guru.nip,
        nama: guru.nama,
        jabatan: guru.jabatan,
        foto: guru.foto,
      };

      return result;
    }
  } catch (error) {
    throw new Error(error.message);
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
