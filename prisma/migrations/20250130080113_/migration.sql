/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'SUPERADMIN';
ALTER TYPE "Role" ADD VALUE 'STAFF';
ALTER TYPE "Role" ADD VALUE 'MANAGER';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "authority" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dx3z3wv7n/image/upload/v1633660004/avatars/default-avatar.png';
