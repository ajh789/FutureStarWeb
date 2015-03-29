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

function redirectToLoginPage() {
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
//		redirectToLoginPage();
		return;
	}

	if (ret.retcode == RetCode.RETCODE_OK) {
		g_user = ret.curuser;
		var uiUserInfo = "<a href='#'>";
		uiUserInfo += g_user.name;
		uiUserInfo += '(';
		uiUserInfo += g_user.role;
		uiUserInfo += ')</a>';
		$("#span_user_info").html(uiUserInfo);
	} else {
		console.log("INFO: Not login or sesseion timeouts.");
		console.log("INFO: Redirect to login page.");
//		var uiLogin = "<a href='";
//		uiLogin += g_webpages_url.login;
//		uiLogin += "'>点击登录</a>";
		var uiLogin = "<input type='button' value='点击登录' onclick='onButtonLogin()' />";
		$("#span_user_info").html(uiLogin);
	}
}

function getPageParams() {
	var url = window.location.href;
	var len = url.length;
	var offset = url.indexOf("?");
	var paramsString = url.substring(offset+1, len);
	console.log("Params string is " + paramsString);
	var params = paramsString.split("&");
	return params; // Array
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
			return value; // string
		}
	}
	
	return "";
}

function reqClassList() {
	var url = g_manageclass_do_url.select + "&schoolid=" + g_schoolid;
	$.get(url, handleClassSelectResponse);
}

function handleClassSelectResponse(data, status) {
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		if (ret.retcode == RetCode.RETCODE_OK) {
			generateClassListUI(ret);
		} else {
			window.alert("Error: " + ret.retinfo);
		}
	}
}

// Generate UI(a list of classes) for a successful query.
function generateClassListUI(ret) {
	var schoolid = ret.retobjx.schoolid;
	var classes = ret.retobjx.classes; // Array of classes.
	var ui = "";
	ui += "<div id='dialog_class_list' title='班级列表'>";
	ui += "</div>";

	$(ui).appendTo('#span_content');
	if (classes.length == 0) {
		$("#dialog_class_list").html("班级列表为空！");
	} else {
		var table = "";
		table += "<table border='1'>";
		table += "  <tr><th>ID</th><th>Name</th><th>Enrollment</th><th>Creation</th></tr>";
		for (var i=0; i<classes.length; i++) {
			table += "<tr>";
			table += "<td>" + classes[i].ID + "</td>";
			table += "<td>" + classes[i].NAME + "</td>";
			table += "<td>" + classes[i].ENROLLMENT + "</td>";
			table += "<td>" + classes[i].CREATION + "</td>";
			table += "</tr>";
		}
		table += "</table>";
		$("#dialog_class_list").html(table);
	}

//	$("#dialog_class_list").dialog({
//		modal : true,
//		minWidth : 500,
//		minHeight : 200,
//		buttons : [
//			{
//				text : "创建新班级",
//				click : function() {
//					onButtonCreateClass(schoolid);
//				}
//			},
//			{
//				text : "取消",
//				click : function() {
//					$(this).dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
//				}
//			}
//		]
//	});
}

function onButtonLogin() {
	var frompage = g_webpages_url.manageclass + "?schoolid=" + g_schoolid;
	var url = g_setfrompage_do_url + "?frompage=" + encodeURIComponent(frompage);
	console.log(url);
	$.get(url, null); // No response function.
	redirectToLoginPage();
}