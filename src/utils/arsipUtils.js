import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

import { Readable } from "stream";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY_GOOGLE?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

export const drive = google.drive({
  version: "v3",
  auth,
});

// ✅ Upload file
export async function uploadFileToDrive(buffer, filename, mimeType) {
  try {
    if (!process.env.FOLDER_ID) {
      throw new Error("FOLDER_ID belum di-set");
    }

    const stream = Readable.from(buffer);

    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${filename}`,
        parents: [process.env.FOLDER_ID],
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: "id", // <-- penting
      supportsAllDrives: true,
    });

    return response.data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error("Gagal upload ke Google Drive");
  }
}

// ✅ Make public
export async function makeFilePublic(fileId) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    console.error("Permission Error:", error);
    throw new Error("Gagal set file public");
  }
}

// ✅ Upload + URL
export async function uploadAndGetUrl(buffer, filename, mimeType) {
  try {
    const file = await uploadFileToDrive(buffer, filename, mimeType);

    if (!file?.id) {
      throw new Error("File ID tidak ditemukan");
    }

    const url = await makeFilePublic(file.id);

    return {
      fileId: file.id,
      url,
    };
  } catch (error) {
    console.error("UploadAndGetUrl Error:", error);
    throw error;
  }
}
