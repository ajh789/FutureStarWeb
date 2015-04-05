window.onload = onPageLoad;

var g_schoolid = null;
var g_user = null;

var g_classes = {};
g_classes.data = null; // Array of schools.
g_classes.head = null; // Time stamp of creation for head in school array.
g_classes.tail = null; // Time stamp of creation for tail in school array.
g_classes.curpos = -1; // Position of currently visiting school.

function onPageLoad() {
	g_schoolid = getParamSchoolId();
	if (g_schoolid == "") {
		alert('学校ID为空，请从"学校管理"页面进入。');
		redirectToSchoolManagement();
	}

	getLoginInfo();

	reqClassList();
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

	var classname = $("#text_classname").prop("value");
	if (classname != "") {
		url += "&name=" + classname;
	} else {
		console.log("Class name is null.");
	}

	$.get(url, handleClassSelectResponse);
}

function reqClassListPageDown() {
	var url = g_manageclass_do_url.select + "&schoolid=" + g_schoolid;

	if (g_classes.tail != null) {
		url += "&baseid=" + g_classes.tail;
	}

	var classname = $("#text_classname").prop("value");
	if (classname != "") {
		url += "&name=" + classname;
	}

	$.get(url, handleClassSelectResponse);
}

function reqClassListPageUp() {
	var url = g_manageclass_do_url.select + "&schoolid=" + g_schoolid;

	if (g_classes.head != null) {
		url += "&baseid=" + g_classes.head + "&goes=up";
	}

	var classname = $("#text_classname").prop("value");
	if (classname != "") {
		url += "&name=" + classname;
	}

	$.get(url, handleClassSelectResponse);
}

function handleClassSelectResponse(data, status) {
	var debug = "";
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		if (ret.retcode == RetCode.RETCODE_OK) {
			g_user = ret.curuser;
			var classes = ret.retobjx.classes; // Array of classes.
			if (classes.length > 0) {
				g_classes.data = new Array(); // Allocate a new array.
				g_classes.data = g_classes.data.concat(classes);
				g_classes.head = classes[0].CREATION;
				g_classes.tail = classes[classes.length-1].CREATION;
				generateClassListUI();
				showButtonReqDataUpAndDown();
			} else {
				debug += "没有更多数据可加载！";
			}
		} else {
			var ui = "<font style='color:red; font-size:32px; font-weight:bold;'>";
			ui += ret.retinfo;
			ui += "</font>";
			setContentBodyInnerHTML(ui);
		}
	}

	if (debug != "") {
		showDebugMsg(); // Show
		setDebugMsgInnerHTML(debug);
	} else {
		hideDebugMsg(); // Hide
	}
}

// Generate UI(a list of classes) for a successful query.
function generateClassListUI() {
	var classes = g_classes.data; // Array of classes.
	var ui = "";
	ui += "<div id='dialog_classlist' title='班级列表'>";
	ui += "</div>";

	$(ui).appendTo('#content_body');
	if (classes.length == 0) {
		$("#dialog_classlist").html("<b>班级列表为空！</b>");
	} else {
		var table = "";
		table += "<table id='classlist'>";
		table += "  <tr><th>ID</th><th>班级名称</th><th>入学时间</th><th>注册时间</th><th>操作</th></tr>";
		for (var i=0; i<classes.length; i++) {
			table += "<tr>";
			table += "<td>" + classes[i].ID + "</td>";
			table += "<td>" + classes[i].NAME + "</td>";
			table += "<td>" + classes[i].ENROLLMENT + "</td>";
			table += "<td>" + classes[i].CREATION + "</td>";
			table += "<td>";
			table += "  <input type='button' value='修改' onclick='onButtonEditClass(\"" + g_schoolid + '","' + classes[i].ID + "\")' />&nbsp;";
			table += "  <input type='button' value='删除' onclick='' />&nbsp;";
			table += "  <input type='button' value='查看成员' onclick='' />";
			table += "</td>";
			table += "</tr>";
		}
		table += "</table>";
		$("#dialog_classlist").html(table);
	}
}

function onButtonLogin() {
	var frompage = g_webpages_url.classmgmt + "?schoolid=" + g_schoolid;
	var url = g_setfrompage_do_url + "?frompage=" + encodeURIComponent(frompage);
	console.log(url);
	$.get(url, null); // No response function.
	redirectToLoginPage();
}

function onButtonCreateClass() {
	var uiDialog = "";
	uiDialog += "<div id='dialog_class_creation' title='班级创建'>";
	uiDialog += "  班级名称：<input type='text' id='class_creation_text_name' value=''>";
	uiDialog += "            <span id='class_creation_label_name'></span><br>";
	uiDialog += "  入学年月：<input type='text' id='class_creation_text_enrollment' value=''>";
	uiDialog += "            <span id='class_creation_label_enrollment'></span>";
	uiDialog += "</div>";
	$(uiDialog).appendTo('body');
	$("#class_creation_text_enrollment").datepicker({
		changeYear         : true,
		changeMonth        : true,
		showMonthAfterYear : true,
		dateFormat         : "yy/mm/dd",
//		dayNames           : ["日", "一", "二", "三", "四", "五", "六"],
		dayNamesMin        : ["日", "一", "二", "三", "四", "五", "六"],
		monthNamesShort    : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ]
	});
	$("#dialog_class_creation").dialog({
		modal : true,
		minWidth : 400,
		minHeight : 200,
		buttons : [
			{
				text : "创建",
				click : function() {
					onButtonCommitCreateClass(g_schoolid);
				}
			},
			{
				text : "取消",
				click : function() {
					$(this).dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
				}
			}
		]
	});
}

function onButtonCommitCreateClass(schoolid) {
	var name = $("#class_creation_text_name").prop("value");
	var enrollment = $("#class_creation_text_enrollment").prop("value");
	var ok = true;

	if (name === "") {
		ok = false;
		$("#class_creation_label_name").html("<font color='red'>不能为空！</font>");
	}

	if (enrollment === "") {
		ok = false;
		$("#class_creation_label_enrollment").html("<font color='red'>不能为空！</font>");
	}

	if (ok == false) {
		return;
	}

	var url = g_manageclass_do_url.create + "&schoolid=" + schoolid + "&name=" + name + "&enrollment=" + enrollment;
	$.get(url, handleClassCreateResponse);
}

function handleClassCreateResponse(data, status) {
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		if (ret.retcode == RetCode.RETCODE_OK) {
			window.alert("创建成功！");
			$("#dialog_class_creation").dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
		} else {
			window.alert("错误: " + ret.retinfo);
		}
	}
}

function onButtonEditClass(schoolid, classid) {
	console.log("schoolid is " + schoolid);
	console.log("classid is " + classid);
}

function onButtonDeleteClass(schoolid, classid) {
	
}

function hideButtonReqData() {
	$("#button_reqdata").hide();
}

function showButtonReqDataUp() {
	$("#button_reqdata_up").show();
}

function showButtonReqDataDown() {
	$("#button_reqdata_down").show();
}

function showButtonReqDataUpAndDown() {
	showButtonReqDataUp();
	showButtonReqDataDown();
}

function hideDebugMsg() {
	$("#span_debugmsg").hide();
}

function showDebugMsg() {
	$("#span_debugmsg").show();
}

function setDebugMsgInnerHTML(innerHTML) {
	$("#span_debugmsg").html(innerHTML);
}

function setContentBodyInnerHTML(innerHTML) {
	$("#content_body").html(innerHTML);
}

function clearContentBodyInnerHTML() {
	$("#content_body").html("");
}
