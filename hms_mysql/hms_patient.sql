-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hms
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `email` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(60) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `age` int DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES ('123@gmail.com','11111111','NG SL','bit','male',20,'180','75'),('123dqdqdq@qq.com','123dqdqdq','NG SL','bit','Female',16,'176','73'),('1456@gmail.com','14568755','Bob Alice','TW','male',26,'174','50'),('alice@example.com','pass123','Alice Smith','123 Main St, City A','Female',32,'165','55'),('amanda.taylor@email.com','password123','Amanda Taylor','258 Walnut Ave, San Diego','Female',26,'168cm','62kg'),('bob@example.com','pass456','Bob Johnson','456 Park Ave, City B','Male',45,'180','75'),('charlie@example.com','pass789','Charlie Brown','789 Elm St, City C','Male',28,'175','68'),('daniel.thomas@email.com','password123','Daniel Thomas','852 Pinecrest Rd, Austin','Male',47,'181cm','83kg'),('david.lee@email.com','password123','David Lee','654 Maple Dr, Phoenix','Male',39,'178cm','77kg'),('diana@example.com','pass012','Diana Lee','321 Oak St, City D','Female',50,'160','60'),('emily.brown@email.com','password123','Emily Brown','321 Elm St, Houston','Female',31,'170cm','65kg'),('eric@example.com','pass345','Eric Wang','654 Pine St, City E','Male',35,'178','72'),('james.anderson@email.com','password123','James Anderson','369 Spruce Way, Dallas','Male',33,'176cm','74kg'),('jennifer.martin@email.com','password123','Jennifer Martin','741 Oakwood Blvd, San Jose','Female',29,'163cm','59kg'),('john.smith@email.com','password123','John Smith','123 Main St, New York','Male',35,'180cm','75kg'),('lisa.davis@email.com','password123','Lisa Davis','987 Cedar Ln, Philadelphia','Female',45,'162cm','58kg'),('michelle.white@email.com','password123','Michelle White','963 Hilltop Dr, Jacksonville','Female',38,'167cm','61kg'),('mike.wilson@email.com','password123','Mike Wilson','789 Pine Rd, Chicago','Male',42,'175cm','80kg'),('rakesh@gmail.com','hrishikesh13','Rakesh','Gujarat','male',18,'175','72'),('ramesh@gmail.com','hrishikesh13','Ramesh','Tamil Nadu','male',23,'177','78'),('robert.miller@email.com','password123','Robert Miller','147 Birch St, San Antonio','Male',52,'182cm','85kg'),('sarah.johnson@email.com','password123','Sarah Johnson','456 Oak Ave, Los Angeles','Female',28,'165cm','60kg'),('suresh@gmail.com','hrishikesh13','Suresh','Karnataka','male',12,'160','60');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 15:52:10
