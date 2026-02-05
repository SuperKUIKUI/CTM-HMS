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
-- Table structure for table `diagnose`
--

DROP TABLE IF EXISTS `diagnose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnose` (
  `appt` int NOT NULL,
  `doctor` varchar(50) NOT NULL,
  `diagnosis` varchar(40) NOT NULL,
  `prescription` varchar(50) NOT NULL,
  PRIMARY KEY (`appt`,`doctor`),
  KEY `diagnose_ibfk_2` (`doctor`),
  CONSTRAINT `diagnose_ibfk_1` FOREIGN KEY (`appt`) REFERENCES `appointment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `diagnose_ibfk_2` FOREIGN KEY (`doctor`) REFERENCES `doctor` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnose`
--

LOCK TABLES `diagnose` WRITE;
/*!40000 ALTER TABLE `diagnose` DISABLE KEYS */;
INSERT INTO `diagnose` VALUES (1,'hathalye7666@gmail.com','Bloating','Ibuprofen as needed'),(2,'hathalye8@gmail.com','Muscle soreness','Stretch morning/night'),(3,'hathalye8@gmail.com','Vitamin Deficiency','Good Diet'),(4,'hathalye7666@gmail.com',' fever',' Cold medicine'),(7,'hathalye8@gmail.com','Not Yet Diagnosed','Not Yet Diagnosed'),(8,'hathalye7666@gmail.com','外伤','云南白药喷雾'),(9,'hathalye7666@gmail.com','','对乙酰氨基酚 500mg对乙酰氨基酚片（泰诺）'),(10,'hathalye7666@gmail.com','感冒','氨咖黄敏胶囊（感康）'),(11,'hathalye7666@gmail.com','发烧','布洛芬 200mg'),(12,'hathalye7666@gmail.com','Migraine','Ibuprofen + Rest'),(13,'hathalye7666@gmail.com','Muscle Strain','Physical Therapy + Painkiller'),(14,'hathalye7666@gmail.com','Viral Cold','Cold Medicine + Hydration'),(15,'hathalye7666@gmail.com','Seasonal Allergy','Antihistamine'),(16,'hathalye7666@gmail.com','Gastritis','Antacid + Diet Adjustment'),(17,'hathalye7666@gmail.com','Healthy, normal vitals','Continue current lifestyle'),(18,'hathalye7666@gmail.com','Asthma stable, mild seasonal variation','Continue inhaler'),(19,'hathalye7666@gmail.com','Diabetes well managed','Continue Metformin'),(20,'hathalye7666@gmail.com','Migraine frequency improved','Continue current treatment'),(21,'hathalye7666@gmail.com','Back pain significantly improved','Continue exercises'),(22,'hathalye7666@gmail.com','Allergies well controlled','Continue antihistamines'),(23,'hathalye7666@gmail.com','Diabetes and hypertension stable','No changes needed'),(24,'hathalye7666@gmail.com','New patient established','Follow up in 6 weeks'),(25,'hathalye7666@gmail.com','GERD symptoms moderate','Continue Omeprazole'),(26,'hathalye7666@gmail.com','Asthma and allergies stable','Continue medications'),(27,'hathalye7666@gmail.com','Arthritis stable','Continue current regimen'),(28,'hathalye7666@gmail.com','Anxiety well controlled','Continue current dose'),(29,'hathalye7666@gmail.com','Thyroid levels normal','Continue medication'),(30,'hathalye7666@gmail.com','Anemia improved','Continue iron'),(31,'hathalye7666@gmail.com','Excellent health','Continue lifestyle'),(32,'hathalye7666@gmail.com','Hypertension controlled','Continue medication'),(33,'hathalye7666@gmail.com','Asthma well controlled','Continue treatment'),(34,'hathalye7666@gmail.com','Early neuropathy detected','Monitor symptoms'),(35,'hathalye7666@gmail.com','Migraine triggers identified','Stress management'),(36,'hathalye7666@gmail.com','Back pain resolved','Maintenance exercises'),(37,'hathalye7666@gmail.com','Allergy symptoms controlled','Continue regimen'),(38,'hathalye7666@gmail.com','Diabetes excellent control','Continue management'),(39,'hathalye7666@gmail.com','Weight loss progressing','Continue diet'),(40,'hathalye7666@gmail.com','GERD improved','Reduce medication'),(41,'hathalye7666@gmail.com','Asthma exacerbation','Increase inhaler'),(42,'hathalye7666@gmail.com','Arthritis flare','Short course NSAIDs'),(43,'hathalye7666@gmail.com','Anxiety managed','Stress management'),(44,'hathalye7666@gmail.com','Thyroid optimal','No changes needed'),(45,'hathalye7666@gmail.com','Anemia resolved','Discontinue iron'),(46,'hathalye7666@gmail.com','Shoulder strain','Physical therapy'),(47,'hathalye7666@gmail.com','Hypertension stable','Continue dose'),(48,'hathalye7666@gmail.com','Asthma controlled','Continue inhaler'),(49,'hathalye7666@gmail.com','Diabetes foot care good','Continue care'),(50,'hathalye7666@gmail.com','Migraine heat triggers','Stay hydrated'),(51,'hathalye7666@gmail.com','Back pain resolved','Home exercises'),(52,'hathalye7666@gmail.com','Allergies minimal','Reduce antihistamine'),(53,'hathalye7666@gmail.com','Diabetes stable','Continue management'),(54,'hathalye7666@gmail.com','Weight goal achieved','Maintenance phase'),(55,'hathalye7666@gmail.com','GERD excellent control','Continue therapy'),(56,'hathalye7666@gmail.com','Asthma stable','Continue treatment'),(57,'hathalye7666@gmail.com','Arthritis improved','Continue management'),(58,'hathalye7666@gmail.com','Anxiety controlled','Continue therapy'),(59,'hathalye7666@gmail.com','Thyroid stable','Annual monitoring'),(60,'hathalye7666@gmail.com','Anemia resolved','Annual check'),(61,'hathalye7666@gmail.com','Excellent health','Preventive care'),(62,'hathalye7666@gmail.com','Hypertension controlled','Continue regimen'),(63,'hathalye7666@gmail.com','Asthma prepared','Preventive medications'),(64,'hathalye7666@gmail.com','Diabetes eye health','Continue screening'),(65,'hathalye7666@gmail.com','Migraine reduced','Continue treatment'),(66,'hathalye7666@gmail.com','Back prevention successful','Continue exercises'),(67,'hathalye7666@gmail.com','Fall allergies controlled','Continue management'),(68,'hathalye7666@gmail.com','Diabetes control excellent','Continue management'),(69,'hathalye7666@gmail.com','Weight maintenance','Healthy lifestyle'),(70,'hathalye7666@gmail.com','GERD excellent','Continue therapy'),(71,'hathalye7666@gmail.com','Asthma preparation','Preventive regimen'),(72,'hathalye7666@gmail.com','Arthritis adequate','Continue management'),(73,'hathalye7666@gmail.com','Anxiety coping effective','Stress management'),(74,'hathalye7666@gmail.com','Thyroid stability','Continue dose'),(75,'hathalye7666@gmail.com','Anemia maintained','Iron-rich diet'),(76,'hathalye7666@gmail.com','Year-end health excellent','Preventive care'),(77,'hathalye7666@gmail.com','Hypertension control excellent','Continue regimen'),(78,'hathalye7666@gmail.com','Asthma management optimal','Continue treatment'),(79,'hathalye7666@gmail.com','Diabetes control outstanding','Continue management'),(80,'hathalye7666@gmail.com','Migraine improvement significant','Continue treatment'),(81,'hathalye7666@gmail.com','Back recovery maintained','Maintenance program'),(82,'hathalye7666@gmail.com','Allergy control best','Continue management');
/*!40000 ALTER TABLE `diagnose` ENABLE KEYS */;
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
