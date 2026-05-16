-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_drop_location_id_fkey` FOREIGN KEY (`drop_location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
