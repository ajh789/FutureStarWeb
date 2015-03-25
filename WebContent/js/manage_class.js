window.onload = onPageLoad;

var g_schoolid = null;
var g_user = null;

function onPageLoad() {
	g_schoolid = getParamSchoolId();
	if (g_schoolid == "") {
		alert('学校ID为空，请从"学校管理"页面进入。');
		redirectToSchoolManagement();
	}

	getLoginInfo();
}

function redirectToSchoolManagement() {
	window.location.href = g_webpages_url.manageschool; // Redirect to page school management.
}

function getLoginInfo() {
	$.get(g_waplogin_do_url.getstatus, handleLoginResponse);
}

function redirecToLoginPage() {
	window.location.href = g_webpages_url.login;
}

function handleLoginResponse(data, status) {
	var ret = null;
	if (status == "success") { // 200 OK
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}
	} else {
		console.log("ERR: Get login info failed.");
		console.log("ERR: Redirect to login page.");
		alert("Exception 1");
		redirecToLoginPage();
		return;
	}

	if (ret.retcode == RetCode.RETCODE_OK) {
		g_user = ret.curuser;
		var uiUserInfo = "";
		uiUserInfo += g_user.name;
		uiUserInfo += '(';
		uiUserInfo += g_user.role;
		uiUserInfo += ')';
		$("#span_user_info").html(uiUserInfo);
	} else {
		console.log("INFO: Not login or sesseion timeouts.");
		console.log("INFO: Redirect to login page.");
		alert("Exception 2");
		redirecToLoginPage();
	}
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