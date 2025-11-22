-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_turnos
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `agendas`
--

DROP TABLE IF EXISTS `agendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profesional_id` int NOT NULL,
  `dia_semana` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `profesional_id` (`profesional_id`),
  CONSTRAINT `agendas_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendas`
--

LOCK TABLES `agendas` WRITE;
/*!40000 ALTER TABLE `agendas` DISABLE KEYS */;
INSERT INTO `agendas` VALUES (1,2,'Martes','09:00:00','15:00:00',1),(2,2,'Jueves','09:00:00','14:30:00',1),(3,2,'Martes','17:50:00','21:51:00',1),(4,3,'Lunes','09:00:00','12:00:00',1),(5,3,'Lunes','15:00:00','18:00:00',1),(6,4,'Viernes','15:00:00','20:00:00',1);
/*!40000 ALTER TABLE `agendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historiaclinicas`
--

DROP TABLE IF EXISTS `historiaclinicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historiaclinicas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `turno_id` int DEFAULT NULL,
  `diagnostico` text,
  `tratamiento` text,
  `observaciones` text,
  `fecha_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `turno_id` (`turno_id`),
  CONSTRAINT `historiaclinicas_ibfk_1` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_10` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_100` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_101` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_102` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_103` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_104` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_105` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_106` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_107` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_108` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_109` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_11` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_110` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_111` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_112` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_113` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_114` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_115` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_116` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_117` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_118` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_119` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_12` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_120` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_121` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_122` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_123` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_124` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_125` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_126` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_127` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_128` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_129` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_13` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_130` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_131` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_132` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_133` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_134` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_135` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_136` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_137` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_138` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_139` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_14` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_140` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_141` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_142` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_143` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_144` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_145` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_146` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_147` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_148` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_149` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_15` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_150` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_151` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_152` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_153` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_154` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_155` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_156` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_157` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_158` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_159` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_16` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_160` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_161` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_162` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_163` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_164` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_165` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_166` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_167` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_168` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_169` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_17` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_170` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_171` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_172` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_173` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_174` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_18` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_19` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_2` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_20` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_21` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_22` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_23` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_24` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_25` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_26` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_27` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_28` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_29` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_3` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_30` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_31` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_32` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_33` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_34` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_35` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_36` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_37` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_38` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_39` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_4` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_40` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_41` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_42` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_43` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_44` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_45` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_46` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_47` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_48` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_49` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_5` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_50` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_51` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_52` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_53` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_54` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_55` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_56` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_57` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_58` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_59` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_6` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_60` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_61` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_62` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_63` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_64` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_65` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_66` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_67` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_68` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_69` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_7` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_70` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_71` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_72` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_73` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_74` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_75` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_76` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_77` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_78` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_79` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_8` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_80` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_81` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_82` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_83` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_84` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_85` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_86` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_87` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_88` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_89` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_9` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_90` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_91` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_92` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_93` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_94` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_95` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_96` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_97` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_98` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historiaclinicas_ibfk_99` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historiaclinicas`
--

LOCK TABLES `historiaclinicas` WRITE;
/*!40000 ALTER TABLE `historiaclinicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `historiaclinicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `dni_2` (`dni`),
  UNIQUE KEY `dni_3` (`dni`),
  UNIQUE KEY `dni_4` (`dni`),
  UNIQUE KEY `dni_5` (`dni`),
  UNIQUE KEY `dni_6` (`dni`),
  UNIQUE KEY `dni_7` (`dni`),
  UNIQUE KEY `dni_8` (`dni`),
  UNIQUE KEY `dni_9` (`dni`),
  UNIQUE KEY `dni_10` (`dni`),
  UNIQUE KEY `dni_11` (`dni`),
  UNIQUE KEY `dni_12` (`dni`),
  UNIQUE KEY `dni_13` (`dni`),
  UNIQUE KEY `dni_14` (`dni`),
  UNIQUE KEY `dni_15` (`dni`),
  UNIQUE KEY `dni_16` (`dni`),
  UNIQUE KEY `dni_17` (`dni`),
  UNIQUE KEY `dni_18` (`dni`),
  UNIQUE KEY `dni_19` (`dni`),
  UNIQUE KEY `dni_20` (`dni`),
  UNIQUE KEY `dni_21` (`dni`),
  UNIQUE KEY `dni_22` (`dni`),
  UNIQUE KEY `dni_23` (`dni`),
  UNIQUE KEY `dni_24` (`dni`),
  UNIQUE KEY `dni_25` (`dni`),
  UNIQUE KEY `dni_26` (`dni`),
  UNIQUE KEY `dni_27` (`dni`),
  UNIQUE KEY `dni_28` (`dni`),
  UNIQUE KEY `dni_29` (`dni`),
  UNIQUE KEY `dni_30` (`dni`),
  UNIQUE KEY `dni_31` (`dni`),
  UNIQUE KEY `dni_32` (`dni`),
  UNIQUE KEY `dni_33` (`dni`),
  UNIQUE KEY `dni_34` (`dni`),
  UNIQUE KEY `dni_35` (`dni`),
  UNIQUE KEY `dni_36` (`dni`),
  UNIQUE KEY `dni_37` (`dni`),
  UNIQUE KEY `dni_38` (`dni`),
  UNIQUE KEY `dni_39` (`dni`),
  UNIQUE KEY `dni_40` (`dni`),
  UNIQUE KEY `dni_41` (`dni`),
  UNIQUE KEY `dni_42` (`dni`),
  UNIQUE KEY `dni_43` (`dni`),
  UNIQUE KEY `dni_44` (`dni`),
  UNIQUE KEY `dni_45` (`dni`),
  UNIQUE KEY `dni_46` (`dni`),
  UNIQUE KEY `dni_47` (`dni`),
  UNIQUE KEY `dni_48` (`dni`),
  UNIQUE KEY `dni_49` (`dni`),
  UNIQUE KEY `dni_50` (`dni`),
  UNIQUE KEY `dni_51` (`dni`),
  UNIQUE KEY `dni_52` (`dni`),
  UNIQUE KEY `dni_53` (`dni`),
  UNIQUE KEY `dni_54` (`dni`),
  UNIQUE KEY `dni_55` (`dni`),
  UNIQUE KEY `dni_56` (`dni`),
  UNIQUE KEY `dni_57` (`dni`),
  UNIQUE KEY `dni_58` (`dni`),
  UNIQUE KEY `dni_59` (`dni`),
  UNIQUE KEY `dni_60` (`dni`),
  UNIQUE KEY `dni_61` (`dni`),
  UNIQUE KEY `dni_62` (`dni`),
  UNIQUE KEY `dni_63` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (2,'Carlos Vives','15333444','1970-08-25','1155009901','Perón 355 - CABA Bs.As.'),(3,'Silvia Torres','20333444','1990-10-10','35111133355','Caseros 4567 Mendoza'),(4,'Laura Ingalls','30123456','2010-06-05','232045998877','Laprida 319 Bs.As.');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesionales`
--

DROP TABLE IF EXISTS `profesionales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesionales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `especialidad` varchar(100) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `profesionales_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesionales`
--

LOCK TABLES `profesionales` WRITE;
/*!40000 ALTER TABLE `profesionales` DISABLE KEYS */;
INSERT INTO `profesionales` VALUES (2,38,'Dermatología','MN 45678 MP45678'),(3,39,'Clínico','MN 12345'),(4,41,'Pediatría','MN 4321');
/*!40000 ALTER TABLE `profesionales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recepcionistas`
--

DROP TABLE IF EXISTS `recepcionistas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recepcionistas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recepcionistas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recepcionistas`
--

LOCK TABLES `recepcionistas` WRITE;
/*!40000 ALTER TABLE `recepcionistas` DISABLE KEYS */;
INSERT INTO `recepcionistas` VALUES (2,36),(3,40);
/*!40000 ALTER TABLE `recepcionistas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `profesional_id` int DEFAULT NULL,
  `recepcionista_id` int DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `estado` enum('PENDIENTE','REALIZADO','CANCELADO') DEFAULT 'PENDIENTE',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `profesional_id` (`profesional_id`),
  KEY `recepcionista_id` (`recepcionista_id`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_10` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_100` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_103` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_106` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_109` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_112` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_115` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_118` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_121` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_124` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_127` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_13` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_130` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_133` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_136` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_139` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_142` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_145` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_148` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_151` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_154` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_157` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_16` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_160` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_163` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_166` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_169` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_172` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_175` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_178` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_181` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_184` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_187` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_19` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_190` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_193` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_196` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_199` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_202` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_205` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_208` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_211` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_214` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_217` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_22` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_220` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_223` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_226` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_229` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_232` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_235` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_238` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_241` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_244` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_247` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_25` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_250` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_253` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_256` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_259` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_262` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_265` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_268` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_271` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_274` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_277` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_28` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_280` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_283` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_286` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_289` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_292` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_295` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_298` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_301` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_304` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_307` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_31` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_310` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_313` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_316` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_319` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_322` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_325` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_328` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_331` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_334` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_337` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_34` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_340` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_343` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_346` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_349` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_352` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_355` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_358` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_361` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_364` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_367` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_37` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_370` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_373` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_376` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_379` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_382` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_385` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_388` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_391` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_394` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_397` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_4` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_40` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_400` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_403` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_406` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_409` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_412` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_415` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_418` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_421` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_424` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_427` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_43` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_430` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_433` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_436` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_439` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_442` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_445` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_448` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_451` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_454` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_457` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_46` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_460` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_463` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_466` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_469` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_472` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_475` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_478` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_481` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_484` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_487` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_49` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_490` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_493` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_496` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_499` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_502` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_505` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_508` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_511` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_514` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_517` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_52` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_520` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_523` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_524` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_525` FOREIGN KEY (`recepcionista_id`) REFERENCES `recepcionistas` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_55` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_58` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_61` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_64` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_67` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_7` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_70` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_73` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_76` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_79` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_82` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_85` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_88` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_91` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_94` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `turnos_ibfk_97` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (3,2,2,2,'2025-11-20 12:00:00','PENDIENTE','2025-11-20 06:09:49','2025-11-22 20:54:56'),(5,3,2,2,'2025-11-20 13:00:00','PENDIENTE','2025-11-21 17:06:36','2025-11-21 17:06:36'),(6,4,4,3,'2025-11-21 19:00:00','PENDIENTE','2025-11-21 18:17:21','2025-11-22 20:16:50');
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','RECEPCIONISTA','PROFESIONAL') NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `usuarios_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Ezequiel','admin@admin.com','$2b$10$c/xqOZxsNQgx16eL11oWj.KolPsKP0EU/V1hGrJW9Pszl3rbhm98W','ADMIN',1),(36,'Sofía García','sgarcia@clinic.com','$2b$10$Nnd6CN3wkSjNB7RaVjSl7OTkqFyQK9havTGkzEFVNTCQCDKDCFoDm','RECEPCIONISTA',1),(38,'María López','dra.mlopez@clinic.com','$2b$10$4iXS3N7PYSGMZ33XCK.q5eOmtCYYpfdiX0hxMIO8ZqAu819bYv9Ge','PROFESIONAL',1),(39,'Carlos Diaz','dr.cdiaz@clinic.com','$2b$10$ibzUB/4rKnoWAsZ7YiVDledhgHuSSpWkEGp65Clx0T9CXofAGJqZi','PROFESIONAL',1),(40,'María Toledo','mtoledo@clinic.com','$2b$10$TYZ5/dESlPcYKN8PrWGDgejo4sbrqBurbcMnkcEoXgKjgToel7aQy','RECEPCIONISTA',1),(41,'Marcos Cetta','dra.mcetta@clinic.com','$2b$10$rQVkgncs7N13SHuN2RwoX.rKQzzTwcJM6dsFCfEEc9lLp.rKdHPw.','PROFESIONAL',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22 18:29:49
