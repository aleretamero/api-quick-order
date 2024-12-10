/*
  Warnings:

  - Added the required column `action` to the `order_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_logs" ADD COLUMN  "action" TEXT NULL;

UPDATE "order_logs" SET "action" = '' WHERE "action" IS NULL;

ALTER TABLE "order_logs" ALTER COLUMN "action" SET NOT NULL;
