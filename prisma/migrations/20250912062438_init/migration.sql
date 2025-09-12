/*
  Warnings:

  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'AUTHOR');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "level",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';
