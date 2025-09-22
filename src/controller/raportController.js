import puppeteer from "puppeteer";
import {
  generateRaport2,
  generateRapotPDF,
  getRapotSiswa,
} from "../services/raportService.js";

// export const generateRaport = async (req, res) => {
//   const nis = req.params.nis;

//   try {
//     const pdfBytes = await generateRaportService(nis);
//     console.log("PDF bytes length:", pdfBytes.length);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", 'inline; filename="raport.pdf"');

//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Terjadi kesalahan dalam menghasilkan raport" });
//   }
// };

export const generateRaport2Controller = async (req, res) => {
  try {
    const result = await getRapotSiswa(
      req.query.idSiswa,
      req.query.tahunAjaran,
      req.query.idKelas
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam menghasilkan raport" });
  }
};

export const getRapotSiswaController = async (req, res) => {
  try {
    const { idSiswa, tahunAjaran, idKelas } = req.query;
    const data = await getRapotSiswa(idSiswa, tahunAjaran, idKelas);

    const html = `
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Rapot Siswa</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        color: #111827;
      }

      .container {
        margin: 0 auto;
        background: white;
        padding: 30px;
        border-radius: 12px;
      }

      .header {
        text-align: center;
        margin-bottom: 30px;
      }

      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: bold;
      }

      .header h4 {
        margin: 4px 0 0 0; /* kasih margin kecil atas/bawah */
        font-size: 16px;
        font-weight: normal;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: bold;
      }
      .header p {
        margin: 2px 0;
        font-size: 14px;
        color: #374151;
      }

      .card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
      }
      .card-header {
        background: #f3f4f6;
        padding: 10px 15px;
        font-weight: bold;
        font-size: 14px;
      }
      .card-content {
        padding: 15px;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .field p {
        margin: 0;
      }
      .field .label {
        font-weight: bold;
        font-size: 13px;
        color: #374151;
      }
      .field .value {
        font-size: 14px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        font-size: 14px;
      }
      table th,
      table td {
        border: 1px solid #d1d5db;
        padding: 8px;
        text-align: left;
      }
      table th {
        background: #f9fafb;
        font-weight: bold;
      }

      .absensi-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
        text-align: center;
      }
      .absensi-item {
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 10px;
      }
      .absensi-item p {
        margin: 2px 0;
      }
      .absensi-item .label {
        font-weight: bold;
        font-size: 13px;
      }

      .signature {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: 50px;
        gap: 40px;
      }
      .signature div {
        text-align: center;
      }
      .signature .line {
        margin-top: 60px;
        border-bottom: 1px solid #000;
        height: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Laporan Hasil Belajar</h1>
        <h4>Yayasan Tunas Anak Mulia</h4>
        <p>Rajeg Tangerang</p>
        <p><strong>Tahun Ajaran: ${tahunAjaran}</strong></p>
      </div>

      <!-- Data Siswa -->
      <div class="card">
        <div class="card-header">Data Siswa</div>
        <div class="card-content grid-2">
          <div class="field">
            <p class="label">Nama:</p>
            <p class="value">${data.siswa.nama}</p>
          </div>
          <div class="field">
            <p class="label">NIS:</p>
            <p class="value">${data.siswa.nis}</p>
          </div>
          <div class="field">
            <p class="label">Kelas:</p>
            <p class="value">${data.siswa.kelas}</p>
          </div>
      
        </div>
      </div>

      <!-- Nilai -->
      <div class="card">
        <div class="card-header">Nilai Mata Pelajaran</div>
        <div class="card-content">
          <table>
            <thead>
              <tr>
                <th>Mata Pelajaran</th>
                <th>Guru</th>
                <th>Nilai Akhir</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              ${data.nilai
                .map(
                  (n) => `
                  <tr>
                    <td>${n.mapel}</td>
                    <td>${n.guru}</td>
                    <td>${n.nilaiAkhir ?? "-"}</td>
                    <td>${n.catatanAkhir ?? ""}</td>
                    
                  </tr>
                `
                )
                .join("")}
                
            </tbody>
          </table>
        </div>
      </div>

      <!-- Absensi -->
      <div class="card">
        <div class="card-header">Rekap Absensi</div>
        <div class="card-content absensi-grid">
          <div class="absensi-item">
            <p class="label">Total</p>
            <p>${data.absensi.total}</p>
          </div>
          <div class="absensi-item">
            <p class="label">Hadir</p>
            <p>${data.absensi.hadir}</p>
          </div>
          <div class="absensi-item">
            <p class="label">Izin</p>
            <p>${data.absensi.izin}</p>
          </div>
          <div class="absensi-item">
            <p class="label">Sakit</p>
            <p>${data.absensi.sakit}</p>
          </div>
          <div class="absensi-item">
            <p class="label">Alpha</p>
            <p>${data.absensi.alpha}</p>
          </div>
        </div>
      </div>

      <!-- Tanda Tangan -->
      <div class="signature">
        <div>
          <p class="label">Wali Kelas</p>
          <div class="line"></div>
        </div>
        <div>
          <p class="label">Kepala Sekolah</p>
          <div class="line"></div>
          <p class="value">${data.kepalaSekolah ?? ""}</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A2",
      printBackground: true,
      margin: { top: "10px", bottom: "10px", left: "10px", right: "10px" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rapot_${data.siswa.nis}.pdf`
    );
    res.end(pdfBuffer); // gunakan end agar tidak korup
  } catch (err) {
    console.error("❌ ERROR generate rapot:", err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam menghasilkan rapot" });
  }
};
