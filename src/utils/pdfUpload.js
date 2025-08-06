import multer from "multer";

const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format tidak didukung, hanya PDF yang diperbolehkan"));
    }
  },
});

export default fileUpload;
