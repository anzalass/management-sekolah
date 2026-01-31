import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import {
  getAllTagihanForDenda,
  updateTagihanForDenda,
} from "../services/pembayaranService.js";

const prisma = new PrismaClient();

export const DendaTelatBayar = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        console.log("[CRON] Cek pembiayaan:", today);

        // Ambil pembiayaan jatuh tempo hari ini
        const data = await getAllTagihanForDenda();

        data.data.map((item, index) => {
          if (item.jatuhTempo <= today) {
            updateTagihanForDenda(item.id, item.nominal * (5 / 100));
          }
        });
      } catch (error) {
        console.error("[CRON ERROR]", error);
      }
    },
    {
      timezone: "Asia/Jakarta",
    }
  );
};
