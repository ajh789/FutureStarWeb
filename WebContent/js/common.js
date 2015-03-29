var g_manageschool_page_url = "/futurestar/manage_school.jsp";
var g_login_page_url = "/futurestar/login.jsp";
var g_webpages_url = {
	login        : "/futurestar/login.jsp",
	manageschool : "/futurestar/manage_school.jsp",
	manageclass  : "/futurestar/manage_class.html"
};
var g_waplogin_do_url = {
	"login"     : "/futurestar/waplogin.do?action=login",
	"getstatus" : "/futurestar/waplogin.do?action=getstatus"
};

var g_manageclass_do_url = {
	"select" : "/futurestar/manageclass.do?action=select",
	"create" : "/futurestar/manageclass.do?action=create"
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