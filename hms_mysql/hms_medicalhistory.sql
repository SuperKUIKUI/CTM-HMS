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
-- Table structure for table `medicalhistory`
--

DROP TABLE IF EXISTS `medicalhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalhistory` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `conditions` varchar(100) NOT NULL,
  `surgeries` varchar(100) NOT NULL,
  `medication` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalhistory`
--

LOCK TABLES `medicalhistory` WRITE;
/*!40000 ALTER TABLE `medicalhistory` DISABLE KEYS */;
INSERT INTO `medicalhistory` VALUES (1,'2019-01-14','Pain in abdomen','Heart Surgery','Crocin'),(2,'2019-01-14','Frequent Indigestion','none','none'),(3,'2019-01-14','Body Pain','none','Iodex'),(4,'2025-11-04','none','none','none'),(5,'2025-11-23','213','8544','1212'),(6,'2025-11-23','Anxiety','None','Sertraline 50mg'),(7,'2025-11-23','Arthritis','Knee replacement','Ibuprofen 400mg'),(8,'2025-11-23','None','Tonsillectomy','None'),(9,'2025-11-23','GERD','None','Omeprazole 20mg'),(10,'2025-11-23','Allergic rhinitis','None','Loratadine 10mg'),(11,'2025-11-23','Hypertension, Diabetes','Gallbladder removal','Lisinopril 10mg, Metformin 500mg'),(12,'2025-01-15','Hypertension, High Cholesterol','None','Lisinopril 10mg, Atorvastatin 20mg'),(13,'2025-02-10','Asthma, Allergies','None','Albuterol inhaler, Loratadine 10mg'),(14,'2025-03-05','Diabetes Type 2','None','Metformin 500mg'),(15,'2025-04-20','Migraine, Anxiety','None','Sumatriptan 50mg, Sertraline 50mg'),(16,'2025-05-12','Arthritis, Back Pain','Knee replacement','Ibuprofen 400mg, Naproxen 500mg'),(17,'2025-06-08','GERD, IBS','None','Omeprazole 20mg'),(18,'2025-07-25','Thyroid Disorder, Anemia','None','Levothyroxine 50mcg, Iron supplement'),(19,'2025-08-18','Hypertension, Diabetes','Appendectomy','Lisinopril 10mg, Metformin 500mg'),(20,'2025-09-30','Depression, Insomnia','None','Escitalopram 10mg'),(21,'2025-10-22','Allergic Rhinitis, Asthma','Tonsillectomy','Loratadine 10mg, Albuterol inhaler'),(22,'2025-11-14','High Cholesterol, GERD','Gallbladder removal','Atorvastatin 20mg, Omeprazole 20mg'),(23,'2025-12-05','Anxiety, Migraine','None','Sertraline 50mg, Sumatriptan 50mg');
/*!40000 ALTER TABLE `medicalhistory` ENABLE KEYS */;
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
