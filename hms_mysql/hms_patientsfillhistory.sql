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
-- Table structure for table `patientsfillhistory`
--

DROP TABLE IF EXISTS `patientsfillhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patientsfillhistory` (
  `patient` varchar(50) NOT NULL,
  `history` int NOT NULL,
  PRIMARY KEY (`history`),
  KEY `patientsfillhistory_ibfk_1` (`patient`),
  CONSTRAINT `patientsfillhistory_ibfk_1` FOREIGN KEY (`patient`) REFERENCES `patient` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientsfillhistory_ibfk_2` FOREIGN KEY (`history`) REFERENCES `medicalhistory` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientsfillhistory`
--

LOCK TABLES `patientsfillhistory` WRITE;
/*!40000 ALTER TABLE `patientsfillhistory` DISABLE KEYS */;
INSERT INTO `patientsfillhistory` VALUES ('123@gmail.com',4),('123dqdqdq@qq.com',6),('1456@gmail.com',5),('alice@example.com',7),('amanda.taylor@email.com',19),('bob@example.com',8),('charlie@example.com',9),('daniel.thomas@email.com',22),('david.lee@email.com',16),('diana@example.com',10),('emily.brown@email.com',15),('eric@example.com',11),('james.anderson@email.com',20),('jennifer.martin@email.com',21),('john.smith@email.com',12),('lisa.davis@email.com',17),('michelle.white@email.com',23),('mike.wilson@email.com',14),('rakesh@gmail.com',3),('ramesh@gmail.com',1),('robert.miller@email.com',18),('sarah.johnson@email.com',13),('suresh@gmail.com',2);
/*!40000 ALTER TABLE `patientsfillhistory` ENABLE KEYS */;
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
