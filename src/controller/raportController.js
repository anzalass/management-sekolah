import generateRaportService from "../services/raportService.js";  

export const generateRaport = async (req, res) => {
  const nis = req.params.nis;

  try {
    const pdfBytes = await generateRaportService(nis);
    console.log('PDF bytes length:', pdfBytes.length);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="raport.pdf"');

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan dalam menghasilkan raport' });
  }
};
