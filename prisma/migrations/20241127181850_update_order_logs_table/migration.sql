/*
  Warnings:

  - The `before_state` column on the `order_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `after_state` column on the `order_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "order_logs" DROP COLUMN "before_state",
ADD COLUMN     "before_state" JSONB,
DROP COLUMN "after_state",
ADD COLUMN     "after_state" JSONB;
