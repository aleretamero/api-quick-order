-- CreateTable
CREATE TABLE "user_tokens" (
    "id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "encrypted_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
