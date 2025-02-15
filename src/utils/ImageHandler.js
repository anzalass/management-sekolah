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
