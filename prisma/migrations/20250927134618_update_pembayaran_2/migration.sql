-- CreateTable
CREATE TABLE "SnapUrl" (
    "id" TEXT NOT NULL,
    "idTagihan" TEXT NOT NULL,
    "snap_url" TEXT NOT NULL,
    "snapToken" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "SnapUrl_pkey" PRIMARY KEY ("id")
);
