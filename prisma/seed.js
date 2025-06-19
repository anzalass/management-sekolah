import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingSekolah = await prisma.sekolah.findFirst({
    where: { npsn: "12345678" },
  });

  if (!existingSekolah) {
    await prisma.sekolah.create({
      data: {
        nama: "SD Negeri 01 Jakarta",
        npsn: "12345678",
        kas: 50000000,
        desa: "Cempaka Baru",
        kecamatan: "Kemayoran",
        kabupaten: "Jakarta Pusat",
        provinsi: "DKI Jakarta",
        telephone: "0211234567",
        email: "sdn01jakarta@example.com",
        website: "https://sdn01jakarta.sch.id",
        namaKepsek: "Ibu Siti Aminah",
        logo: null,
        logoId: null,
      },
    });

    console.log("✅ Data sekolah berhasil ditambahkan.");
  } else {
    console.log("⚠️  Sekolah dengan NPSN tersebut sudah ada.");
  }

  const hashedPassword = await bcrypt.hash("gurupassword", 10);

  const existingGuru = await prisma.guru.findFirst({
    where: { nip: "1234567890" },
  });

  if (!existingGuru) {
    await prisma.guru.create({
      data: {
        nip: "1234567890",
        nik: "9876543210",
        password: hashedPassword,
        jabatan: "Guru",
        nama: "Guru Pertama",
        tempatLahir: "Jakarta",
        tanggalLahir: new Date("1990-01-01"),
        alamat: "Jl. Pendidikan No.1",
        agama: "Islam",
        jenisKelamin: "Laki-laki",
        noTelepon: "081234567890",
        email: "guru1@example.com",
        status: "Aktif",
        foto: null,
        fotoId: null,
      },
    });

    console.log("✅ Data guru berhasil ditambahkan.");
  } else {
    console.log("⚠️  Guru dengan NIP tersebut sudah ada.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
