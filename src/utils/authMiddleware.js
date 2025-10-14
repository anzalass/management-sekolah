import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // Extract the token from the header (Bearer <token>)
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token with JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded data (user info) to req.user
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Middleware untuk Guru BK
export const isGuruBK = (req, res, next) => {
  if (req.user?.jabatan === "Guru BK") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied. Only Guru BK allowed." });
};

export const isGuruPerpus = (req, res, next) => {
  if (req.user?.jabatan === "Guru Perpus") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied. Only Kepala Sekolah allowed." });
};

// 🔹 Middleware untuk Kepala Sekolah
export const isKepalaSekolah = (req, res, next) => {
  if (req.user?.jabatan === "Kepala Sekolah") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied. Only Kepala Sekolah allowed." });
};

// 🔹 Middleware untuk Guru TU
export const isGuruTU = (req, res, next) => {
  if (req.user?.jabatan === "Guru TU") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied. Only Guru TU allowed." });
};

export const isSiswa = (req, res, next) => {
  if (req.user?.jabatan === "Siswa") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied. Only Siswa allowed." });
};

export const hasRole =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user?.jabatan)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Access denied. Unauthorized role." });
  };

export const isGuruOnly = (req, res, next) => {
  if (!req.user?.jabatan) {
    return res.status(401).json({ message: "User role not found in token" });
  }

  if (req.user.jabatan === "Siswa") {
    return res
      .status(403)
      .json({ message: "Access denied. Only teachers and staff allowed." });
  }

  // semua role selain Siswa (Guru BK, Kepala Sekolah, TU, dsb) boleh
  next();
};
