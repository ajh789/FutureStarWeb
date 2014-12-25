CREATE TABLE T_ADMIN -- Admin logs in with NAME.
(
ID        INTEGER      PRIMARY KEY AUTOINCREMENT NOT NULL,
NAME      VARCHAR(255) UNIQUE                    NOT NULL, -- Only one root.
NICKNAME  VARCHAR(255)                           NOT NULL,
PASSWORD  VARCHAR(255)                           NOT NULL, -- Should be encrypted data.
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

CREATE TABLE T_SCHOOL
(
ID        INTEGER      PRIMARY KEY AUTOINCREMENT NOT NULL,
NAME      VARCHAR(255) UNIQUE                    NOT NULL,
LOGO      VARCHAR(255)                                   , -- Logo image location.
ISLOCKED  INTEGER                                NOT NULL DEFAULT 0 -- 0 - unlocked, 1 - locked
);

CREATE TABLE T_CLASS
(
ID        INTEGER      PRIMARY KEY AUTOINCREMENT NOT NULL,
NAME      VARCHAR(255) UNIQUE                    NOT NULL,
SCHOOL_ID INTEGER                                NOT NULL,
FOREIGN KEY(SCHOOL_ID) REFERENCES T_SCHOOL(ID)
);

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
FOREIGN KEY(CHILD4_ID) REFERENCES T_CHILD(ID)
);

CREATE TABLE T_TEACHER -- Teacher logs in with ID.
(
ID        INTEGER      PRIMARY KEY AUTOINCREMENT NOT NULL,
NAME      VARCHAR(255) UNIQUE                    NOT NULL, -- Use mobile phone number.
NICKNAME  VARCHAR(255)                           NOT NULL,
GENDER    INTEGER                                NOT NULL DEFAULT 0, -- 0 - male, 1 - female
PASSWORD  VARCHAR(255)                           NOT NULL, -- Should be encrypted data.
CLASS_ID  INTEGER                                        , -- Could be null.
SCHOOL_ID INTEGER                                NOT NULL,
PRIVILEGE INTEGER                                NOT NULL DEFAULT 2, -- 0 - school admin, 1 - class admin, 2 - none admin
ISLOCKED  INTEGER                                NOT NULL DEFAULT 1, -- 0 - unlocked, 1 - locked
FOREIGN KEY(CLASS_ID) REFERENCES T_CLASS(ID),
FOREIGN KEY(SCHOOL_ID) REFERENCES T_SCHOOL(ID)
);

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
FOREIGN KEY(PARENT_ID_DAD) REFERENCES T_PARENT(ID),
FOREIGN KEY(PARENT_ID_MOM) REFERENCES T_PARENT(ID),
FOREIGN KEY(CLASS_ID)      REFERENCES T_CLASS(ID)
);