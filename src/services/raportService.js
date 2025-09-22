import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

// export const generateRaportService = async (nis) => {
//   const siswaData = {
//     123456: {
//       nama: "Andri Setiawan",
//       tahunAjaran: "2024/2025",
//       program: "LAP",
//       nilaiSiswa: [
//         {
//           mapel: "Matematika",
//           minggu1: "80",
//           minggu2: "85",
//           minggu3: "90",
//           minggu4: "80",
//         },
//         {
//           mapel: "Bahasa Indonesia",
//           minggu1: "85",
//           minggu2: "90",
//           minggu3: "92",
//           minggu4: "90",
//         },
//         {
//           mapel: "IPA",
//           minggu1: "90",
//           minggu2: "92",
//           minggu3: "95",
//           minggu4: "70",
//         },
//       ],
//     },
//     654321: {
//       nama: "Siti Rahmawati",
//       tahunAjaran: "2024/2025",
//       program: "LAP",
//       nilaiSiswa: [
//         { mapel: "Matematika", minggu1: "88", minggu2: "90", minggu4: "93" },
//         {
//           mapel: "Bahasa Inggris",
//           minggu1: "92",
//           minggu2: "94",
//           minggu4: "96",
//         },
//         { mapel: "Biologi", minggu1: "89", minggu2: "91", minggu4: "94" },
//       ],
//     },
//   };

//   const siswa = siswaData[nis];

//   if (!siswa) {
//     throw new Error("Siswa tidak ditemukan");
//   }

//   const { nama, program, nilaiSiswa } = siswa;

//   const nilaiSiswaDenganRata2 = nilaiSiswa.map((item) => {
//     const nilaiArray = [];

//     if (item.minggu1 !== undefined) nilaiArray.push(parseInt(item.minggu1));
//     if (item.minggu2 !== undefined) nilaiArray.push(parseInt(item.minggu2));
//     if (item.minggu3 !== undefined) nilaiArray.push(parseInt(item.minggu3));
//     if (item.minggu4 !== undefined) nilaiArray.push(parseInt(item.minggu4));

//     const validNilai = nilaiArray.filter((v) => !isNaN(v));
//     const total = validNilai.reduce((sum, nilai) => sum + nilai, 0);
//     const rata2 =
//       validNilai.length > 0 ? (total / validNilai.length).toFixed(2) : "0";

//     return {
//       ...item,
//       rataRata: rata2,
//     };
//   });

//   const mingguKeys = ["minggu1", "minggu2", "minggu3", "minggu4"];
//   const rataRataPerMinggu = {};

//   mingguKeys.forEach((mingguKey) => {
//     let total = 0;
//     let count = 0;

//     nilaiSiswa.forEach((item) => {
//       if (item[mingguKey] !== undefined) {
//         const nilai = parseInt(item[mingguKey]);
//         if (!isNaN(nilai)) {
//           total += nilai;
//           count++;
//         }
//       }
//     });

//     rataRataPerMinggu[mingguKey] = count > 0 ? (total / count).toFixed(2) : "0";
//   });

//   const data = {
//     namaSiswa: nama,
//     nis,
//     program,
//     nilaiSiswa: nilaiSiswaDenganRata2,
//     rataRataPerMinggu,
//   };

//   const pdfBytes = await fillPDFTemplate(data);

//   return pdfBytes;
// };

export const getRapotSiswa = async (idSiswa, tahunAjaran, idKelas) => {
  try {
    // ambil data siswa
    const siswa = await prisma.siswa.findUnique({
      where: { id: idSiswa },
      select: {
        id: true,
        nama: true,
        nis: true,
        kelas: true,
      },
    });

    if (!siswa) {
      throw new Error("Siswa tidak ditemukan");
    }

    // ambil daftar mapel yg diikuti siswa
    const kelasMapel = await prisma.kelasDanMapel.findMany({
      where: { tahunAjaran, DaftarSiswa: { some: { idSiswa } } },
      include: {
        Guru: { select: { nama: true } },
        JenisNilai: { include: { NilaiSiswa: { where: { idSiswa } } } },
        CatatanAkhirSiswa: { where: { idSiswa } },
      },
    });

    // olah nilai
    const nilai = kelasMapel.map((km) => {
      let total = 0;
      let totalBobot = 0;

      km.JenisNilai.forEach((jn) => {
        const nilaiSiswa = jn.NilaiSiswa[0];
        if (nilaiSiswa) {
          total += nilaiSiswa.nilai * (jn.bobot / 100);
          totalBobot += jn.bobot;
        }
      });

      return {
        mapel: km.namaMapel,
        guru: km.namaGuru,
        nilaiAkhir: totalBobot > 0 ? total.toFixed(2) : null,
        catatanAkhir: km.CatatanAkhirSiswa[0]?.content || "-",
      };
    });

    // absensi
    const absensi = await prisma.kehadiranSiswa.groupBy({
      by: ["keterangan"],
      where: { idSiswa, idKelas },
      _count: true,
    });

    const hadir = absensi.find((a) => a.keterangan === "Hadir")?._count || 0;
    const izin = absensi.find((a) => a.keterangan === "Izin")?._count || 0;
    const sakit = absensi.find((a) => a.keterangan === "Sakit")?._count || 0;
    const alpha = absensi.find((a) => a.keterangan === "Alpha")?._count || 0;
    const total = hadir + izin + sakit + alpha;

    return {
      siswa,
      nilai,
      absensi: { total, hadir, izin, sakit, alpha },
    };
  } catch (error) {
    console.log(error);
  }
};

