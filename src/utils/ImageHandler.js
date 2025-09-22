import dotenv from "dotenv";
dotenv.config();
import { fileTypeFromBuffer } from "file-type";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dyofh7ecq",
  api_key: process.env.CLOUDINARY_API_KEY || "927867245521265",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "G4yz1UqzywU4hXNaklR541BdFvY",
});

/**
 * Upload file ke Cloudinary dengan kompresi + fallback Base64.
 * @param {Buffer} fileBuffer - Buffer file (dari multer.memoryStorage)
 * @param {string} folder - Nama folder di Cloudinary
 * @param {string} fileName - Nama file (tanpa ekstensi)
 */
export const uploadToCloudinary = async (
  fileBuffer,
  folder,
  fileName = "file"
) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error("File kosong");
  }

  // Deteksi tipe file
  const type = await fileTypeFromBuffer(fileBuffer);
  const mime = type?.mime || "application/octet-stream";

  const isImage = mime.startsWith("image/");

  try {
    if (isImage) {
      // === Jika file image: compress pakai sharp ===
      const compressedBuffer = await sharp(fileBuffer)
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload image pakai stream
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: `${fileName}_${Date.now()}`,
            resource_type: "image",
            timeout: 120000,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        uploadStream.end(compressedBuffer);
      });
    } else {
      // === Jika file bukan image (PDF, docx, zip): upload langsung ===
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: `${fileName}_${Date.now()}`,
            resource_type: "raw", // penting!
            timeout: 120000,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        uploadStream.end(fileBuffer);
      });
    }
  } catch (err) {
    console.error("Upload gagal:", err.message);
    throw err;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log(`File ${publicId} berhasil dihapus.`);
      return true;
    }
    console.log(`Gagal menghapus file ${publicId}.`);
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};
