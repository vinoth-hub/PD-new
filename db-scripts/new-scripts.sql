RENAME TABLE master.companies TO master.tenant;
ALTER TABLE master.tenant CHANGE companyName tenantName varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
ALTER TABLE master.tenant CHANGE companiesID tenantID int(10) unsigned auto_increment NOT NULL;

RENAME TABLE master.companyfolders TO master.tenantfolders;
ALTER TABLE master.tenantfolders CHANGE companyfoldersID tenantFoldersID int(10) unsigned auto_increment NOT NULL;
ALTER TABLE master.tenantfolders CHANGE companyID tenantID int(10) unsigned NOT NULL;

ALTER TABLE demo36.`user` ADD `fullname` varchar(100) NULL;

ALTER TABLE demo36.`user` ADD lastactivity DATETIME NULL;

INSERT INTO demo36.`user` (isActive,isDeleted,username,password,ip,title,issysadm,defaultcompany,passwordexpires,fullname,lastactivity) VALUES
	(1,0,'adri','$2b$10$qaUI/ZdT6daRVETBjNQTSuMppNj.ejV8aeFENTikJGCggcPFLypm2',NULL,'adriyaman@hotmail.com',0,1,'2010-03-23',NULL,'2022-01-30 11:51:06.0'),
	(1,0,'Adriyaman','$2b$10$qaUI/ZdT6daRVETBjNQTSuMppNj.ejV8aeFENTikJGCggcPFLypm2','','adriyaman.banerjee@gmail.com',0,1,'2010-03-23','test','2022-01-30 08:35:35.0')

INSERT INTO demo36.transsecurity
    (userID, companyID, categoryID, securityID)
VALUES
    ((SELECT userID FROM demo36.`user` WHERE username = 'adri'),
    1,
    NULL,
    (select securityID FROM demo36.`security` WHERE companyID = 1 AND `level`='Edit Users'));
