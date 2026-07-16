-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.14.0.7165
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for phonehub
CREATE DATABASE IF NOT EXISTS `phonehub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `phonehub`;

-- Dumping structure for table phonehub.cartitems
CREATE TABLE IF NOT EXISTS `cartitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `color` varchar(50) NOT NULL,
  `storage` varchar(50) NOT NULL,
  `price` varchar(50) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `img` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_cartitem_product_id` (`product_id`),
  KEY `FK_cartitem_user_id` (`user_id`),
  CONSTRAINT `FK_cartitem_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `FK_cartitem_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phonehub.cartitems: ~3 rows (approximately)
REPLACE INTO `cartitems` (`id`, `user_id`, `product_id`, `quantity`, `color`, `storage`, `price`, `brand`, `model`, `img`) VALUES
	(9, 2, 2, 2, 'Cosmic Orange', '2TB', '80900', 'Apple', 'iPhone 17 Pro Max', 'https://media-cdn.bnn.in.th/533314/iPhone_17_Pro_Max_01-square_medium.jpg'),
	(10, 2, 2, 4, 'Deep Blue', '1TB', '64900', 'Apple', 'iPhone 17 Pro Max', 'https://media-cdn.bnn.in.th/533314/iPhone_17_Pro_Max_01-square_medium.jpg'),
	(11, 2, 2, 2, 'Silver', '1TB', '64900', 'Apple', 'iPhone 17 Pro Max', 'https://media-cdn.bnn.in.th/533314/iPhone_17_Pro_Max_01-square_medium.jpg');

-- Dumping structure for table phonehub.orderitems
CREATE TABLE IF NOT EXISTS `orderitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_at_purchase` int(11) NOT NULL DEFAULT 1,
  `product_brand` varchar(50) NOT NULL,
  `product_img` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`product_img`)),
  `product_model` varchar(255) NOT NULL,
  `variation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`variation`)),
  PRIMARY KEY (`id`),
  KEY `FK_orderitems_orders_id` (`order_id`),
  KEY `FK_orderitem_products_id` (`product_id`),
  CONSTRAINT `FK_orderitem_products_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `FK_orderitems_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phonehub.orderitems: ~0 rows (approximately)

