CREATE TABLE T_ADMIN -- Admin logs in with NAME.
(
ID        CHAR(8)      PRIMARY KEY NOT NULL DEFAULT 'null',
NAME      VARCHAR(255) UNIQUE      NOT NULL, -- Only one root.
NICKNAME  VARCHAR(255)             NOT NULL,
LOGO      VARCHAR(255)             NOT NULL DEFAULT 'null', -- Logo image location.
PASSWORD  VARCHAR(255)             NOT NULL, -- Should be encrypted data.
CREATION  CHAR(20)                 NOT NULL DEFAULT 'null', -- Time stamp of creation.
LASTLOGIN CHAR(20)                 NOT NULL DEFAULT 'null', -- Time stamp of last login.
-- PRIVILEGE: 
---- Bitwise permission control.
---- XXXX (insert|delete|update|select)
---- ||||-> bit flag for select, 0 or 1
---- |||--> bit flag for update, 0 or 1
---- ||---> bit flag for delete, 0 or 1
---- |----> bit flag for insert, 0 or 1
PRIVILEGE INTEGER                                NOT NULL DEFAULT 9, -- 1001
ISLOCKED  INTEGER                                NOT NULL DEFAULT 1 -- 0 - unlocked, 1 - locked
);

CREATE VIEW V_ADMIN AS
SELECT
hex(ID) AS ID, NAME, NICKNAME, LOGO, PASSWORD, CREATION, LASTLOGIN, PRIVILEGE, ISLOCKED
FROM T_ADMIN;

CREATE TRIGGER T_ADMIN_AutoGenerateGUID
AFTER INSERT ON T_ADMIN
WHEN (NEW.ID = 'null')
BEGIN
    UPDATE T_ADMIN SET ID = (SELECT randomblob(8)) WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER T_ADMIN_AutoGenerateTimeStamp
AFTER INSERT ON T_ADMIN
WHEN (NEW.CREATION = 'null')
BEGIN
    UPDATE T_ADMIN SET 
        CREATION = (SELECT strftime('%Y%m%d%H%M%S%f','now'))
    WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER T_ADMIN_AutoGenerateLogo
AFTER INSERT ON T_ADMIN
WHEN (NEW.LOGO = 'null')
BEGIN
    UPDATE T_ADMIN SET LOGO = 'images/admins/default.png' WHERE rowid = NEW.rowid;
END;

CREATE TABLE T_SCHOOL
(
ID          CHAR(16)     PRIMARY KEY  NOT NULL DEFAULT 'null', -- GUID, e.g. 09D2486D-7C0E-492D-9BD5-AC1145163F03
NAME        VARCHAR(255) UNIQUE       NOT NULL,
LOGO        VARCHAR(255)              NOT NULL DEFAULT 'null', -- Logo image location.
INTRO       VARCHAR(65536)            NOT NULL DEFAULT 'null', -- Introduction
CREATION    CHAR(20)                  NOT NULL DEFAULT 'null', -- Time stamp of creation.
LASTUPDATE  CHAR(20)                  NOT NULL DEFAULT 'null', -- Time stamp of last update.
ISLOCKED    INTEGER                   NOT NULL DEFAULT 0 -- 0 - unlocked, 1 - locked
);

-- Use X'' notation to convert hex string to blob data.
-- Use HEX() method to convert blob data to hex string.
CREATE TRIGGER T_SCHOOL_AutoGenerateGUID
AFTER INSERT ON T_SCHOOL
WHEN (NEW.ID = 'null')
BEGIN
    UPDATE T_SCHOOL SET ID = (SELECT randomblob(16)) WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER T_SCHOOL_AutoGenerateLogo
AFTER INSERT ON T_SCHOOL
WHEN (NEW.LOGO = 'null')
BEGIN
    UPDATE T_SCHOOL SET LOGO = 'images/schools/default.png' WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER T_SCHOOL_AutoGenerateTimeStamp
