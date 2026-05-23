CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;
ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Customers` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FullName` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `DateOfBirth` datetime(6) NOT NULL,
    `PhoneNumber` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(150) CHARACTER SET utf8mb4 NULL,
    `Country` varchar(100) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Customers` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `ExtraServices` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Price` decimal(18,2) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_ExtraServices` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `FlightPackages` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Title` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Price` decimal(18,2) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_FlightPackages` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Pilots` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FullName` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `LicenseNumber` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `Status` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Pilots` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `TransportGroups` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `DepartureTime` datetime(6) NOT NULL,
    `VehiclePlate` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `DriverName` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_TransportGroups` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Reservations` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FlightDate` datetime(6) NOT NULL,
    `WeightLimitStatus` tinyint(1) NOT NULL,
    `Status` int NOT NULL,
    `CustomerId` int NOT NULL,
    `PilotId` int NOT NULL,
    `FlightPackageId` int NOT NULL,
    `TransportGroupId` int NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Reservations` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Reservations_Customers_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `Customers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Reservations_FlightPackages_FlightPackageId` FOREIGN KEY (`FlightPackageId`) REFERENCES `FlightPackages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Reservations_Pilots_PilotId` FOREIGN KEY (`PilotId`) REFERENCES `Pilots` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Reservations_TransportGroups_TransportGroupId` FOREIGN KEY (`TransportGroupId`) REFERENCES `TransportGroups` (`Id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `Payments` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Amount` decimal(18,2) NOT NULL,
    `Currency` int NOT NULL,
    `Method` int NOT NULL,
    `PaymentDate` datetime(6) NOT NULL,
    `ReservationId` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Payments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Payments_Reservations_ReservationId` FOREIGN KEY (`ReservationId`) REFERENCES `Reservations` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `ReservationExtras` (
    `ReservationId` int NOT NULL,
    `ExtraServiceId` int NOT NULL,
    CONSTRAINT `PK_ReservationExtras` PRIMARY KEY (`ReservationId`, `ExtraServiceId`),
    CONSTRAINT `FK_ReservationExtras_ExtraServices_ExtraServiceId` FOREIGN KEY (`ExtraServiceId`) REFERENCES `ExtraServices` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_ReservationExtras_Reservations_ReservationId` FOREIGN KEY (`ReservationId`) REFERENCES `Reservations` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Payments_ReservationId` ON `Payments` (`ReservationId`);

CREATE INDEX `IX_ReservationExtras_ExtraServiceId` ON `ReservationExtras` (`ExtraServiceId`);

CREATE INDEX `IX_Reservations_CustomerId` ON `Reservations` (`CustomerId`);

CREATE INDEX `IX_Reservations_FlightPackageId` ON `Reservations` (`FlightPackageId`);

CREATE INDEX `IX_Reservations_PilotId` ON `Reservations` (`PilotId`);

CREATE INDEX `IX_Reservations_TransportGroupId` ON `Reservations` (`TransportGroupId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260506093959_InitialParaglidingSchema', '9.0.0');

ALTER TABLE `Customers` DROP COLUMN `Country`;

ALTER TABLE `Customers` ADD `CountryId` int NULL;

CREATE TABLE `Countries` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Code` varchar(10) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Countries` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Customers_CountryId` ON `Customers` (`CountryId`);

ALTER TABLE `Customers` ADD CONSTRAINT `FK_Customers_Countries_CountryId` FOREIGN KEY (`CountryId`) REFERENCES `Countries` (`Id`) ON DELETE SET NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260506120009_AddCountryEntity', '9.0.0');

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260509094726_Migration_20260509_124720', '9.0.0');

ALTER TABLE `Reservations` DROP FOREIGN KEY `FK_Reservations_Customers_CustomerId`;

ALTER TABLE `Reservations` DROP FOREIGN KEY `FK_Reservations_FlightPackages_FlightPackageId`;

ALTER TABLE `Reservations` DROP FOREIGN KEY `FK_Reservations_Pilots_PilotId`;

ALTER TABLE `Reservations` DROP FOREIGN KEY `FK_Reservations_TransportGroups_TransportGroupId`;

ALTER TABLE `Reservations` DROP INDEX `IX_Reservations_CustomerId`;

ALTER TABLE `Reservations` DROP INDEX `IX_Reservations_FlightPackageId`;

ALTER TABLE `Reservations` DROP INDEX `IX_Reservations_PilotId`;

ALTER TABLE `Reservations` DROP INDEX `IX_Reservations_TransportGroupId`;

ALTER TABLE `Reservations` DROP COLUMN `CustomerId`;

ALTER TABLE `Reservations` DROP COLUMN `FlightPackageId`;

ALTER TABLE `Reservations` DROP COLUMN `PilotId`;

ALTER TABLE `Reservations` DROP COLUMN `TransportGroupId`;

CREATE TABLE `ReservationDetails` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `ReservationId` int NOT NULL,
    `CustomerId` int NOT NULL,
    `PilotId` int NOT NULL,
    `FlightPackageId` int NOT NULL,
    `TransportGroupId` int NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_ReservationDetails` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ReservationDetails_Customers_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `Customers` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_ReservationDetails_FlightPackages_FlightPackageId` FOREIGN KEY (`FlightPackageId`) REFERENCES `FlightPackages` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_ReservationDetails_Pilots_PilotId` FOREIGN KEY (`PilotId`) REFERENCES `Pilots` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_ReservationDetails_Reservations_ReservationId` FOREIGN KEY (`ReservationId`) REFERENCES `Reservations` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_ReservationDetails_TransportGroups_TransportGroupId` FOREIGN KEY (`TransportGroupId`) REFERENCES `TransportGroups` (`Id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_ReservationDetails_CustomerId` ON `ReservationDetails` (`CustomerId`);

CREATE INDEX `IX_ReservationDetails_FlightPackageId` ON `ReservationDetails` (`FlightPackageId`);

CREATE INDEX `IX_ReservationDetails_PilotId` ON `ReservationDetails` (`PilotId`);

CREATE INDEX `IX_ReservationDetails_ReservationId` ON `ReservationDetails` (`ReservationId`);

CREATE INDEX `IX_ReservationDetails_TransportGroupId` ON `ReservationDetails` (`TransportGroupId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260510093046_ReservationDetailsStructure', '9.0.0');

ALTER TABLE `FlightPackages` ADD `Details` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260510101232_AddFlightPackageDetails', '9.0.0');

ALTER TABLE `ReservationExtras` DROP FOREIGN KEY `FK_ReservationExtras_Reservations_ReservationId`;

ALTER TABLE `Reservations` DROP COLUMN `WeightLimitStatus`;

ALTER TABLE `ReservationExtras` CHANGE `ReservationId` `ReservationDetailId` int NOT NULL;

ALTER TABLE `Reservations` ADD `TotalAmount` decimal(18,2) NOT NULL DEFAULT 0.0;

ALTER TABLE `ReservationDetails` ADD `WeightLimitStatus` tinyint(1) NOT NULL DEFAULT FALSE;

ALTER TABLE `ReservationExtras` ADD CONSTRAINT `FK_ReservationExtras_ReservationDetails_ReservationDetailId` FOREIGN KEY (`ReservationDetailId`) REFERENCES `ReservationDetails` (`Id`) ON DELETE CASCADE;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260510133323_PerPassengerDetails', '9.0.0');

ALTER TABLE `ReservationDetails` MODIFY COLUMN `PilotId` int NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512084039_MakePilotOptional', '9.0.0');

DROP TABLE IF EXISTS FlightTimes;

ALTER TABLE Reservations DROP COLUMN IF EXISTS FlightTimeId;

CREATE TABLE `FlightTimes` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Time` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_FlightTimes` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

INSERT INTO `FlightTimes` (`Id`, `CreatedAt`, `IsActive`, `Time`, `UpdatedAt`)
VALUES (1, TIMESTAMP '2026-05-22 15:23:53', TRUE, '08:30', TIMESTAMP '2026-05-22 15:23:53'),
(2, TIMESTAMP '2026-05-22 15:23:53', TRUE, '10:30', TIMESTAMP '2026-05-22 15:23:53'),
(3, TIMESTAMP '2026-05-22 15:23:53', TRUE, '13:00', TIMESTAMP '2026-05-22 15:23:53'),
(4, TIMESTAMP '2026-05-22 15:23:53', TRUE, '15:00', TIMESTAMP '2026-05-22 15:23:53'),
(5, TIMESTAMP '2026-05-22 15:23:53', TRUE, '17:00', TIMESTAMP '2026-05-22 15:23:53');

ALTER TABLE `Reservations` ADD `FlightTimeId` int NOT NULL DEFAULT 1;

CREATE INDEX `IX_Reservations_FlightTimeId` ON `Reservations` (`FlightTimeId`);

ALTER TABLE `Reservations` ADD CONSTRAINT `FK_Reservations_FlightTimes_FlightTimeId` FOREIGN KEY (`FlightTimeId`) REFERENCES `FlightTimes` (`Id`) ON DELETE RESTRICT;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512090053_AddFlightTimes', '9.0.0');

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:02:20', `UpdatedAt` = TIMESTAMP '2026-05-12 12:02:20'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:02:20', `UpdatedAt` = TIMESTAMP '2026-05-12 12:02:20'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:02:20', `UpdatedAt` = TIMESTAMP '2026-05-12 12:02:20'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:02:20', `UpdatedAt` = TIMESTAMP '2026-05-12 12:02:20'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:02:20', `UpdatedAt` = TIMESTAMP '2026-05-12 12:02:20'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512090220_CleanupFlightTimes', '9.0.0');

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:05:27', `UpdatedAt` = TIMESTAMP '2026-05-12 12:05:27'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:05:27', `UpdatedAt` = TIMESTAMP '2026-05-12 12:05:27'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:05:27', `UpdatedAt` = TIMESTAMP '2026-05-12 12:05:27'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:05:27', `UpdatedAt` = TIMESTAMP '2026-05-12 12:05:27'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 12:05:27', `UpdatedAt` = TIMESTAMP '2026-05-12 12:05:27'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512090527_AddFlightTimesAndSlots', '9.0.0');

ALTER TABLE `Customers` DROP FOREIGN KEY `FK_Customers_Countries_CountryId`;

DROP TABLE `Countries`;

ALTER TABLE `Customers` DROP INDEX `IX_Customers_CountryId`;

ALTER TABLE `Customers` DROP COLUMN `CountryId`;

ALTER TABLE `Customers` ADD `Country` varchar(100) CHARACTER SET utf8mb4 NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:26:49', `UpdatedAt` = TIMESTAMP '2026-05-12 13:26:49'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:26:49', `UpdatedAt` = TIMESTAMP '2026-05-12 13:26:49'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:26:49', `UpdatedAt` = TIMESTAMP '2026-05-12 13:26:49'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:26:49', `UpdatedAt` = TIMESTAMP '2026-05-12 13:26:49'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:26:49', `UpdatedAt` = TIMESTAMP '2026-05-12 13:26:49'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512102650_RemoveCountryEntity', '9.0.0');

ALTER TABLE `Reservations` ADD `Notes` longtext CHARACTER SET utf8mb4 NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:41:33', `UpdatedAt` = TIMESTAMP '2026-05-12 13:41:33'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:41:33', `UpdatedAt` = TIMESTAMP '2026-05-12 13:41:33'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:41:33', `UpdatedAt` = TIMESTAMP '2026-05-12 13:41:33'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:41:33', `UpdatedAt` = TIMESTAMP '2026-05-12 13:41:33'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 13:41:33', `UpdatedAt` = TIMESTAMP '2026-05-12 13:41:33'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512104134_AddNotesToReservation', '9.0.0');

ALTER TABLE `Reservations` ADD `PickupLocation` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Reservations` ADD `PickupStatus` int NOT NULL DEFAULT 0;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 14:43:14', `UpdatedAt` = TIMESTAMP '2026-05-12 14:43:14'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 14:43:14', `UpdatedAt` = TIMESTAMP '2026-05-12 14:43:14'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 14:43:14', `UpdatedAt` = TIMESTAMP '2026-05-12 14:43:14'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 14:43:14', `UpdatedAt` = TIMESTAMP '2026-05-12 14:43:14'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 14:43:14', `UpdatedAt` = TIMESTAMP '2026-05-12 14:43:14'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512114315_AddPickupDetails', '9.0.0');

ALTER TABLE `Reservations` ADD `Title` longtext CHARACTER SET utf8mb4 NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:07:01', `UpdatedAt` = TIMESTAMP '2026-05-12 15:07:01'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:07:01', `UpdatedAt` = TIMESTAMP '2026-05-12 15:07:01'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:07:01', `UpdatedAt` = TIMESTAMP '2026-05-12 15:07:01'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:07:01', `UpdatedAt` = TIMESTAMP '2026-05-12 15:07:01'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:07:01', `UpdatedAt` = TIMESTAMP '2026-05-12 15:07:01'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512120701_AddTitleToReservation', '9.0.0');

ALTER TABLE `Payments` ADD `Notes` longtext CHARACTER SET utf8mb4 NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:40:19', `UpdatedAt` = TIMESTAMP '2026-05-12 15:40:19'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:40:19', `UpdatedAt` = TIMESTAMP '2026-05-12 15:40:19'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:40:19', `UpdatedAt` = TIMESTAMP '2026-05-12 15:40:19'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:40:19', `UpdatedAt` = TIMESTAMP '2026-05-12 15:40:19'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-12 15:40:19', `UpdatedAt` = TIMESTAMP '2026-05-12 15:40:19'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260512124020_AddNotesToPayment', '9.0.0');

