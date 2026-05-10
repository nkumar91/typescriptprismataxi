-- CreateTable
CREATE TABLE `Booking` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `booking_number` VARCHAR(20) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `car_id` BIGINT NOT NULL,
    `pickup_location_id` BIGINT NOT NULL,
    `drop_location_id` BIGINT NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `total_days` INTEGER NOT NULL,
    `base_amount` DECIMAL(10, 2) NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `surge_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `tax_amount` DECIMAL(10, 2) NOT NULL,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `security_deposit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `coupon_id` BIGINT NULL,
    `status` ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `cancellation_reason` TEXT NULL,
    `cancelled_at` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Booking_booking_number_key`(`booking_number`),
    INDEX `Booking_user_id_idx`(`user_id`),
    INDEX `Booking_car_id_idx`(`car_id`),
    INDEX `Booking_pickup_location_id_idx`(`pickup_location_id`),
    INDEX `Booking_drop_location_id_idx`(`drop_location_id`),
    INDEX `Booking_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarImage` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `car_id` BIGINT NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `thumbnail_url` VARCHAR(500) NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CarImage_car_id_idx`(`car_id`),
    INDEX `CarImage_is_primary_idx`(`is_primary`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `vendor_id` BIGINT NOT NULL,
    `city_id` BIGINT NOT NULL,
    `location_id` BIGINT NULL,
    `name` VARCHAR(100) NOT NULL,
    `brand` VARCHAR(80) NOT NULL,
    `model` VARCHAR(80) NOT NULL,
    `year` INTEGER NOT NULL,
    `fuel_type` ENUM('petrol', 'diesel', 'electric', 'cng', 'hybrid') NOT NULL DEFAULT 'petrol',
    `transmission` ENUM('manual', 'automatic') NOT NULL DEFAULT 'manual',
    `seats` INTEGER NOT NULL DEFAULT 5,
    `price_per_day` DECIMAL(10, 2) NOT NULL,
    `security_deposit` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('available', 'booked', 'maintenance', 'inactive') NOT NULL DEFAULT 'available',
    `features` JSON NULL,
    `description` TEXT NULL,
    `mileage` DECIMAL(5, 2) NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Car_uuid_key`(`uuid`),
    INDEX `Car_vendor_id_idx`(`vendor_id`),
    INDEX `Car_city_id_idx`(`city_id`),
    INDEX `Car_location_id_idx`(`location_id`),
    INDEX `Car_fuel_type_idx`(`fuel_type`),
    INDEX `Car_transmission_idx`(`transmission`),
    INDEX `Car_status_idx`(`status`),
    INDEX `Car_is_featured_idx`(`is_featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `country` CHAR(2) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `City_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouponUsage` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `coupon_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `booking_id` BIGINT NOT NULL,
    `discount_applied` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CouponUsage_coupon_id_idx`(`coupon_id`),
    INDEX `CouponUsage_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `type` ENUM('flat', 'percentage') NOT NULL DEFAULT 'percentage',
    `value` DECIMAL(10, 2) NOT NULL,
    `max_discount` DECIMAL(10, 2) NULL,
    `min_booking_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `usage_limit` INTEGER NULL DEFAULT 0,
    `used_count` INTEGER NOT NULL DEFAULT 0,
    `user_limit` INTEGER NOT NULL DEFAULT 1,
    `valid_from` DATETIME(3) NOT NULL,
    `valid_until` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    INDEX `Coupon_valid_from_idx`(`valid_from`),
    INDEX `Coupon_valid_until_idx`(`valid_until`),
    INDEX `Coupon_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KycDocument` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `type` ENUM('aadhar', 'driving_license', 'passport') NOT NULL,
    `front_url` VARCHAR(500) NOT NULL,
    `back_url` VARCHAR(500) NULL,
    `doc_number` VARCHAR(50) NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `reviewed_by` BIGINT NULL,
    `reviewed_at` DATETIME(3) NULL,
    `rejection_reason` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `KycDocument_user_id_idx`(`user_id`),
    INDEX `KycDocument_type_idx`(`type`),
    INDEX `KycDocument_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `city_id` BIGINT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `address` TEXT NULL,
    `lat` DECIMAL(10, 7) NULL,
    `lng` DECIMAL(10, 7) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    INDEX `Location_city_id_idx`(`city_id`),
    INDEX `Location_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationsLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `channel` ENUM('whatsapp', 'sms', 'email', 'push') NOT NULL,
    `type` VARCHAR(80) NOT NULL,
    `payload` JSON NULL,
    `status` ENUM('sent', 'failed', 'pending') NOT NULL DEFAULT 'pending',
    `sent_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NotificationsLog_user_id_idx`(`user_id`),
    INDEX `NotificationsLog_channel_idx`(`channel`),
    INDEX `NotificationsLog_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `booking_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `razorpay_order_id` VARCHAR(100) NOT NULL,
    `razorpay_payment_id` VARCHAR(100) NULL,
    `razorpay_signature` VARCHAR(255) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'INR',
    `type` ENUM('payment', 'refund_deposit', 'deposit_refund') NOT NULL DEFAULT 'payment',
    `status` ENUM('created', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'created',
    `gateway_response` JSON NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Transaction_razorpay_order_id_key`(`razorpay_order_id`),
    UNIQUE INDEX `Transaction_razorpay_payment_id_key`(`razorpay_payment_id`),
    INDEX `Transaction_booking_id_idx`(`booking_id`),
    INDEX `Transaction_user_id_idx`(`user_id`),
    INDEX `Transaction_type_idx`(`type`),
    INDEX `Transaction_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendor` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `business_name` VARCHAR(150) NOT NULL,
    `gst_number` VARCHAR(20) NULL,
    `pan_number` VARCHAR(15) NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'pending',
    `approved_by` BIGINT NULL,
    `approved_at` DATETIME(3) NULL,
    `commission_rate` DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    `bank_account` JSON NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Vendor_user_id_key`(`user_id`),
    INDEX `Vendor_status_idx`(`status`),
    INDEX `Vendor_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
