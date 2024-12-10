/*
  Warnings:

  - The primary key for the `user_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "order_logs" DROP CONSTRAINT "order_logs_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_logs" DROP CONSTRAINT "order_logs_session_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "order_logs" ALTER COLUMN "order_id" SET DATA TYPE TEXT,
ALTER COLUMN "session_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_logs" ADD CONSTRAINT "order_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_logs" ADD CONSTRAINT "order_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
