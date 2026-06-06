// middlewares/uploadFile.middleware.ts
import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file dokumen (PDF, DOC, DOCX, XLS, XLSX)"), false);
  }
};

export const uploadFile = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (dokumen biasanya lebih besar)
  },
  fileFilter,
});
