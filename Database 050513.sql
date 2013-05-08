/*
SQLyog Community v10.51 
MySQL - 5.5.30-1.1 : Database - house
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`house` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `house`;

/*Table structure for table `channels` */

DROP TABLE IF EXISTS `channels`;

CREATE TABLE `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nodeid` int(11) NOT NULL,
  `channelindex` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `units` varchar(100) NOT NULL DEFAULT '',
  `divider` int(11) NOT NULL DEFAULT '1',
  `lastvalue` int(11) NOT NULL DEFAULT '0',
  `feedname` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

/*Data for the table `channels` */

LOCK TABLES `channels` WRITE;

insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (1,1,0,'Mains Voltage','V',1,239,'Mains Voltage');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (2,1,1,'Mains Current','A',1000,1701,'Mains Current');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (3,1,2,'Mains Real Power','W',1,401,'Mains Real Power');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (4,1,3,'Mains Apparent Power','W',1,406,'Mains Apparent Power');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (5,1,4,'Mains Power Factor','',100,98,'Mains Power Factor');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (6,2,0,'Garden Bottom Temperature','oC',100,575,'Garden Bottom Temperature');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (7,2,1,'Channel 2','',100,310,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (8,3,0,'Channel 1','',100,1025,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (9,3,1,'Channel 2','',100,298,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (10,4,0,'Channel 1','',100,2080,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (11,4,1,'Channel 2','',100,4590,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (12,4,2,'Channel 3','',100,314,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (13,5,0,'Living Room Temperature','oC',100,2029,'Living Room Temperature');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (14,5,1,'Channel 2','',100,4910,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (15,5,2,'Channel 3','',100,306,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (16,6,0,'Channel 1','',100,2029,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (17,6,1,'Channel 2','',100,4450,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (18,6,2,'Channel 3','',100,307,'');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (19,7,0,'Garden Hosepipe Temperature','oC',100,662,'Garden Hosepipe Temperature');
insert  into `channels`(`id`,`nodeid`,`channelindex`,`name`,`units`,`divider`,`lastvalue`,`feedname`) values (20,7,1,'Channel 2','',100,299,'');

UNLOCK TABLES;

/*Table structure for table `feeds` */

DROP TABLE IF EXISTS `feeds`;

CREATE TABLE `feeds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `group` varchar(100) NOT NULL DEFAULT '',
  `units` varchar(10) NOT NULL DEFAULT '',
  `lastvalue` double NOT NULL DEFAULT '0',
  `lastupdated` datetime NOT NULL,
  `filter` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

/*Data for the table `feeds` */

LOCK TABLES `feeds` WRITE;

insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (1,'Mains Voltage','Mains','V',236,'2013-05-05 08:22:14',2);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (2,'Mains Current','Mains','A',1.151,'2013-05-05 08:22:14',0.1);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (3,'Mains Power Factor','Mains','',0.88,'2013-05-05 08:22:14',0.05);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (4,'Garden Hosepipe Temperature','Temperature','oC',15.68,'2013-05-05 08:21:45',0.3);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (5,'Garden Bottom Temperature','Temperature','oC',11.87,'2013-05-05 08:07:28',0.3);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (6,'Living Room Temperature','Temperature','oC',19.4,'2013-05-05 08:21:37',0.3);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (7,'Mains Real Power','Mains','W',242,'2013-05-05 08:22:14',10);
insert  into `feeds`(`id`,`name`,`group`,`units`,`lastvalue`,`lastupdated`,`filter`) values (8,'Mains Apparent Power','Mains','W',272,'2013-05-05 08:22:14',10);

UNLOCK TABLES;

/*Table structure for table `feedvalues` */

DROP TABLE IF EXISTS `feedvalues`;

CREATE TABLE `feedvalues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feedid` int(11) NOT NULL DEFAULT '0',
  `value` double NOT NULL DEFAULT '0',
  `timestampA` datetime NOT NULL,
  `timestampB` datetime NOT NULL,
  `readingcount` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Data for the table `feedvalues` */

LOCK TABLES `feedvalues` WRITE;

UNLOCK TABLES;

/*Table structure for table `nodes` */

DROP TABLE IF EXISTS `nodes`;

CREATE TABLE `nodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rfnodeid` int(11) NOT NULL DEFAULT '0',
  `location` varchar(100) NOT NULL DEFAULT '',
  `packetversion` int(11) NOT NULL DEFAULT '0',
  `firmware` varchar(100) NOT NULL DEFAULT '',
  `pcb` varchar(100) NOT NULL DEFAULT '',
  `updateInterval` int(11) NOT NULL DEFAULT '0',
  `lastseen` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Data for the table `nodes` */

LOCK TABLES `nodes` WRITE;

insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (1,30,'New Node',0,'Unknown','Unknown',0,'2013-05-05 08:22:14');
insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (2,9,'New Node',0,'Unknown','Unknown',0,'2013-05-05 08:07:27');
insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (3,3,'New Node',0,'Unknown','Unknown',0,'2013-05-05 08:21:41');
insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (4,12,'New Node',0,'Unknown','Unknown',0,'2013-05-05 08:20:48');
insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (5,6,'New Node',0,'Unknown','Unknown',0,'2013-05-05 08:21:32');
insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (6,10,'New Node',0,'Unknown','Unknown',0,'2013-04-29 21:03:57');
insert  into `nodes`(`id`,`rfnodeid`,`location`,`packetversion`,`firmware`,`pcb`,`updateInterval`,`lastseen`) values (7,8,'New Node',0,'Unknown','Unknown',0,'2013-05-05 08:21:45');

UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
