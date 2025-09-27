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

    if (!tagihan)
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });

    const snapPayload = {
      order_id: tagihan.id,
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

    const snapResponse = await createTransactionService(snapPayload);

    // await prisma.riwayatPembayaran.create({
    //   data: {
    //     namaSiswa: tagihan.namaSiswa,
    //     nisSiswa: tagihan.nisSiswa,
    //     idSiswa: tagihan.idSiswa,
    //     idTagihan: tagihan.id,
    //     waktuBayar: new Date(),
    //     status: "BELUM_TERBAYAR",
    //     metodeBayar: "midtrans",
    //     snapToken: snapResponse.token,
    //     snapRedirectUrl: snapResponse.redirect_url,
    //   },
    // });
    //
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
    if (!verified)
      return res.status(403).json({ message: "Invalid signature" });

    const orderId = notif.order_id;
    const transactionStatus = notif.transaction_status;

    let statusPembayaran = "BELUM_TERBAYAR";
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      statusPembayaran = "TERBAYAR";
    } else if (transactionStatus === "pending") {
      statusPembayaran = "PENDING";
    } else {
      statusPembayaran = "GAGAL";
    }

    await prisma.tagihan.update({
      where: { id: orderId },
      data: {
        status: statusPembayaran === "BELUM_TERBAYAR",
      },
    });

    await prisma.riwayatPembayaran.updateMany({
      where: { idTagihan: orderId },
      data: {
        status: statusPembayaran,
        waktuBayar: new Date(),
      },
    });

    console.log(`Tagihan ${orderId} updated to ${statusPembayaran}`);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error processing notification" });
  }
};
