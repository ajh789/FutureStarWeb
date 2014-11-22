<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Demo</title>
</head>
<body>
用户类型：<%= session.getAttribute("role") %><br/>
用户标识：<%= session.getAttribute("userid") %><br/>
用户名称：<%= session.getAttribute("username") %><br/>
<img src="images/250px-Camelia_svg.png" alt="Camelia" />
</body>
</html>