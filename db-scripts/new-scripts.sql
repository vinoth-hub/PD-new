RENAME TABLE master.companies TO master.tenant;
ALTER TABLE master.tenant CHANGE companyName tenantName varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
ALTER TABLE master.tenant CHANGE companiesID tenantID int(10) unsigned auto_increment NOT NULL;

RENAME TABLE master.companyfolders TO master.tenantFolders;
ALTER TABLE master.tenantfolders CHANGE companyfoldersID tenantFoldersID int(10) unsigned auto_increment NOT NULL;
ALTER TABLE master.tenantfolders CHANGE companyID tenantID int(10) unsigned NOT NULL;