import dotenv from "dotenv";
import crypto from "crypto";
import MidtransClient from "midtrans-client";

dotenv.config();

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";
const MIDTRANS_IS_PRODUCTION =
  String(process.env.MIDTRANS_IS_PRODUCTION || "false").toLowerCase() ===
  "true";

if (!MIDTRANS_SERVER_KEY) {
  console.warn(
    "WARNING: MIDTRANS_SERVER_KEY is not set. Midtrans calls will fail."
  );
}

const snap = new MidtransClient.Snap({
  isProduction: MIDTRANS_IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

const core = new MidtransClient.CoreApi({
  isProduction: MIDTRANS_IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

export const buildTransaction = (body) => {
  const { order_id, gross_amount, customer_details, items } = body;
  if (!order_id) throw new Error("order_id is required");
  if (typeof gross_amount !== "number")
    throw new Error("gross_amount must be a number");

  return {
    transaction_details: {
      order_id: String(order_id),
      gross_amount: gross_amount,
    },
    item_details: Array.isArray(items) ? items : [],
    customer_details: customer_details || {},
  };
};

export const createTransactionService = async (data) => {
  try {
    const payload = buildTransaction(data);
    const snapResponse = await snap.createTransaction(payload);
    return snapResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStatusPembayaran = async (id) => {
  try {
    const status = await core.transaction.status(id);
    return status;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function verifyNotificationSignature(body, serverKey) {
  const orderId = body.order_id || body.orderId || "";
  const statusCode = String(
    body.status_code ||
      body.statusCode ||
      (body.transaction_status ? "200" : "")
  );
  const grossAmount = String(
    body.gross_amount || body.grossAmount || body.gross || ""
  );
  const signatureKey = body.signature_key || body.signatureKey || "";

  if (!orderId || !statusCode || !grossAmount || !signatureKey) return false;

  const data = orderId + statusCode + grossAmount + serverKey;
  const hash = crypto.createHash("sha512").update(data).digest("hex");
  return hash === signatureKey;
}

export const verificationService = async (data) => {
  try {
    const verified = verifyNotificationSignature(data, MIDTRANS_SERVER_KEY);
    if (!verified) {
      console.warn("Midtrans notification signature verification failed", data);
      throw new Error("Invalid signature");
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const refundService = async (data) => {
  const { order_id, refund_amount, reason } = data || {};
  if (!order_id || typeof refund_amount !== "number") {
    throw new Error(
      "'order_id and refund_amount are required (refund_amount number)"
    );
  }
  try {
    const resp = await core.refund({
      refund_key: `refund-${Date.now()}`,
      transaction_id: order_id,
      amount: refund_amount,
      reason: reason || "refund",
    });
    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
