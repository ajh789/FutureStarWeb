window.onload = onPageLoad;

var g_schoolid = null;
var g_manageschool_page_url = "/futurestar/manage_school.jsp";

function onPageLoad() {
	g_schoolid = getParamSchoolId();
	if (g_schoolid == "") {
		alert('学校ID为空，请从"学校管理"页面进入。');
		window.location.href = g_manageschool_page_url; // Redirect to page school management.
	}
}

function getLoginInfo() {
	//
}

function getPageParams() {
	var url = window.location.href;
	var len = url.length;
	var offset = url.indexOf("?");
	var paramsString = url.substring(offset+1, len);
	console.log("Params string is " + paramsString);
	var params = paramsString.split("&");
	return params;
}

/**
 * function getParamSchoolId()
 * @param   {Null}
 * @returns {String} school id
*/
function getParamSchoolId() {
	var params = getPageParams();
	for (var i=0; i<params.length; i++) {
		var pairs = params[i].split("=");
		var key = pairs[0];
		var value = pairs[1];
		if (key == "schoolid") {
			return value;
		}
	}
	
	return "";
}