-- Dumping structure for table phonehub.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `status` enum('pending','paid','shipping','delivered') NOT NULL DEFAULT 'pending',
  `shipping_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_address`)),
  `created_at` varchar(15) NOT NULL,
  `paid_at` varchar(15) NOT NULL,
  `customer_name` varchar(50) NOT NULL,
  `customer_phone` varchar(10) NOT NULL,
  `start_shipping_at` varchar(15) NOT NULL,
  `shipper_name` varchar(50) NOT NULL,
  `tracking_no` varchar(255) NOT NULL,
  `delivery_person_name` varchar(50) NOT NULL,
  `delivery_person_phone` varchar(50) NOT NULL,
  `delivered_at` varchar(15) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_orders_users_id` (`user_id`),
  CONSTRAINT `FK_orders_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `shipping_address` CHECK (json_valid(`shipping_address`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phonehub.orders: ~0 rows (approximately)

-- Dumping structure for table phonehub.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('cod','qrcode','creditcard','mobilebanking') NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('pending','success','failed') NOT NULL DEFAULT 'pending',
  `paid_at` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phonehub.payments: ~0 rows (approximately)

-- Dumping structure for table phonehub.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(50) NOT NULL,
  `model` varchar(255) NOT NULL,
  `variation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`variation`)),
  `img` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`img`)),
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`specifications`)),
  `view_count` int(11) NOT NULL DEFAULT 0,
  `sales_count` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phonehub.products: ~5 rows (approximately)
REPLACE INTO `products` (`id`, `brand`, `model`, `variation`, `img`, `specifications`, `view_count`, `sales_count`) VALUES
	(2, 'Apple', 'iPhone 17 Pro Max', '[{"storage":"2TB","color":"Cosmic Orange","stock":"10","price":"80900"},{"storage":"2TB","color":"Silver","stock":"10","price":"80900"},{"storage":"2TB","color":"Deep Blue","stock":"10","price":"80900"},{"storage":"1TB","color":"Cosmic Orange","stock":"10","price":"64900"},{"storage":"1TB","color":"Silver","stock":"10","price":"64900"},{"storage":"1TB","color":"Deep Blue","stock":"10","price":"64900"},{"storage":"512GB","color":"Cosmic Orange","stock":"10","price":"56900"},{"storage":"512GB","color":"Silver","stock":"10","price":"56900"},{"storage":"512GB","color":"Deep Blue","stock":"10","price":"56900"},{"storage":"256GB","color":"Cosmic Orange","stock":"10","price":"48900"},{"storage":"256GB","color":"Silver","stock":"10","price":"48900"},{"storage":"256GB","color":"Deep Blue","stock":"10","price":"48900"}]', '["https://media-cdn.bnn.in.th/533314/iPhone_17_Pro_Max_01-square_medium.jpg"]', '{"screenSize":"6.9 นิ้ว","screenType":"จอภาพ Super Retina XDR display (เทคโนโลยี LTPO OLED)","refreshRate":"120 Hz","chipset":"ชิป A19 Pro","backCamera":"ระบบกล้องโปร 48MP สามตัว (กล้องหลัก Fusion 48MP, กล้องมุมกว้าง Ultra Wide 48MP และกล้องซูม Telephoto 48MP)","frontCamera":"18MP พร้อมรองรับฟังก์ชัน Center Stage","batteryLife":"ทาง Apple ไม่ได้ระบุตัวเลขหน่วย mAh ไว้อย่างเป็นทางการ แต่ระบุสเปกว่าสามารถเล่นวิดีโอต่อเนื่องได้ยาวนานสูงสุด 37 ชั่วโมง","fastCharge":"รองรับระบบชาร์จเร็วมาตรฐาน USB-C PD ที่ความเร็วประมาณ 27W - 30W (แนะนำให้ใช้งานร่วมกับหัวชาร์จกำลังไฟ 30W ขึ้นไป)","os":"iOS 19 (ระบบปฏิบัติการเริ่มต้นของรุ่นนี้)","connections":"พอร์ต USB-C และรองรับการเชื่อมต่อไร้สายความเร็วสูง 5G, Wi-Fi 7 และ Bluetooth 6.0","highlights":"ขายดีอันดับ 1"}', 0, 0),
	(3, 'Samsung', 'Galaxy S26 Ultra', '[{"storage":"1TB","color":"Titanium Black","stock":"10","price":"66900"},{"storage":"1TB","color":"Titanium Silver","stock":"10","price":"66900"},{"storage":"512GB","color":"Titanium Black","stock":"10","price":"54900"},{"storage":"512GB","color":"Titanium Silver","stock":"10","price":"54900"},{"storage":"256GB","color":"Titanium Black","stock":"10","price":"46900"},{"storage":"256GB","color":"Titanium Silver","stock":"10","price":"46900"}]', '["https://shop.samsung.com/ie/images/products/30442/38429/2000x2000/M3DA512.webp","https://shop.samsung.com/ie/images/products/30442/38428/2000x2000/M3DA512.webp"]', '{"screenSize":"6.9 นิ้ว","screenType":"จอแสดงผลแบบ Dynamic LTPO AMOLED 2X, 24-bit (ดีไซน์กระจก Corning Gorilla Armor 2 และบอดี้ไทเทเนียม)","refreshRate":"120 Hz","chipset":"Qualcomm Snapdragon 8 Elite Gen 5 (for Galaxy)","backCamera":"กล้องหลัง 4 ตัว ความละเอียดหลัก 200MP + เลนส์ซูม 10MP (3x Zoom) + เลนส์ซูม 50MP (5x Zoom) + เลนส์มุมกว้าง Ultra-Wide 50MP","frontCamera":"12MP พร้อมระบบโฟกัสอัตโนมัติความเร็วสูง","batteryLife":"แบตเตอรี่ความจุ 5,000 mAh รองรับการใช้งานต่อเนื่องตลอดทั้งวัน","fastCharge":"รองรับเทคโนโลยี Super Fast Charging 3.0 สูงสุดที่ความเร็ว 60W และชาร์จแบบไร้สาย 25W","os":"One UI 8.5 (ทำงานบนพื้นฐานระบบปฏิบัติการ Android 16)","connections":"พอร์ต USB-C 3.2, รองรับ 5G, Wi-Fi 7, Bluetooth 6.0 และเทคโนโลยี Ultra Wideband (UWB)","highlights":"สุดยอดสมาร์ทโฟนเรือธงพร้อมปากกา S Pen และฟีเจอร์ความปลอดภัยปกป้องความเป็นส่วนตัวในตัว"}', 0, 0),
	(4, 'OPPO', 'Find X8 Pro', '[{"storage":"512GB","color":"Pearl White","stock":"10","price":"39999"},{"storage":"512GB","color":"Space Black","stock":"10","price":"39999"}]', '["https://www.iphone-droid.net/wp-content/uploads/2024/10/oppo-find-x8-series-official-renders-leaked-1.png","https://www.iphone-droid.net/wp-content/uploads/2024/10/oppo-find-x8-series-official-renders-leaked-6.png","https://www.iphone-droid.net/wp-content/uploads/2024/10/oppo-find-x8-series-official-renders-leaked-10.png","https://www.iphone-droid.net/wp-content/uploads/2024/10/oppo-find-x8-series-official-renders-leaked-11.png","https://www.iphone-droid.net/wp-content/uploads/2024/10/oppo-find-x8-series-official-renders-leaked-17.png"]', '{"screenSize":"6.78 นิ้ว","screenType":"หน้าจอขอบโค้งมนแบบ PEBBLE, เทคโนโลยี Infinite View Display (AMOLED)","refreshRate":"120 Hz","chipset":"MediaTek Dimensity 9400 (ระดับเรือธงสถาปัตยกรรม 3 นาโนเมตร)","backCamera":"กล้องโปรระดับ Hasselblad จำนวน 4 ตัว ความละเอียด 50MP ทุกเลนส์ (กล้องหลัก, เลนส์ Ultra-wide, เลนส์ซูม Periscope 3x และเลนส์ซูม Periscope 6x)","frontCamera":"32MP รองรับการถ่ายเซลฟี่มุมมองกว้างและคมชัด","batteryLife":"แบตเตอรี่ซิลิคอนคาร์บอนความหนาแน่นสูง ความจุพิเศษ 5,910 mAh","fastCharge":"รองรับการชาร์จเร็วแบบสาย 80W SUPERVOOC และชาร์จไร้สายความเร็วสูง 50W AIRVOOC","os":"ColorOS 15 (ทำงานบนพื้นฐานระบบปฏิบัติการ Android 15)","connections":"พอร์ต USB-C และเสารับสัญญาณโครงข่ายรอบทิศทาง 360° Surround Antenna รองรับการเชื่อมต่อ 5G, Wi-Fi 7","highlights":"สุดยอดกล้องสายซูมและกล้อง Portrait ในตำนานร่วมกับ Hasselblad พร้อมระบบปุ่มชัตเตอร์แบบสัมผัส Quick Button ด้านข้างตัวเครื่อง"}', 0, 0),
	(5, 'Vivo', 'X200 Pro', '[{"storage":"512GB","color":"Titanium Gray","stock":"10","price":"39999"},{"storage":"512GB","color":"Midnight Blue","stock":"10","price":"39999"}]', '["https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1737463542993/627ab294bbc01131e749e3ef788de1f7.png","https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/Picture_library/1737462258979/zip/img/pc4.jpg"]', '{"screenSize":"6.78 นิ้ว","screenType":"หน้าจอแสดงผลขอบโค้ง 2.5D แบบ AMOLED คมชัดสมจริง","refreshRate":"120 Hz","chipset":"MediaTek Dimensity 9400","backCamera":"กล้องเลนส์ระดับโลกร่วมกับ ZEISS (กล้องหลักความละเอียด 50MP เซนเซอร์ Sony LYT-818 + กล้องซูม Telephoto 200MP ระดับเทพ ZEISS APO + เลนส์ Ultra-Wide 50MP)","frontCamera":"32MP รองรับ AI Portrait หน้าชัดหลังเบลอสวยงามเป็นธรรมชาติ","batteryLife":"แบตเตอรี่ขนาดใหญ่เทคโนโลยีใหม่ ความจุสูงสุดถึง 6,000 mAh","fastCharge":"รองรับเทคโนโลยีชาร์จเร็วระดับเรือธง 90W FlashCharge ผ่านสายพอร์ต Type-C","os":"Funtouch OS 15 (ทำงานบนพื้นฐานระบบปฏิบัติการ Android 15)","connections":"พอร์ต USB-C, การเชื่อมต่อไร้สายความเร็วสูง 5G, Dual SIM Dual Standby (DSDS) และระบบความปลอดภัยเต็มรูปแบบ","highlights":"โดดเด่นที่สุดด้วยกล้องเทเลโฟโตระดับ 200 ล้านพิกเซล ZEISS APO คมชัดแม้ยามค่ำคืนและการซูมระดับพระกาฬ"}', 0, 0),
	(6, 'Xiaomi', '17 Ultra', '[{"storage":"1TB","color":"Black","stock":"10","price":"48990"},{"storage":"1TB","color":"White","stock":"10","price":"48990"},{"storage":"1TB","color":"Starlit Green","stock":"10","price":"48990"},{"storage":"512GB","color":"Black","stock":"10","price":"44990"},{"storage":"512GB","color":"White","stock":"10","price":"44990"},{"storage":"512GB","color":"Starlit Green","stock":"10","price":"44990"}]', '["https://www.ec-mall.com/media/catalog/product/cache/55b8d9149c90ec27221b7d1ab8c3d7ed/x/i/xiaomi-17-ultra-5g_01.jpg","https://www.ec-mall.com/media/catalog/product/cache/55b8d9149c90ec27221b7d1ab8c3d7ed/x/i/xiaomi-17-ultra-5g_02.jpg","https://www.ec-mall.com/media/catalog/product/cache/55b8d9149c90ec27221b7d1ab8c3d7ed/x/i/xiaomi-17-ultra-5g_03.jpg","https://www.ec-mall.com/media/catalog/product/cache/55b8d9149c90ec27221b7d1ab8c3d7ed/x/i/xiaomi-17-ultra-5g_04.jpg","https://www.ec-mall.com/media/catalog/product/cache/55b8d9149c90ec27221b7d1ab8c3d7ed/x/i/xiaomi-17-ultra-5g_08.jpg"]', '{"screenSize":"6.73 นิ้ว","screenType":"จอภาพความสว่างสูงพิเศษ WQHD+ (เทคโนโลยี LTPO AMOLED 3,200 Nits)","refreshRate":"120 Hz","chipset":"Qualcomm Snapdragon 8 Elite (หรือรุ่นเทียบเท่าระดับท็อปปีล่าสุด)","backCamera":"ชุดเลนส์ออปติคอลระดับตำนาน Summilux จาก Leica 4 ตัว ความละเอียด 50MP + 50MP + 50MP + 50MP พร้อมเซนเซอร์หลักขนาดใหญ่ 1 นิ้วเพื่อการเก็บแสงอย่างสมบูรณ์แบบ","frontCamera":"32MP พร้อมระบบประมวลผลอัจฉริยะ Xiaomi HyperAI","batteryLife":"แบตเตอรี่ความหนาแน่นสูงประมาณ 5,000 mAh ถึง 5,300 mAh เพื่อการใช้งานที่ทนทาน","fastCharge":"รองรับการชาร์จเร็วเป็นพิเศษ 90W HyperCharge","os":"Xiaomi HyperOS 2.0 (หรือระบบปฎิบัติการเวอร์ชันล่าสุดระดับโกลบอล)","connections":"พอร์ตความเร็วสูง USB-C, รองรับสัญญาณไร้สาย 5G, Wi-Fi 7 ความเร็วสูง","highlights":"ที่สุดของสมาร์ทโฟนสำหรับการถ่ายภาพระดับโปรด้วยกล้องเลนส์ Leica Summilux และประสิทธิภาพจากชิปเซ็ตรุ่นท็อปสุด"}', 0, 0);

-- Dumping structure for table phonehub.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','manager') NOT NULL DEFAULT 'user',
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `address` varchar(50) NOT NULL,
  `subdistrict` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `province` varchar(20) NOT NULL,
  `postal_code` varchar(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phonehub.users: ~2 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `password`, `role`, `name`, `email`, `phone`, `address`, `subdistrict`, `district`, `province`, `postal_code`) VALUES
	(1, 'Pixe1', '$2b$10$7C51tpWBlgIYUTEONJ1bcOc6ZHXhzQmIpQ.PT5v94yD', 'user', 'sunshine sabyedee', 'thunder2xx1@gmail.com', '0999999999', '', '', '', '', ''),
	(2, 'Pixel', '$2b$10$nzZH/fmOu0ZwI1fv/2IfpefMgd3n2CUA47v1vnpyNH77tEWf/fJ.K', 'user', 'sunshine sabyedee', 'thunder2xx1@gmail.com', '0999999999', '', '', '', '', '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
