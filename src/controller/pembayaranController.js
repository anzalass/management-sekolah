import {
  bayarTagihan,
  createTagihan,
  deleteTagihan,
  getAllRiwayatPembayaran,
  getAllTagihan,
  getTagihanById,
  updateTagihan,
} from "../services/pembayaranService.js";
import { PrismaClient } from "@prisma/client";
import {
  createTransactionService,
  verificationService,
} from "../utils/midtrans.js";
const prisma = new PrismaClient();

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

    // buat order_id unik
    const uniqueOrderId = `${tagihan.id}-${Date.now()}`;

    const snapPayload = {
      order_id: uniqueOrderId,
      gross_amount: tagihan.nominal,
      customer_details: {
        first_name: tagihan.namaSiswa,
        email: req.user?.email || "noemail@domain.com",
      },
      items: [
        {
          id: tagihan.id,
          price: tagihan.nominal,
          quantity: 1,
          name: tagihan.nama,
        },
      ],
    };

    // request snap
    const snapResponse = await createTransactionService(snapPayload);

    return res.json({ snap: snapResponse });
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

    const verified = await verificationService(notif);
    if (!verified) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const orderId = notif.order_id; // misal: "f4aee01c-2df-4ab2-b7b8-88f1234-1695847312093"
    const tagihanId = orderId.split("-")[0]; // ambil ID Tagihan asli sebelum timestamp

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
      where: { id: tagihanId },
      data: { status: statusPembayaran },
    });

    // update riwayat pembayaran terakhir yang match dengan order_id (snapToken)
    await prisma.riwayatPembayaran.create({
      data: {
        namaSiswa: tagihan.namaSiswa,
        nisSiswa: tagihan.nisSiswa,
        idSiswa: tagihan.idSiswa,
        idTagihan: tagihan.id,
        waktuBayar: new Date(),
        metodeBayar: "midtrans",
        status: statusPembayaran,
      },
    });

    console.log(`Tagihan ${tagihanId} updated to ${statusPembayaran}`);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error processing notification" });
  }
};