export const generateRaport2 = async (idSiswa, tahunAjaran, idKelas) => {
  const res = await getRapotSiswa(idSiswa, tahunAjaran, idKelas);

  if (res) {
    const pdfres = await fillRapotPDF(res);
    return pdfres;
  }
};

export const fillPDFTemplate = async (data) => {
  const templatePath = path.join(process.cwd(), "uploads", "simple (3).pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const form = pdfDoc.getForm();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const setFieldText = (fieldName, text, fontSize = 9) => {
    try {
      const field = form.getTextField(fieldName);
      field.setText(text?.toString() || "");
      field.setFontSize(fontSize);
      field.updateAppearances(font);
    } catch (err) {
      console.warn(`⚠️ Field ${fieldName} tidak ditemukan di template`);
    }
  };

  // Data Siswa
  setFieldText("namapersertadidik", data.siswa.nama);
  setFieldText("nissiswa", data.siswa.nis);
  setFieldText("kelassiswa", data.siswa.kelas);

  // Nilai Mapel (max 10)
  for (let i = 0; i < 10; i++) {
    const idx = i + 1;
    const n = data.nilai[i];
    setFieldText(`mapel${idx}`, n?.mapel || "");
    setFieldText(`guru${idx}`, n?.guru || "");
    setFieldText(`nilai${idx}`, n?.nilaiAkhir || "");
    setFieldText(`catatan${idx}`, n?.catatanAkhir || "");
  }

  // Absensi
  setFieldText("totalabsensi", data.absensi.total);
  setFieldText("hadir", data.absensi.hadir);
  setFieldText("izin", data.absensi.izin);
  setFieldText("sakit", data.absensi.sakit);
  setFieldText("alpha", data.absensi.alpha);

  form.flatten();
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const generateRapotPDF = async (idSiswa, tahunAjaran, idKelas) => {
  // Ambil data siswa
  const siswa = await prisma.siswa.findUnique({
    where: { id: idSiswa },
    select: { id: true, nama: true, nis: true, kelas: true },
  });
  if (!siswa) throw new Error("Siswa tidak ditemukan");

  // Ambil mapel yang diikuti siswa
  const kelasMapel = await prisma.kelasDanMapel.findMany({
    where: { tahunAjaran, DaftarSiswa: { some: { idSiswa } } },
    include: {
      Guru: { select: { nama: true } },
      JenisNilai: { include: { NilaiSiswa: { where: { idSiswa } } } },
      CatatanAkhirSiswa: { where: { idSiswa } },
    },
  });

  // Olah nilai
  const nilai = kelasMapel.map((km) => {
    let total = 0;
    let totalBobot = 0;
    km.JenisNilai.forEach((jn) => {
      const nilaiSiswa = jn.NilaiSiswa[0];
      if (nilaiSiswa) {
        total += nilaiSiswa.nilai * (jn.bobot / 100);
        totalBobot += jn.bobot;
      }
    });
    return {
      mapel: km.namaMapel,
      guru: km.namaGuru,
      nilaiAkhir: totalBobot > 0 ? total.toFixed(2) : null,
      catatanAkhir: km.CatatanAkhirSiswa[0]?.content || "-",
    };
  });

  // Ambil absensi by idKelas
  const absensiRaw = await prisma.kehadiranSiswa.groupBy({
    by: ["keterangan"],
    where: { idSiswa, idKelas },
    _count: true,
  });
  const hadir = absensiRaw.find((a) => a.keterangan === "Hadir")?._count || 0;
  const izin = absensiRaw.find((a) => a.keterangan === "Izin")?._count || 0;
  const sakit = absensiRaw.find((a) => a.keterangan === "Sakit")?._count || 0;
  const alpha = absensiRaw.find((a) => a.keterangan === "Alpha")?._count || 0;
  const total = hadir + izin + sakit + alpha;

  const data = {
    siswa,
    nilai,
    absensi: { total, hadir, izin, sakit, alpha },
  };

  // Generate PDF
  const pdfBytes = await fillPDFTemplate(data);
  return pdfBytes;
};
