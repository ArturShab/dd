/*
  Warnings:

  - Added the required column `value` to the `SpecValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpecValue" ADD COLUMN     "value" TEXT NOT NULL;
