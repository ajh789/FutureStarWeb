INSERT INTO T_SCHOOL(ID, NAME, LOGO, INTRO) VALUES(X'BBBA7053B3E9EADC5600EC6977437B9F', '金宝宝天印大道幼儿园', 'images/jbb-tydd.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 1.
INSERT INTO T_SCHOOL(ID, NAME, LOGO, INTRO) VALUES(X'178B9F65D2FE4F8F1C1E21EC18A7AE0D', '金宝宝莱茵东郡幼儿园', 'images/jbb-lydj.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 2.
INSERT INTO T_SCHOOL(ID, NAME, LOGO, INTRO) VALUES(X'04DB2385F30847A42964A10478525752', '金宝宝金王府幼儿园', 'images/jbb-jwf.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 3.
INSERT INTO T_SCHOOL(ID, NAME, LOGO, INTRO) VALUES(X'D7242886B7A2F89C97C46B3BFBC89A16', '金宝宝博学苑幼儿园', 'images/jbb-bxy.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 4.

INSERT INTO T_CLASS(NAME, SCHOOL_ID) VALUES('小一班', X'BBBA7053B3E9EADC5600EC6977437B9F');
INSERT INTO T_CLASS(NAME, SCHOOL_ID) VALUES('小二班', X'BBBA7053B3E9EADC5600EC6977437B9F');
INSERT INTO T_CLASS(NAME, SCHOOL_ID) VALUES('小三班', X'BBBA7053B3E9EADC5600EC6977437B9F');

INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('南京一中', 'images/njyizh.png', '南京第一中学坐落在金陵城南风光秀丽的秦淮河畔，校址原为清代江宁府箭道和西花园，现任校长尤小平。光绪三十三年（1907年），邑绅就府署旧舍创设崇文学堂，而后四易其名，1933年学校改称为南京市立第一中学，是南京市第一所公办中学，是江苏最早的省重点中学之一，现为江苏省模范学校，国家级示范高中。');
INSERT INTO T_SCHOOL(NAME) VALUES('南京二中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京三中');
INSERT INTO T_SCHOOL(NAME, LOGO) VALUES('南京四中', 'images/njsizh.png');
INSERT INTO T_SCHOOL(NAME) VALUES('南京五中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京六中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京七中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京八中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京九中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京十中');
INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('金陵中学', 'images/jinlingzhongxue.png', '金陵中学坐落在南京市中心，毗邻南京大学，创建于1888年。校园面积75亩，有校舍3万6千平方米，闹中取静，环境优雅，是南京市属学校中唯一的“花园式学校”。她的前身是美国基督教美以美会创办的汇文书院，至今已有120年的办学历史。现为江苏省重点中学、江苏省模范学校、江苏省首批五星级独立高中、国家级示范高中。');
INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('南师附中', 'images/nanshifuzhong.png', '南京师范大学附属中学是一所发展中的百年老校，是江苏省重点中学、江苏省模范学校、首批国家级示范高中，其前身可以溯源至清末两江总督张之洞1902年创办的三江师范学堂的附属中学堂。在一个世纪的办学过程中，学校十易校名，六迁校址，以慎聘良师、锐意实验、校风诚朴、善育英才而著称。');
INSERT INTO T_SCHOOL(NAME) VALUES('南京外国语学校');
INSERT INTO T_SCHOOL(NAME) VALUES('南京东山外国语学校');

-- 连接查询
SELECT T_CLASS.*, T_SCHOOL.*
FROM T_CLASS, T_SCHOOL
WHERE T_CLASS.SCHOOL_ID=T_SCHOOL.ID;