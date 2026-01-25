import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
import webpush from "web-push";
const prisma = new PrismaClient();

export const createNotifikasi = async ({
  idSiswa = "",
  idKelas = "",
  idGuru = "",
  redirectSiswa = "",
  redirectGuru = "",
  idTerkait = "",
  kategori = "",
  keterangan = "",
  createdBy = "",
}) => {
  try {
    await prisma.notifikasi.create({
      data: {
        idSiswa,
        idKelas,
        idGuru,
        redirectGuru,
        redirectSiswa,
        idTerkait,
        kategori,
        keterangan,
        createdBy,
        status: "Belum Terbaca",
      },
    });
  } catch (error) {
    console.log(error);
    throw prismaErrorHandler(error);
  }
};

export const deleteNotifikasiByIdTerkait = async (idTerkait) => {
  try {
    await prisma.notifikasi.deleteMany({
      where: {
        idTerkait,
      },
    });
  } catch (error) {
    console.log(error);
    throw prismaErrorHandler(error);
  }
};

export const deleteNotifikasiById = async (id) => {
  try {
    await prisma.notifikasi.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    throw prismaErrorHandler(error);
  }
};

export const updateStatusAndDeleteSiswa = async (idSiswa) => {
  try {
    // 1. Update semua notifikasi siswa jadi Terbaca
    await prisma.notifikasi.updateMany({
      where: { idSiswa },
      data: { status: "Terbaca" },
    });

    // 2. Hapus notifikasi yang sudah Terbaca lebih dari 2 minggu
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    await prisma.notifikasi.deleteMany({
      where: {
        idSiswa,
        status: "Terbaca",
        createdOn: {
          lt: twoWeeksAgo, // lebih kecil dari (lebih lama dari 2 minggu)
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw prismaErrorHandler(error);
  }
};

export const updateStatusAndDeleteGuru = async (idGuru) => {
  try {
    // 1. Update semua notifikasi siswa jadi Terbaca
    await prisma.notifikasi.updateMany({
      where: { idGuru },
      data: { status: "Terbaca" },
    });

    // 2. Hapus notifikasi yang sudah Terbaca lebih dari 2 minggu
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    await prisma.notifikasi.deleteMany({
      where: {
        idGuru,
        status: "Terbaca",
        createdAt: {
          lt: twoWeeksAgo, // lebih kecil dari (lebih lama dari 2 minggu)
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw prismaErrorHandler(error);
  }
};

export const getNotifikasiByIDPengguna = async (id) => {
  try {
    console.log(id);

    // 1. Ambil semua idKelas terkait user
    const [idKelasMapelSiswa, idKelasSiswa, kelasMapelGuru, kelasGuru] =
      await Promise.all([
        prisma.daftarSiswaMapel.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.daftarSiswaKelas.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.kelasDanMapel.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
        prisma.kelas.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
      ]);

    // 2. Gabung semua idKelas & buang duplikat
    const idKelasList = [
      ...idKelasMapelSiswa.map((d) => d.idKelas),
      ...idKelasSiswa.map((d) => d.idKelas),
      ...kelasMapelGuru.map((d) => d.idKelas), // sebelumnya salah pake d.id
      ...kelasGuru.map((d) => d.id),
    ].filter(Boolean);

    const uniqueIdKelas = [...new Set(idKelasList)];

    // 3. Query Notifikasi
    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        OR: [
          { idSiswa: id },
          { idGuru: id },
          { idKelas: { in: uniqueIdKelas } },

          // 🌍 NOTIF GLOBAL
          {
            idSiswa: "",
            idGuru: "",
            idKelas: "",
          },
        ],
        NOT: {
          createdBy: id, // ⛔ jangan ambil notif buatan diri sendiri
        },
      },
      orderBy: {
        createdOn: "desc",
      },
    });

    // 4. Hapus duplikat berdasarkan `id`
    const uniqueNotif = Array.from(
      new Map(notifikasi.map((n) => [n.id, n])).values()
    );

    console.log("yyl", uniqueNotif.length);

    return {
      uniqueNotif: uniqueNotif || [],
      total: uniqueNotif.length || 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data notifikasi");
  }
};

export const getNotifikasiByIDPenggunaTotal = async (id) => {
  try {
    console.log(id);

    // 1. Ambil semua idKelas terkait user
    const [idKelasMapelSiswa, idKelasSiswa, kelasMapelGuru, kelasGuru] =
      await Promise.all([
        prisma.daftarSiswaMapel.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.daftarSiswaKelas.findMany({
          where: { idSiswa: id },
          select: { idKelas: true },
        }),
        prisma.kelasDanMapel.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
        prisma.kelas.findMany({
          where: { idGuru: id },
          select: { id: true },
        }),
      ]);

    // 2. Gabung semua idKelas & buang duplikat
    const idKelasList = [
      ...idKelasMapelSiswa.map((d) => d.idKelas),
      ...idKelasSiswa.map((d) => d.idKelas),
      ...kelasMapelGuru.map((d) => d.idKelas), // sebelumnya salah pake d.id
      ...kelasGuru.map((d) => d.id),
    ].filter(Boolean);

    const uniqueIdKelas = [...new Set(idKelasList)];

    // 3. Query Notifikasi
    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        status: "Belum Terbaca",
        OR: [{ idSiswa: id }, { idGuru: id }],
        NOT: {
          createdBy: id, // 🚀 filter supaya ga ambil notif yang dibuat user sendiri
        },
      },
      orderBy: {
        createdOn: "desc",
      },
    });

    const notifikasi2 = await prisma.notifikasi.findMany({
      where: {
        status: "Belum Terbaca",
        OR: [{ idKelas: { in: uniqueIdKelas } }],
        NOT: {
          createdBy: id, // 🚀 filter supaya ga ambil notif yang dibuat user sendiri
        },
      },
      orderBy: {
        createdOn: "desc",
      },
    });

    // 4. Hapus duplikat berdasarkan `id`
    const uniqueNotif = Array.from(
      new Map(notifikasi.map((n) => [n.id, n])).values()
    );

    console.log("yyl", uniqueNotif.length);

    return {
      uniqueNotif: uniqueNotif || [],
      total:
        notifikasi2.length > 0
          ? uniqueNotif.length + 1
          : uniqueNotif.length || 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengambil data notifikasi");
  }
};

export const createSubscribe = async (userId, data) => {
  try {
    console.log(data);

    await prisma.pushSubscription.upsert({
      where: {
        endpoint: data.endpoint, // ✅ FIX
      },
      update: {
        userAgent: data.userAgent,
        p256dh: data.p256dh,
        auth: data.auth,
      },
      create: {
        userId,
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Gagal menyimpan data notifikasi");
  }
};

export const sendNotificationToUser = async (userId, payload) => {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
    } catch (err) {
      // subscription mati → hapus
      if (err.statusCode === 410) {
        await prisma.pushSubscription.delete({
          where: { endpoint: sub.endpoint },
        });
      }
    }
  }
};

export const sendNotificationToUsers = async (userIds, payload) => {
  try {
    const subs = await prisma.pushSubscription.findMany({
      where: {
        userId: { in: userIds },
      },
    });

    console.log("📨 Total subscription:", subs.length);

    await Promise.allSettled(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify(payload)
          );

          // ✅ LOG BERHASIL
          console.log("✅ Push sent:", sub.endpoint);
        } catch (err) {
          console.error("❌ Push failed:", sub.endpoint, err.statusCode);

          // expired / unsubscribed
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { endpoint: sub.endpoint },
            });
            console.log("🗑️ Subscription deleted:", sub.endpoint);
          }
        }
      })
    );

    console.log("🎯 Push process finished");
  } catch (error) {
    console.error("🔥 sendNotificationToUsers error:", error);
  }
};
