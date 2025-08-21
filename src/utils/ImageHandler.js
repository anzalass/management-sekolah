import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

const imagekit = new ImageKit({
  publicKey: "public_+LsWTN2IGXkaGmgXD8PpE/n7HFo=",
  privateKey: "private_8X6RPe0HkLf3rPJCtJK5doTtdog=",
  urlEndpoint: "https://ik.imagekit.io/blogemyu",
});

export const uploadToImageKit = async (file, folder) => {
  try {
    console.log("filename", file.originalname);

    const filename = file?.originalname + new Date().getTime();
    const result = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: filename,
      folder: `management_sekolah/${folder}`,
    });

    return result;
  } catch (error) {
    throw new Error("Upload failed: " + error.message);
  }
};

export const deleteFromImageKit = async (fileId) => {
  try {
    const result = await imagekit.deleteFile(fileId);
    return result;
  } catch (error) {
    throw new Error("Delete failed: " + error.message);
  }
};

import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: "dyofh7ecq",
  api_key: "927867245521265",
  api_secret: "G4yz1UqzywU4hXNaklR541BdFvY",
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
  fileName = "image"
) => {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error("File kosong");
  }

  try {
    // 1. Kompres gambar (resize max width 2000px, kualitas 80%)
    const compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // 2. Coba upload pakai streaming
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `${fileName}_${Date.now()}`,
          resource_type: "auto",
          timeout: 120000, // 2 menit
        },
        (error, result) => {
          if (error) {
            console.warn("Upload via stream gagal:", error.message);
            return reject(error);
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(compressedBuffer);
    });
  } catch (err) {
    console.warn("Stream upload error, mencoba fallback base64:", err.message);

    // 3. Fallback ke Base64 upload
    const base64 = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      public_id: `${fileName}_${Date.now()}`,
      resource_type: "image",
      timeout: 120000,
    });
    return { secure_url: result.secure_url, public_id: result.public_id };
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
    return false;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return false;
  }
};