AFTER INSERT ON T_SCHOOL
WHEN (NEW.CREATION = 'null')
BEGIN
    UPDATE T_SCHOOL SET 
        CREATION = (SELECT strftime('%Y%m%d%H%M%S%f','now'))
    WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER T_SCHOOL_AutoUpdateTimeStamp
AFTER UPDATE ON T_SCHOOL
BEGIN
    UPDATE T_SCHOOL SET 
        LASTUPDATE = (SELECT strftime('%Y%m%d%H%M%S%f','now'))
    WHERE ID = NEW.ID;
END;

-- Create a table T_CLASS for each school by copying same schemas from T_CLASS. 
-- Naming convention is T_CLASS_FROM_SCHOOL_XXX, where XXX is school id.
CREATE TABLE T_CLASS
(
ID        CHAR(8)      PRIMARY KEY NOT NULL DEFAULT 'null',
NAME      VARCHAR(255) UNIQUE      NOT NULL,
CREATION  CHAR(20)                 NOT NULL DEFAULT 'null' -- Time stamp of creation.
);

-- Use same naming convention as T_CLASS.
CREATE VIEW V_CLASS AS
SELECT
hex(ID) AS ID, NAME, CREATION
FROM T_CLASS;

CREATE TRIGGER T_CLASS_AutoGenerateGUID
AFTER INSERT ON T_CLASS
WHEN (NEW.ID = 'null')
BEGIN
    UPDATE T_CLASS SET ID = (SELECT randomblob(8)) WHERE rowid = NEW.rowid;
END;

CREATE TABLE T_PARENT -- Parent logs in with ID.
(
ID        INTEGER      PRIMARY KEY AUTOINCREMENT NOT NULL,
NAME      VARCHAR(255) UNIQUE                    NOT NULL, -- Use mobile phone number.
NICKNAME  VARCHAR(255)                           NOT NULL,
GENDER    INTEGER                                NOT NULL DEFAULT 0, -- 0 - male, 1 - female
PASSWORD  VARCHAR(255)                           NOT NULL, -- Should be encrypted data.
CHILD1_ID INTEGER                                        , -- Could be null.
CHILD2_ID INTEGER                                        , -- Could be null.
CHILD3_ID INTEGER                                        , -- Could be null.
CHILD4_ID INTEGER                                        , -- Could be null.
CHILD5_ID INTEGER                                        , -- Could be null.
CHILD6_ID INTEGER                                        , -- Could be null.
PRIVILEGE INTEGER                                NOT NULL DEFAULT -1, -- Not used.
ISLOCKED  INTEGER                                NOT NULL DEFAULT 1, -- 0 - unlocked, 1 - locked
FOREIGN KEY(CHILD1_ID) REFERENCES T_CHILD(ID),
FOREIGN KEY(CHILD2_ID) REFERENCES T_CHILD(ID),
FOREIGN KEY(CHILD3_ID) REFERENCES T_CHILD(ID),
FOREIGN KEY(CHILD4_ID) REFERENCES T_CHILD(ID),
FOREIGN KEY(CHILD5_ID) REFERENCES T_CHILD(ID),
FOREIGN KEY(CHILD6_ID) REFERENCES T_CHILD(ID)
);

CREATE TABLE T_TEACHER -- Teacher logs in with MOBILENUM.
(
ID        INTEGER      PRIMARY KEY AUTOINCREMENT NOT NULL,
NAME      VARCHAR(255)                           NOT NULL,
LOGO      VARCHAR(255)                           NOT NULL DEFAULT 'null', -- Logo image location.
MOBILENUM VARCHAR(11)  UNIQUE                    NOT NULL, -- Mobile number, used as login name.
GENDER    INTEGER                                NOT NULL DEFAULT 0, -- 0 - male, 1 - female
PASSWORD  VARCHAR(255)                           NOT NULL, -- Should be encrypted data.
CLASS_ID  INTEGER                                        , -- Could be null.
SCHOOL_ID CHAR(16)                               NOT NULL,
PRIVILEGE INTEGER                                NOT NULL DEFAULT 2, -- 0 - school admin, 1 - class admin, 2 - none admin
ISLOCKED  INTEGER                                NOT NULL DEFAULT 1, -- 0 - unlocked, 1 - locked
CREATION  CHAR(20)                               NOT NULL DEFAULT 'null', -- Time stamp of creation.
LASTLOGIN CHAR(20)                               NOT NULL DEFAULT 'null', -- Time stamp of last login.
FOREIGN KEY(CLASS_ID) REFERENCES T_CLASS(ID),
FOREIGN KEY(SCHOOL_ID) REFERENCES T_SCHOOL(ID)
);

