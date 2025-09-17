import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export const fillPDFTemplate = async (data) => {
  const templatePath = path.join(process.cwd(), "uploads", "simple (3).pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const form = pdfDoc.getForm();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const setFieldText = (fieldName, text, fontSize = 9) => {
    const field = form.getTextField(fieldName);
    field.setText(text || "");
    field.setFontSize(fontSize);
    field.updateAppearances(font);
  };

  setFieldText("namapersertadidik", data.namaSiswa);
  setFieldText("nonis", data.nis);
  setFieldText("program", data.program);

  data.nilaiSiswa.forEach((nilai, index) => {
    const idx = index + 1;
    setFieldText(`mapel${idx}`, nilai.mapel);
    setFieldText(`minggu1_mapel${idx}`, nilai.minggu1);
    setFieldText(`minggu2_mapel${idx}`, nilai.minggu2);
    setFieldText(`minggu3_mapel${idx}`, nilai.minggu3);
    setFieldText(`minggu4_mapel${idx}`, nilai.minggu4);
    setFieldText(`ratamapel${idx}`, nilai.rataRata);
  });

  form.flatten();
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const fillRapotPDF = async (data) => {
  const templatePath = path.join(process.cwd(), "uploads", "simple.pdf");
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

  // --- Data Siswa
  setFieldText("namasiswa", data.siswa.nama);
  setFieldText("nissiswa", data.siswa.nis);
  setFieldText("kelassiswa", data.siswa.kelas);

  // --- Nilai Siswa (max 10)
  for (let i = 0; i < 10; i++) {
    const idx = i + 1;
    const n = data.nilai[i];
    setFieldText(`mapel${idx}`, n?.mapel || "");
    setFieldText(`guru${idx}`, n?.guru || "");
    setFieldText(`nilai${idx}`, n?.nilaiAkhir || "");
    setFieldText(`catatan${idx}`, n?.catatanAkhir || "");
  }

  // --- Absensi
  setFieldText("totalabsensi", data.absensi.total);
  setFieldText("hadir", data.absensi.hadir);
  setFieldText("izin", data.absensi.izin);
  setFieldText("sakit", data.absensi.sakit);
  setFieldText("alpha", data.absensi.alpha);

  // Flatten biar tidak bisa diedit
  form.flatten();
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
