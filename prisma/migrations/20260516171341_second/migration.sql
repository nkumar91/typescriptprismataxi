-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_vendor_id_fkey` FOREIGN KEY (`vendor_id`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
