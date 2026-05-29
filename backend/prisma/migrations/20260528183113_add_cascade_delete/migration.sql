-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_userId_fkey`;

-- DropIndex
DROP INDEX `Game_userId_fkey` ON `Game`;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