ALTER TABLE `Pilots` ADD `PilotGroupId` int NULL;

CREATE TABLE `PilotGroups` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_PilotGroups` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-13 13:23:53', `UpdatedAt` = TIMESTAMP '2026-05-13 13:23:53'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-13 13:23:53', `UpdatedAt` = TIMESTAMP '2026-05-13 13:23:53'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-13 13:23:53', `UpdatedAt` = TIMESTAMP '2026-05-13 13:23:53'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-13 13:23:53', `UpdatedAt` = TIMESTAMP '2026-05-13 13:23:53'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-13 13:23:53', `UpdatedAt` = TIMESTAMP '2026-05-13 13:23:53'
WHERE `Id` = 5;
SELECT ROW_COUNT();


CREATE INDEX `IX_Pilots_PilotGroupId` ON `Pilots` (`PilotGroupId`);

ALTER TABLE `Pilots` ADD CONSTRAINT `FK_Pilots_PilotGroups_PilotGroupId` FOREIGN KEY (`PilotGroupId`) REFERENCES `PilotGroups` (`Id`) ON DELETE SET NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260513102354_AddPilotGroups', '9.0.0');

ALTER TABLE `Reservations` ADD `AgencyId` int NULL;

ALTER TABLE `Reservations` ADD `AgencyPrice` decimal(18,2) NULL;

ALTER TABLE `Reservations` ADD `IsAgencyBooking` tinyint(1) NOT NULL DEFAULT FALSE;

CREATE TABLE `Agencies` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `ContactPerson` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `PhoneNumber` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `Email` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Address` longtext CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    CONSTRAINT `PK_Agencies` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 11:23:50', `UpdatedAt` = TIMESTAMP '2026-05-14 11:23:50'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 11:23:50', `UpdatedAt` = TIMESTAMP '2026-05-14 11:23:50'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 11:23:50', `UpdatedAt` = TIMESTAMP '2026-05-14 11:23:50'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 11:23:50', `UpdatedAt` = TIMESTAMP '2026-05-14 11:23:50'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 11:23:50', `UpdatedAt` = TIMESTAMP '2026-05-14 11:23:50'
WHERE `Id` = 5;
SELECT ROW_COUNT();


