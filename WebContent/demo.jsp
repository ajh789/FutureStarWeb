<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Demo</title>
</head>
<body>
<%
if (request.getRequestedSessionId() == null) {
    out.println("会话为空，请登录。<br/>");
} else if (!request.isRequestedSessionIdValid()) {
	out.println("会话超时，请重新登录。<br/>");
} else {
	out.println("会话有效(ID=" + session.getId() + ")。<br/>");
}
%>
用户类型：<%= session.getAttribute("role") %><br/>
用户标识：<%= session.getAttribute("id") %><br/>
用户名称：<%= session.getAttribute("name") %><br/>
<img src="images/250px-Camelia_svg.png" alt="Camelia" />
</body>
</html>