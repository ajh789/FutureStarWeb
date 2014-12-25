INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('金宝宝天印大道幼儿园', 'images/jbb-tydd.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 1.
INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('金宝宝莱茵东郡幼儿园', 'images/jbb-lydj.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 2.
INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('金宝宝金王府幼儿园', 'images/jbb-jwf.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 3.
INSERT INTO T_SCHOOL(NAME, LOGO, INTRO) VALUES('金宝宝博学苑幼儿园', 'images/jbb-bxy.png', '金宝宝幼儿园创建于1999年，隶属于金宝宝投资管理公司。公司目前下设金宝宝幼儿园、金宝宝莱茵东郡幼儿园、金宝宝天印大道幼儿园、金宝宝金王府幼儿园、金宝宝博学苑幼儿园。十年耕耘，金宝宝稳步向前：2000年创建市级标准园；2001年被确定为国家教育部“科学教育”实验单位；2002年创建市级优质园；2004年创建市级示范园并在江宁区勇开连锁分园先河；2007年成功创建江苏省省级优质幼儿园……'); -- ID will be 4.

INSERT INTO T_CLASS(NAME, SCHOOL_ID) VALUES('小一班',1);
INSERT INTO T_CLASS(NAME, SCHOOL_ID) VALUES('小二班',1);
INSERT INTO T_CLASS(NAME, SCHOOL_ID) VALUES('小三班',1);

INSERT INTO T_SCHOOL(NAME) VALUES('南京一中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京二中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京三中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京四中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京五中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京六中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京七中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京八中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京九中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京十中');
INSERT INTO T_SCHOOL(NAME) VALUES('金陵中学');
INSERT INTO T_SCHOOL(NAME) VALUES('南师附中');
INSERT INTO T_SCHOOL(NAME) VALUES('南京外国语学校');
INSERT INTO T_SCHOOL(NAME) VALUES('南京东山外国语学校');

-- 连接查询
SELECT T_CLASS.*, T_SCHOOL.*
FROM T_CLASS, T_SCHOOL
WHERE T_CLASS.SCHOOL_ID=T_SCHOOL.ID;