CREATE TRIGGER T_TEACHER_AutoGenerateTimeStamp
AFTER INSERT ON T_TEACHER
WHEN (NEW.CREATION = 'null')
BEGIN
    UPDATE T_TEACHER SET 
        CREATION = (SELECT strftime('%Y%m%d%H%M%S%f','now'))
    WHERE rowid = NEW.rowid;
END;

CREATE TRIGGER T_TEACHER_SetDefaultLogo
AFTER INSERT ON T_TEACHER
WHEN (NEW.LOGO = 'null')
BEGIN
    UPDATE T_TEACHER SET 
        LOGO = 'images/teachers/default.png'
    WHERE rowid = NEW.rowid;
END;

CREATE TABLE T_CHILD
(
ID            INTEGER      PRIMARY KEY NOT NULL, -- Use id number on ID card.
NAME          VARCHAR(255)             NOT NULL, -- Use name on ID card.
GENDER        INTEGER                  NOT NULL DEFAULT 0, -- 0 - male, 1 - female
BIRTH_YEAR    INTEGER                  NOT NULL CHECK(BIRTH_YEAR>1950),
BIRTH_MONTH   INTEGER                  NOT NULL CHECK(BIRTH_MONTH>=1 AND BIRTH_MONTH<=12),
BIRTH_DAY     INTEGER                  NOT NULL CHECK(BIRTH_DAY>=1 AND BIRTH_DAY<=31),
PARENT_ID_DAD INTEGER                          , -- Could be null? Or one of PARENT_ID_DAD & PARENT_ID_MOM could be null?
PARENT_ID_MOM INTEGER                          , -- Could be null?
CLASS_ID      INTEGER                  NOT NULL,
/* This creates a circular/cyclic dependency between T_PARENET and T_CHILD.
FOREIGN KEY(PARENT_ID_DAD) REFERENCES T_PARENT(ID),
FOREIGN KEY(PARENT_ID_MOM) REFERENCES T_PARENT(ID),
*/
FOREIGN KEY(CLASS_ID)      REFERENCES T_CLASS(ID)
);

CREATE TABLE T_CATALOG -- Catalog of posters.
(
ID   INTEGER PRIMARY KEY NOT NULL,
NAME VARCHAR(512)        NOT NULL
);

CREATE TABLE T_POSTER -- Posters
(
ID         INTEGER PRIMARY KEY NOT NULL,
TITLE      VARCHAR(512)        NOT NULL,
CONTENT    VARCHAR(8192)       NOT NULL,
CATALOG_ID INTEGER             NOT NULL,
TEACHER_ID INTEGER             NOT NULL,
FOREIGN KEY(CATALOG_ID) REFERENCES T_CATALOG(ID),
FOREIGN KEY(TEACHER_ID) REFERENCES T_TEACHER(ID)
);

CREATE VIEW V_TEACHER_FROM_SCHOOL AS
SELECT 
T_TEACHER.ID, T_TEACHER.NAME, T_TEACHER.LOGO, T_TEACHER.MOBILENUM, T_TEACHER.GENDER, 
T_TEACHER.CREATION, T_TEACHER.LASTLOGIN, T_TEACHER.ISLOCKED, T_TEACHER.CLASS_ID,
hex(T_SCHOOL.ID) AS SCHOOL_ID, T_SCHOOL.NAME AS SCHOOL_NAME
FROM T_TEACHER, T_SCHOOL
WHERE T_TEACHER.SCHOOL_ID = T_SCHOOL.ID;