CREATE INDEX `IX_Reservations_AgencyId` ON `Reservations` (`AgencyId`);

ALTER TABLE `Reservations` ADD CONSTRAINT `FK_Reservations_Agencies_AgencyId` FOREIGN KEY (`AgencyId`) REFERENCES `Agencies` (`Id`) ON DELETE SET NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260514082350_AddAgencies', '9.0.0');

ALTER TABLE `TransportGroups` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `TransportGroups` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `TransportGroups` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Reservations` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `Reservations` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Reservations` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `ReservationDetails` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `ReservationDetails` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `ReservationDetails` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Pilots` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `Pilots` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Pilots` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `PilotGroups` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `PilotGroups` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `PilotGroups` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Payments` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `Payments` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Payments` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `FlightTimes` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `FlightTimes` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `FlightTimes` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `FlightPackages` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `FlightPackages` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `FlightPackages` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `ExtraServices` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `ExtraServices` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `ExtraServices` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Customers` MODIFY COLUMN `UpdatedAt` datetime(6) NULL;

ALTER TABLE `Customers` ADD `CreatedBy` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Customers` ADD `UpdatedBy` longtext CHARACTER SET utf8mb4 NULL;

CREATE TABLE `AspNetRoles` (
    `Id` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Name` varchar(256) CHARACTER SET utf8mb4 NULL,
    `NormalizedName` varchar(256) CHARACTER SET utf8mb4 NULL,
    `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AspNetRoles` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `AspNetUsers` (
    `Id` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `FullName` longtext CHARACTER SET utf8mb4 NULL,
    `ProfileImageUrl` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UserName` varchar(256) CHARACTER SET utf8mb4 NULL,
    `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 NULL,
    `Email` varchar(256) CHARACTER SET utf8mb4 NULL,
    `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 NULL,
    `EmailConfirmed` tinyint(1) NOT NULL,
    `PasswordHash` longtext CHARACTER SET utf8mb4 NULL,
    `SecurityStamp` longtext CHARACTER SET utf8mb4 NULL,
    `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 NULL,
    `PhoneNumber` longtext CHARACTER SET utf8mb4 NULL,
    `PhoneNumberConfirmed` tinyint(1) NOT NULL,
    `TwoFactorEnabled` tinyint(1) NOT NULL,
    `LockoutEnd` datetime(6) NULL,
    `LockoutEnabled` tinyint(1) NOT NULL,
    `AccessFailedCount` int NOT NULL,
    CONSTRAINT `PK_AspNetUsers` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `AspNetRoleClaims` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `RoleId` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `ClaimType` longtext CHARACTER SET utf8mb4 NULL,
    `ClaimValue` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AspNetRoleClaims` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `AspNetUserClaims` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `ClaimType` longtext CHARACTER SET utf8mb4 NULL,
    `ClaimValue` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AspNetUserClaims` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `AspNetUserLogins` (
    `LoginProvider` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `ProviderKey` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `ProviderDisplayName` longtext CHARACTER SET utf8mb4 NULL,
    `UserId` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_AspNetUserLogins` PRIMARY KEY (`LoginProvider`, `ProviderKey`),
    CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `AspNetUserRoles` (
    `UserId` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `RoleId` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_AspNetUserRoles` PRIMARY KEY (`UserId`, `RoleId`),
    CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `AspNetUserTokens` (
    `UserId` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `LoginProvider` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Name` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Value` longtext CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_AspNetUserTokens` PRIMARY KEY (`UserId`, `LoginProvider`, `Name`),
    CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 10:52:35', `CreatedBy` = NULL, `UpdatedAt` = NULL, `UpdatedBy` = NULL
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 10:52:35', `CreatedBy` = NULL, `UpdatedAt` = NULL, `UpdatedBy` = NULL
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 10:52:35', `CreatedBy` = NULL, `UpdatedAt` = NULL, `UpdatedBy` = NULL
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 10:52:35', `CreatedBy` = NULL, `UpdatedAt` = NULL, `UpdatedBy` = NULL
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 10:52:35', `CreatedBy` = NULL, `UpdatedAt` = NULL, `UpdatedBy` = NULL
WHERE `Id` = 5;
SELECT ROW_COUNT();


CREATE INDEX `IX_AspNetRoleClaims_RoleId` ON `AspNetRoleClaims` (`RoleId`);

CREATE UNIQUE INDEX `RoleNameIndex` ON `AspNetRoles` (`NormalizedName`);

CREATE INDEX `IX_AspNetUserClaims_UserId` ON `AspNetUserClaims` (`UserId`);

CREATE INDEX `IX_AspNetUserLogins_UserId` ON `AspNetUserLogins` (`UserId`);

CREATE INDEX `IX_AspNetUserRoles_RoleId` ON `AspNetUserRoles` (`RoleId`);

CREATE INDEX `EmailIndex` ON `AspNetUsers` (`NormalizedEmail`);

CREATE UNIQUE INDEX `UserNameIndex` ON `AspNetUsers` (`NormalizedUserName`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260514105236_AddIdentityAndAudit', '9.0.0');

ALTER TABLE `Reservations` ADD `Deposit` decimal(18,2) NOT NULL DEFAULT 0.0;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 12:50:14'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 12:50:14'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 12:50:14'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 12:50:14'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-14 12:50:14'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260514125015_AddDepositToReservation', '9.0.0');

ALTER TABLE `Reservations` ADD `PreferredCurrency` int NOT NULL DEFAULT 0;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-16 08:33:08'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-16 08:33:08'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-16 08:33:08'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-16 08:33:08'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-16 08:33:08'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260516083310_AddPreferredCurrencyToReservation', '9.0.0');

ALTER TABLE `Reservations` ADD `DepositMethod` int NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 09:54:07'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 09:54:07'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 09:54:07'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 09:54:07'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 09:54:07'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260517095408_AddDepositMethod', '9.0.0');

