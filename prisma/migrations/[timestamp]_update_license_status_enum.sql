-- AlterTable
ALTER TABLE `License` MODIFY `status` ENUM('ISSUED', 'IN_USE', 'STOPPED') NOT NULL DEFAULT 'ISSUED';