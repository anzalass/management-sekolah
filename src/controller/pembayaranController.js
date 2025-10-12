import {
  bayarTagihan,
  buktiTidakValid,
  createTagihan,
  deleteTagihan,
  getAllRiwayatPembayaran,
  getAllTagihan,
  getTagihanById,
  updateTagihan,
  uploadBuktiTagihan,
} from "../services/pembayaranService.js";
import { PrismaClient } from "@prisma/client";
import {
  createTransactionService,
  verificationService,
} from "../utils/midtrans.js";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid"; // kalau pakai ESModule
import memoryUpload from "../utils/multer.js";
import { createNotifikasi } from "../services/notifikasiService.js";
// atau
// const { v4: uuidv4 } = require('uuid'); // kalau pakai CommonJS

export const CreateTagihanController = async (req, res) => {
  try {
    const data = req.body;
    await createTagihan(data);
    res.status(201).json({ message: "Tagihan berhasil dibuat" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const GetAllTagihanController = async (req, res) => {
  try {
    const query = req.query;
    const result = await getAllTagihan(query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const GetTagihanByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getTagihanById(id);
    if (!result) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const UpdateTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await updateTagihan(id, data);
    return res.status(200).json({ message: "Tagihan berhasil diupdate" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const DeleteTagihanController = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteTagihan(id);
    return res.status(200).json({ message: "Tagihan berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const BayarTagihanManualController = async (req, res) => {
  try {
    const id = req.params.id;
    await bayarTagihan(id, req.body.metodeBayar);
    return res.status(200).json({ message: "Tagihan berhasil Dibayar" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const GetAllRiwayatPembayaranController = async (req, res) => {
  try {
    const result = await getAllRiwayatPembayaran({
      namaSiswa: req.query.namaSiswa,
      namaTagihan: req.query.namaTagihan,
      nisSiswa: req.query.nisSiswa,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    });
    res
      .status(200)
      .json({ message: "Berhasil Mendapatkan Data Tagihan", result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const bayarTagihanMidtransController = async (req, res) => {
  try {
    const { idTagihan } = req.params;

    const tagihan = await prisma.tagihan.findUnique({
      where: { id: idTagihan },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    // UUID unik untuk order_id Midtrans
    const orderId = uuidv4();

    console.log("Generated orderId:", orderId);

    const snapPayload = {
      transaction_details: {
        order_id: String(orderId), // HARUS ADA
        gross_amount: tagihan.nominal,
      },
      customer_details: {
        first_name: tagihan.namaSiswa,
        email: req.user?.email || "noemail@domain.com",
      },
      item_details: [
        {
          id: tagihan.id,
          price: tagihan.nominal,
          quantity: 1,
          name: tagihan.nama,
        },
      ],
      custom_field1: tagihan.id,
    };

    const snapResponse = await createTransactionService(snapPayload);
    await prisma.snapUrl.create({
      data: {
        id: orderId,
        idTagihan: idTagihan,
        snap_url: snapResponse.redirect_url,
        snapToken: snapResponse.token,
        createdAt: new Date(),
      },
    });
    return res.json({ orderId, snap: snapResponse });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Gagal membuat transaksi Midtrans" });
  }
};

export const midtransNotificationController = async (req, res) => {
  try {
    const notif = req.body;
    console.log("notif", notif);

    // (opsional) verifikasi signature key
    const verified = await verificationService(notif);
    if (!verified) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const tagihanNotif = await prisma.snapUrl.findUnique({
      where: {
        id: notif.order_id,
      },
    });

    const transactionStatus = notif.transaction_status;

    let statusPembayaran = "BELUM_BAYAR";
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      statusPembayaran = "LUNAS";
    } else if (transactionStatus === "pending") {
      statusPembayaran = "PENDING";
    } else {
      statusPembayaran = "GAGAL";
    }

    // update status tagihan
    const tagihan = await prisma.tagihan.update({
      where: { id: tagihanNotif.idTagihan },
      data: { status: statusPembayaran },
    });

    // catat riwayat pembayaran

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      await prisma.snapUrl.deleteMany({
        where: {
          idTagihan: tagihanNotif.idTagihan,
        },
      });
      await prisma.riwayatPembayaran.create({
        data: {
          namaSiswa: tagihan.namaSiswa,
          nisSiswa: tagihan.nisSiswa,
          idSiswa: tagihan.idSiswa,
          idTagihan: tagihanNotif.idTagihan,
          waktuBayar: new Date(),
          metodeBayar: "midtrans",
          status: statusPembayaran,
        },
      });
    }

    await createNotifikasi({
      createdBy: "",
      idGuru: "",
      idKelas: "",
      idSiswa: tagihan.idSiswa,
      idTerkait: tagihan.id,
      kategori: "Pembayaran",
      keterangan: `Status pembayaran ${tagihan.status}`,
      redirectSiswa: "/siswa/pembayaran",
      redirectGuru: "",
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error processing notification" });
  }
};

export const uploadBuktiTagihanController = async (req, res) => {
  memoryUpload.single("bukti")(req, res, async (err) => {
    try {
      await uploadBuktiTagihan(req.params.id, req.file);
      return res
        .status(200)
        .json({ message: "Berhasil upload bukti Tagihan", success: true });
    } catch (error) {
      return res.status(500).json({ message: "Gagal upload bukti pembayaran" });
    }
  });
};

export const buktiTidakValidController = async (req, res) => {
  try {
    await buktiTidakValid(req.params.id);
    return res
      .status(200)
      .json({ message: "Bukti tidak valid", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Gagal upload bukti pembayaran" });
  }
};
