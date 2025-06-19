import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export const fillPDFTemplate = async (data) => {
  const templatePath = path.join(process.cwd(), 'uploads', 'simple (3).pdf');
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);

  const form = pdfDoc.getForm();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const setFieldText = (fieldName, text, fontSize = 9) => {
    const field = form.getTextField(fieldName);
    field.setText(text || '');
    field.setFontSize(fontSize);
    field.updateAppearances(font);
  };

  setFieldText('namapersertadidik', data.namaSiswa);
  setFieldText('nonis', data.nis);
  setFieldText('program', data.program);

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
