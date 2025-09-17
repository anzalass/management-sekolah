import multer from "multer";

const storage = multer.memoryStorage();

const uploadPdfImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    const allowedImage = ["image/jpeg", "image/png", "image/jpg"];
    const allowedPdf = ["application/pdf"];

    if (
      allowedImage.includes(file.mimetype) ||
      allowedPdf.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Format tidak didukung (hanya JPG, PNG, atau PDF)"));
    }
  },
});

export default uploadPdfImage;
