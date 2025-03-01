-- CreateTable
CREATE TABLE `Admin` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `programName` VARCHAR(191) NOT NULL,
  `licenseKey` VARCHAR(191) NOT NULL,
  `clientId` VARCHAR(191) NOT NULL,
  `hardwareId` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `activatedAt` DATETIME(3) NULL,
  `expiresAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthLog` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `licenseId` INTEGER NOT NULL,
  `clientIp` VARCHAR(191) NOT NULL,
  `status` BOOLEAN NOT NULL,
  `message` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_email_key` ON `Admin`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `License_licenseKey_key` ON `License`(`licenseKey`);

-- AddForeignKey
ALTER TABLE `AuthLog` ADD CONSTRAINT `AuthLog_licenseId_fkey` FOREIGN KEY (`licenseId`) REFERENCES `License`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;