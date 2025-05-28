import { PrismaClient } from "@prisma/client";
import { prismaErrorHandler } from "../utils/errorHandlerPrisma.js";
const prisma = new PrismaClient();

//     id          String @id @default(uuid())
//   nama        String
//   nis         String
//   waktu       DateTime
//   jatuhTempo  DateTime
//   status      String
//   keterangan  String
//   nominal     Int
//   Siswa Siswa @relation(fields: [nis], references: [nis])

export const createTagihan = async (data) => {
  const { nama, kepada, waktu, nominal, jatuhTempo, keterangan } = data;

  await prisma.$transaction(async (tx) => {
    for (let index = 0; index < kepada.length; index++) {
      tx.tagihan.create({
        data: {
          nama: nama,
          nis: kepada.nis,
          waktu: waktu,
          jatuhTempo: jatuhTempo,
          status: "Belum Dibayar",
          keterangan: keterangan,
          nominal: nominal,
        },
      });
    }
  });
};