ALTER TABLE `Customers` MODIFY COLUMN `PhoneNumber` varchar(20) CHARACTER SET utf8mb4 NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:47:29'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:47:29'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:47:29'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:47:29'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:47:29'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260517114730_MakePhoneNumberOptional', '9.0.0');

ALTER TABLE `ReservationDetails` MODIFY COLUMN `FlightPackageId` int NULL;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:52:14'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:52:14'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:52:14'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:52:14'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-17 11:52:14'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260517115215_MakeFlightPackageOptional', '9.0.0');

ALTER TABLE `ReservationDetails` ADD `PilotAttendance` int NOT NULL DEFAULT 0;

ALTER TABLE `ReservationDetails` ADD `PilotNote` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `Pilots` ADD `FlightsAssigned` int NOT NULL DEFAULT 0;

ALTER TABLE `Pilots` ADD `FlightsFlown` int NOT NULL DEFAULT 0;

UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-19 13:35:34'
WHERE `Id` = 1;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-19 13:35:34'
WHERE `Id` = 2;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-19 13:35:34'
WHERE `Id` = 3;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-19 13:35:34'
WHERE `Id` = 4;
SELECT ROW_COUNT();


UPDATE `FlightTimes` SET `CreatedAt` = TIMESTAMP '2026-05-19 13:35:34'
WHERE `Id` = 5;
SELECT ROW_COUNT();


INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260519133537_AddPilotFlightTracking', '9.0.0');

COMMIT;

