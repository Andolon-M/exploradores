-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role_id` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_role_id_idx`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(255) NOT NULL,
    `resource` VARCHAR(255) NOT NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `permissions_resource_action_type_key`(`resource`, `action`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_has_permissions` (
    `permission_id` BIGINT UNSIGNED NOT NULL,
    `role_id` BIGINT UNSIGNED NOT NULL,

    INDEX `role_has_permissions_role_id_idx`(`role_id`),
    PRIMARY KEY (`permission_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commanders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dni` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(255) NULL,
    `status` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `commanders_dni_idx`(`dni`),
    INDEX `commanders_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `explorers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `commander_id` BIGINT UNSIGNED NULL,
    `dni` VARCHAR(255) NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NULL,
    `birthdate` DATE NULL,
    `gender` ENUM('MASCULINO', 'FEMENINO') NULL,
    `guardian_name` VARCHAR(255) NULL,
    `guardian_phone` VARCHAR(255) NULL,
    `status` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `explorers_commander_id_idx`(`commander_id`),
    INDEX `explorers_dni_idx`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `explorers` ADD CONSTRAINT `explorers_commander_id_fkey` FOREIGN KEY (`commander_id`) REFERENCES `commanders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
