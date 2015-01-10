<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>信息管理主页</title>
<style type="text/css">
div#container {width:100%}
div#header    {background-color:#99bbbb;}
div#menu      {background-color:#ffff99; height:650px; width:15%; float:left; overflow:auto;}
div#content   {background-color:#EEEEEE; height:650px; width:85%; float:left; overflow:auto;}
div#content_upper   {background-color:#EEEEEE; height:05%; overflow:auto;}
div#content_lower   {background-color:#EEEEEE; height:95%; overflow:auto;}
div#footer    {background-color:#99bbbb; clear:both; text-align:center;}
span#span_debugmsg {display:none; color:red;}
input#button_reqdata_up   {display:none;}
input#button_reqdata_down {display:none;}
h1 {margin-bottom:0;}
h2 {margin-bottom:0; font-size:14px;}
ul {margin:0;}
li {list-style:none;}
table#schools {font-size:10px;}
.table_school_edit {font-size:10px;}
.table_school_edit tr {vertical-align:top;}
</style>
<script type="text/javascript" src="js/ajax.js" charset="UTF-8"></script>
</head>
<body>
<%
if (session.getAttribute("name") == null) {
  response.sendRedirect("/futurestar/login.jsp");
}
else {
%>
<div id="container">
<div id="header">
<h1>Main Title of Web Page</h1>
</div>
<div id="menu">
<h2>菜单</h2>
<ul>
<li><a href="manage_school.jsp">学校管理</a></li>
<li><a href="">教师管理</a></li>
<li><a href="">学生管理</a></li>
</ul>
</div>
<div id="content">
<div id="content_upper">
学校名称：
<input id="text_schoolname" type="text" value="南京" />
<input id="button_reqdata" type="button" value="查找" onclick="reqData()" />
<input id="button_reqdata_up" type="button" value="上一页" onclick="reqDataUp()" />
<input id="button_reqdata_down" type="button" value="下一页" onclick="reqDataDown()" />
</div>
<div id="content_lower">
<span id="span_debugmsg"></span>
<span id="span_content"></span>
</div>
</div>
<div id="footer">Copyright FutureStar.com.cn</div>
</div>
<%
} // else
%>
</body>
</html>