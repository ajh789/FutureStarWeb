<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>学校管理</title>
<style type="text/css">
@import "js/jquery/ui/1.11.2/themes/smoothness/jquery-ui.css";
@import "css/manage.css"
</style>
<script type="text/javascript" src="js/jquery/jquery-1.10.2.min.js" charset="UTF-8"></script>
<script type="text/javascript" src="js/jquery/ui/1.11.2/jquery-ui.min.js" charset="UTF-8"></script>
<script type="text/javascript" src="js/common.js" charset="UTF-8"></script>
<script type="text/javascript" src="js/retcode.js" charset="UTF-8"></script>
<script type="text/javascript" src="js/manage_school.js" charset="UTF-8"></script>
<script type="text/javascript">
$(function() {
  $( "#content_tab" ).tabs();
});
</script>
</head>
<body>
<%
if (session.getAttribute("name") == null) {
	session.setAttribute("frompage", "/futurestar/manage_school.jsp");
	response.sendRedirect("/futurestar/login.jsp");
}
%>
<div id="container">
	<div id="header">
		<h1>Main Title of Web Page</h1>
	</div>
	<div id="menu">
		<h2>菜单</h2>
		<ul>
		<li><a href="manage_school.jsp">学校管理</a></li>
		<li><a href="manage_teacher.jsp">教师管理</a></li>
		<li><a href="manage_parent.jsp">家长管理</a></li>
		<li><a href="manage_student.jsp">学生管理</a></li>
		</ul>
	</div>
	<div id="content">
		<div id="content_tab"> <!-- jQuery UI tab -->
			<ul>
				<li><a href="#content_tab_search">查找</a></li>
				<li><a href="#content_tab_addnew">新增</a></li>
			</ul>
			<div id="content_tab_search">
				<div id="content_tab_search_upper">
					学校名称：<input id="text_schoolname" type="text" value="南京" />
					<input id="button_reqdata" type="button" value="查找" onclick="reqData()" />
					<input id="button_reqdata_up" type="button" value="上一页" onclick="reqDataUp()" />
					<input id="button_reqdata_down" type="button" value="下一页" onclick="reqDataDown()" />
					<span id="span_debugmsg"></span>
				</div> <!-- content_tab_search_upper -->
				<br/>
				<div id="content_tab_search_lower">
					<span id="span_content"></span>
					<span id="span_content_hidden" style="display:block"></span> <!-- Used for inserting new element to DOM. -->
				</div> <!-- content_tab_search_lower -->
			</div> <!-- content_tab_search -->
			<div id="content_tab_addnew">
				<span>页面建设中...</span>
			</div> <!-- content_tab_addnew -->
		</div> <!-- content_tab -->
	</div> <!-- content -->
	<div id="footer">Copyright FutureStar.com.cn</div>
</div> <!-- container -->

</body>
</html>