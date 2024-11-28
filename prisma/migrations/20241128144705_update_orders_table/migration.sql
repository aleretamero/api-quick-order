-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "image" DROP NOT NULL;
