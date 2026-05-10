/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `avatar` VARCHAR(500) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `email_verified_at` DATETIME(3) NULL,
    ADD COLUMN `kyc_status` ENUM('pending', 'approved', 'rejected', 'not_submitted') NOT NULL DEFAULT 'not_submitted',
    ADD COLUMN `mobile` VARCHAR(15) NOT NULL,
    ADD COLUMN `mobile_verified_at` DATETIME(3) NULL,
    ADD COLUMN `remember_token` VARCHAR(100) NULL,
    ADD COLUMN `status` ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'active',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `uuid` CHAR(36) NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(150) NOT NULL,
    MODIFY `password` VARCHAR(255) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_uuid_key` ON `User`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_mobile_key` ON `User`(`mobile`);

-- CreateIndex
CREATE INDEX `User_status_idx` ON `User`(`status`);

-- CreateIndex
CREATE INDEX `User_deleted_at_idx` ON `User`(`deleted_at`);
