/*
  Warnings:

  - The primary key for the `Credits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Interview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Credits" DROP CONSTRAINT "Credits_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Credits_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Credits_id_seq";

-- AlterTable
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Interview_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Interview_id_seq";

-- AlterTable
ALTER TABLE "Metrics" DROP CONSTRAINT "Metrics_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Metrics_id_seq";
