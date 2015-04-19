var g_manageschool_page_url = "/futurestar/manage_school.jsp";
var g_login_page_url = "/futurestar/login.jsp";
var g_webpages_url = {
	login        : "/futurestar/login.jsp",
	manageschool : "/futurestar/manage_school.jsp",
	classmgmt    : "/futurestar/classmgmt.html"
};
var g_waplogin_do_url = {
	"login"     : "/futurestar/waplogin.do?action=login",
	"getstatus" : "/futurestar/waplogin.do?action=getstatus"
};

var g_manageclass_do_url = {
	"select" : "/futurestar/classmgmt.do?action=select",
	"create" : "/futurestar/classmgmt.do?action=create"
};

var g_setfrompage_do_url = "/futurestar/setfrompage.do";

function htmlEncode(value) {
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value) {
  return $('<div/>').html(value).text();
}

function generateNaviMenu() {
	var uiMenu = "";
	uiMenu += '<span style="background-color:lightgray; display:block; font-size:20px; font-weight:bold; padding:5px 0px 5px 5px;">功能菜单</span>';
	uiMenu += '<ul>';
	uiMenu += '  <li><a href="manage_school.jsp">学校管理</a></li>';
	uiMenu += '  <li><a href="manage_teacher.jsp">教师管理</a></li>';
	uiMenu += '  <li><a href="manage_parent.jsp">家长管理</a></li>';
	uiMenu += '  <li><a href="childmgmt.html">学生管理</a></li>';
	uiMenu += '</ul>';
	return uiMenu;
}
