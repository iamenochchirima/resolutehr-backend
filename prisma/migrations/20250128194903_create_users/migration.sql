/*
  Warnings:

  - You are about to drop the column `firstname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `users` table. All the data in the column will be lost.
  - Added the required column `CEOorAccountingOfficer` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DTIRegistrationNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EERefNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PAYEorSARSNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faxNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industryOrSector` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `physicalAddress` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalAddress` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "CEOorAccountingOfficer" TEXT NOT NULL,
ADD COLUMN     "DTIRegistrationNumber" TEXT NOT NULL,
ADD COLUMN     "EERefNumber" TEXT NOT NULL,
ADD COLUMN     "PAYEorSARSNumber" TEXT NOT NULL,
ADD COLUMN     "cellNumber" TEXT NOT NULL,
ADD COLUMN     "faxNumber" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "industryOrSector" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "physicalAddress" TEXT NOT NULL,
ADD COLUMN     "postalAddress" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "telNumber" TEXT NOT NULL,
ADD COLUMN     "tradeName" TEXT NOT NULL;
