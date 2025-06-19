import { fillPDFTemplate } from '../utils/generatePdf.js';

const generateRaportService = async (nis) => {
  const siswaData = {
    '123456': {
      nama: 'Andri Setiawan',
      tahunAjaran: '2024/2025',
      program: "LAP",
      nilaiSiswa: [
        { mapel: 'Matematika', minggu1: '80', minggu2: '85', minggu3: '90', minggu4: '80' },
        { mapel: 'Bahasa Indonesia', minggu1: '85', minggu2: '90', minggu3: '92', minggu4: '90' },
        { mapel: 'IPA', minggu1: '90', minggu2: '92', minggu3: '95', minggu4: '70' }
      ]
    },
    '654321': {
      nama: 'Siti Rahmawati',
      tahunAjaran: '2024/2025',
      program: "LAP",
      nilaiSiswa: [
        { mapel: 'Matematika', minggu1: '88', minggu2: '90', minggu4: '93' },
        { mapel: 'Bahasa Inggris', minggu1: '92', minggu2: '94', minggu4: '96' },
        { mapel: 'Biologi', minggu1: '89', minggu2: '91', minggu4: '94' }
      ]
    }
  };

  const siswa = siswaData[nis];

  if (!siswa) {
    throw new Error('Siswa tidak ditemukan');
  }

  const { nama, program, nilaiSiswa } = siswa;

  const nilaiSiswaDenganRata2 = nilaiSiswa.map((item) => {
    const nilaiArray = [];

    if (item.minggu1 !== undefined) nilaiArray.push(parseInt(item.minggu1));
    if (item.minggu2 !== undefined) nilaiArray.push(parseInt(item.minggu2));
    if (item.minggu3 !== undefined) nilaiArray.push(parseInt(item.minggu3));
    if (item.minggu4 !== undefined) nilaiArray.push(parseInt(item.minggu4));

    const validNilai = nilaiArray.filter((v) => !isNaN(v));
    const total = validNilai.reduce((sum, nilai) => sum + nilai, 0);
    const rata2 = validNilai.length > 0 ? (total / validNilai.length).toFixed(2) : '0';

    return {
      ...item,
      rataRata: rata2
    };
  });

  const mingguKeys = ['minggu1', 'minggu2', 'minggu3', 'minggu4'];
  const rataRataPerMinggu = {};

  mingguKeys.forEach((mingguKey) => {
    let total = 0;
    let count = 0;

    nilaiSiswa.forEach((item) => {
      if (item[mingguKey] !== undefined) {
        const nilai = parseInt(item[mingguKey]);
        if (!isNaN(nilai)) {
          total += nilai;
          count++;
        }
      }
    });

    rataRataPerMinggu[mingguKey] = count > 0 ? (total / count).toFixed(2) : '0';
  });

  const data = {
    namaSiswa: nama,
    nis,
    program,
    nilaiSiswa: nilaiSiswaDenganRata2,
    rataRataPerMinggu,
  };

  const pdfBytes = await fillPDFTemplate(data);

  return pdfBytes;
};

export default generateRaportService;
