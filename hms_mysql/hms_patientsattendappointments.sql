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
-- Table structure for table `patientsattendappointments`
--

DROP TABLE IF EXISTS `patientsattendappointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patientsattendappointments` (
  `patient` varchar(50) NOT NULL,
  `appt` int NOT NULL,
  `concerns` varchar(40) NOT NULL,
  `symptoms` varchar(40) NOT NULL,
  PRIMARY KEY (`patient`,`appt`),
  KEY `appt` (`appt`),
  CONSTRAINT `patientsattendappointments_ibfk_1` FOREIGN KEY (`patient`) REFERENCES `patient` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientsattendappointments_ibfk_2` FOREIGN KEY (`appt`) REFERENCES `appointment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientsattendappointments`
--

LOCK TABLES `patientsattendappointments` WRITE;
/*!40000 ALTER TABLE `patientsattendappointments` DISABLE KEYS */;
INSERT INTO `patientsattendappointments` VALUES ('123@gmail.com',9,'摔倒','上皮组织出血'),('123@gmail.com',10,'喉咙疼','感冒'),('123@gmail.com',11,'fever','stomach'),('123dqdqdq@qq.com',8,'膝盖疼','扭伤'),('alice@example.com',12,'Headache','Dizziness'),('amanda.taylor@email.com',24,'New patient consult','Fatigue weight changes'),('amanda.taylor@email.com',36,'Back pain progress','Significant improvement'),('amanda.taylor@email.com',48,'Asthma summer','Good control'),('amanda.taylor@email.com',60,'Anemia maintenance','Stable'),('amanda.taylor@email.com',72,'Arthritis winter','Expected stiffness'),('bob@example.com',13,'Back Pain','Stiffness'),('charlie@example.com',14,'Cold','Cough, Fever'),('daniel.thomas@email.com',27,'Arthritis pain management','Morning stiffness'),('daniel.thomas@email.com',39,'Weight management','5kg weight loss'),('daniel.thomas@email.com',51,'Back maintenance','Stable'),('daniel.thomas@email.com',63,'Asthma fall prep','Preventative care'),('daniel.thomas@email.com',75,'Anemia year-end','Maintained'),('david.lee@email.com',21,'Back pain PT followup','Improved mobility'),('david.lee@email.com',33,'Asthma control check','Good control'),('david.lee@email.com',45,'Anemia iron check','More energy'),('david.lee@email.com',57,'Arthritis summer','Less stiffness'),('david.lee@email.com',69,'Weight goal','Target reached'),('david.lee@email.com',81,'Back annual','Full recovery'),('diana@example.com',15,'Allergy','Itchy Eyes'),('emily.brown@email.com',20,'Migraine frequency check','2-3 migraines monthly'),('emily.brown@email.com',32,'Hypertension med adjustment','Occasional dizziness'),('emily.brown@email.com',44,'Thyroid med adjustment','Weight stable'),('emily.brown@email.com',56,'Asthma humidity','Minor wheezing'),('emily.brown@email.com',68,'Diabetes review','Well managed'),('emily.brown@email.com',80,'Migraine summary','50% reduction'),('eric@example.com',16,'Stomach Ache','Nausea'),('james.anderson@email.com',25,'GERD evaluation','Heartburn after meals'),('james.anderson@email.com',37,'Allergy peak season','Itchy eyes nasal congestion'),('james.anderson@email.com',49,'Diabetes foot care','No issues'),('james.anderson@email.com',61,'Annual physical','Excellent health'),('james.anderson@email.com',73,'Anxiety holiday','Coping strategies'),('jennifer.martin@email.com',26,'Asthma allergy spring check','Increased sneezing'),('jennifer.martin@email.com',38,'Diabetes annual review','Stable HbA1c'),('jennifer.martin@email.com',50,'Migraine summer','Heat triggers'),('jennifer.martin@email.com',62,'Hypertension fall','Stable'),('jennifer.martin@email.com',74,'Thyroid winter','Stable'),('john.smith@email.com',17,'Annual checkup BP review','None'),('john.smith@email.com',29,'Thyroid levels check','Stable energy'),('john.smith@email.com',41,'Asthma exacerbation','More inhaler use'),('john.smith@email.com',53,'Diabetes summer','Stable'),('john.smith@email.com',65,'Migraine pattern','Reduced frequency'),('john.smith@email.com',77,'Hypertension year-end','Well controlled'),('lisa.davis@email.com',22,'Seasonal allergy prep','None'),('lisa.davis@email.com',34,'Diabetes screening','Finger numbness'),('lisa.davis@email.com',46,'Sports injury','Shoulder pain'),('lisa.davis@email.com',58,'Anxiety maintenance','Stable mood'),('lisa.davis@email.com',70,'GERD annual','Excellent control'),('lisa.davis@email.com',82,'Allergy year-end','Best control'),('michelle.white@email.com',28,'Anxiety med review','Better sleep'),('michelle.white@email.com',40,'GERD diet check','Reduced symptoms'),('michelle.white@email.com',52,'Allergy mid-year','Well controlled'),('michelle.white@email.com',64,'Diabetes eye followup','Normal results'),('michelle.white@email.com',76,'Year-end physical','Excellent'),('mike.wilson@email.com',19,'Diabetes blood sugar review','Increased thirst'),('mike.wilson@email.com',31,'Routine physical','None'),('mike.wilson@email.com',43,'Anxiety assessment','Work stress'),('mike.wilson@email.com',55,'GERD long-term','Good control'),('mike.wilson@email.com',67,'Allergy fall','Mild symptoms'),('mike.wilson@email.com',79,'Diabetes year-end','Excellent control'),('rakesh@gmail.com',3,'nausea','fever'),('ramesh@gmail.com',1,'none','itchy throat'),('robert.miller@email.com',23,'Diabetes hypertension review','Stable'),('robert.miller@email.com',35,'Migraine triggers','Stress related'),('robert.miller@email.com',47,'Hypertension summer','Stable BP'),('robert.miller@email.com',59,'Thyroid routine','Normal levels'),('robert.miller@email.com',71,'Asthma winter prep','Preventative'),('sarah.johnson@email.com',18,'Asthma cold season followup','Occasional wheezing'),('sarah.johnson@email.com',30,'Anemia followup','Less fatigue'),('sarah.johnson@email.com',42,'Arthritis flare','Increased knee pain'),('sarah.johnson@email.com',54,'Weight progress','Continued improvement'),('sarah.johnson@email.com',66,'Back prevention','No recurrence'),('sarah.johnson@email.com',78,'Asthma winter','Good prep'),('suresh@gmail.com',2,'infection','fever');
/*!40000 ALTER TABLE `patientsattendappointments` ENABLE KEYS */;
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
