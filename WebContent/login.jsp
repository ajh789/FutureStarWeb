<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>用户登录</title>
</head>
<body>
用户名：<%= session.getAttribute("username") %><br/>
<form action="login" method="post">
  <p>登录名称: <input type="text"     name="username" /></p>
  <p>登录密码: <input type="password" name="password" /></p>
  <p>选择角色: 
    管理员<input type="radio" checked="checked" name="role" value="admin" />
    老师<input type="radio" name="role" value="teacher" />
    家长<input type="radio" name="role" value="parent" />
  </p>
  <input type="submit" value="登录" />
</form>
</body>
</html>