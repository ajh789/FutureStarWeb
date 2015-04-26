window.onload = onPageLoad;

// var g_user = null; // Moved to common.js

var ChildMgmt = {}; // Name space of child management.
ChildMgmt.classes = {};
ChildMgmt.classes.data = null; // Array of schools.
ChildMgmt.classes.head = null; // Time stamp of creation for head in school array.
ChildMgmt.classes.tail = null; // Time stamp of creation for tail in school array.
ChildMgmt.classes.curpos = -1; // Position of currently visiting school.

ChildMgmt.numPerPage = 5; // Records per page.

function onPageLoad() {
	ChildMgmt.getLoginInfo();

	// Generate navigation menu.
	var uiMenu = Common.generateNaviMenu();
	$(uiMenu).appendTo('#menu');

//	reqClassList();
}

function redirectToSchoolManagement() {
	window.location.href = g_webpages_url.manageschool; // Redirect to page school management.
}

ChildMgmt.getLoginInfo = function() {
	$.get(g_waplogin_do_url.getstatus, Common.handleLoginResponse);
};

function redirectToLoginPage() {
	window.location.href = g_webpages_url.login;
}
/* Moved to common.js
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
		g_user = null;
		console.log("INFO: Not login or sesseion timeouts.");
		console.log("INFO: Redirect to login page.");
//		var uiLogin = "<a href='";
//		uiLogin += g_webpages_url.login;
//		uiLogin += "'>点击登录</a>";
		var uiLogin = "<input type='button' value='点击登录' onclick='onButtonLogin()' />";
		$("#span_user_info").html(uiLogin);
	}
}
*/
function getPageParams() {
	var url = window.location.href;
	var len = url.length;
	var offset = url.indexOf("?");
	var paramsString = url.substring(offset+1, len);
	console.log("Params string is " + paramsString);
	var params = paramsString.split("&");
	return params; // Array
}

function onChangeNumPerPage() {
//	var objNumPerPage = $("#text_num_per_page"); // Why doesn't this work?
	var objNumPerPage = document.getElementById("text_num_per_page");
//	console.log(objNumPerPage.options[objNumPerPage.selectedIndex].value);
	g_numPerPage = objNumPerPage.options[objNumPerPage.selectedIndex].value;

}

function reqClassList() {
	var url = g_manageclass_do_url.select + "&schoolid=" + g_schoolid + "&range=" + g_numPerPage;

	var classname = $("#text_classname").prop("value");
	if (classname != "") {
		url += "&name=" + classname;
	} else {
		console.log("Class name is null.");
	}

	$.get(url, handleClassSelectResponse);
}

function reqClassListPageDown() {
	var url = g_manageclass_do_url.select + "&schoolid=" + g_schoolid + "&range=" + g_numPerPage;

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
	var url = g_manageclass_do_url.select + "&schoolid=" + g_schoolid + "&range=" + g_numPerPage;

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
//	var frompage = g_webpages_url.childmgmt;
//	var url = g_setfrompage_do_url + "?frompage=" + encodeURIComponent(frompage);
//	console.log(url);
//	$.get(url, null); // No response function.
//	redirectToLoginPage();
	Common.promptLoginDialog();
}

ChildMgmt.onButtonAddChild = function() {
	var uiDialog = "";
	uiDialog += "<div id='dialog_child_add' title='添加学生' style='overflow:auto;'>";
	uiDialog += "<span class='span_font_red_bold'>&nbsp;*&nbsp;</span>必填项";
	uiDialog += "<table id='table_child_add'>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>身份证号<span class='span_font_red_bold'>&nbsp;*</span></td>";
	uiDialog += "    <td><input type='text' id='child_add_text_id_num' value='' /></td>";
	uiDialog += "    <td><span id='child_add_label_id_num'></span></td>"; // Label to show reminder messages.
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>姓名<span class='span_font_red_bold'>&nbsp;*</span></td>";
	uiDialog += "    <td><input type='text' id='child_add_text_name' value='' /></td>";
	uiDialog += "    <td><span id='child_add_label_name'></span></td>";
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>性别<span class='span_font_red_bold'>&nbsp;*</span></td>";
	uiDialog += "    <td><input type='radio' id='child_add_gender_male' name='gender' value='0' checked='checked' />男";
	uiDialog += "        <input type='radio' id='child_add_gender_male' name='gender' value='1' />女</td>";
	uiDialog += "    <td><span id='child_add_label_gender'></span></td>";
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>照片</td>";
	uiDialog += "    <td><image src='images/students/default.png' alt='头像' class='img_user_avatar' /><br/>";
	uiDialog += "        <input type='file' id='child_add_file_avatar' class='filestyle' data-buttonText='选择...' /><br/>";
	uiDialog += "        <input type='button' id='child_add_button_avatar' value='上传' onclick='onButtonChooseAvatar()'/></td>";
	uiDialog += "    <td></td>";
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>出生日期<span class='span_font_red_bold'>&nbsp;*</span></td>";
	uiDialog += "    <td><input type='text' id='child_add_text_birthday' value='' /></td>";
	uiDialog += "    <td><span id='child_add_label_birthday'>格式：yyyy/mm/dd，例如：2008/10/08</span></td>";
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>父母信息</td>";
	uiDialog += "    <td>父：<input type='text' id='child_add_text_parent_dad' value='' /><br/>";
	uiDialog += "        母：<input type='text' id='child_add_text_parent_mom' value='' /></td>";
	uiDialog += "    <td><span id='child_add_label_parents'></span></td>";
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>所属学校<span class='span_font_red_bold'>&nbsp;*</span></td>";
	uiDialog += "    <td><input type='text' id='child_add_text_school' value='' /></td>";
	uiDialog += "    <td><span id='child_add_label_school'></span></td>";
	uiDialog += "  </tr>";
	uiDialog += "  <tr>";
	uiDialog += "    <td>所属班级</td>";
	uiDialog += "    <td><input type='text' id='child_add_text_class' value='' /></td>";
	uiDialog += "    <td><span id='child_add_label_class'></span></td>";
	uiDialog += "  </tr>";
	uiDialog += "</table>";
	uiDialog += "</div>";
	$(uiDialog).appendTo('body');
	$("#child_add_text_birthday").datepicker({
		changeYear         : true,
		changeMonth        : true,
		showMonthAfterYear : true,
		dateFormat         : "yy/mm/dd",
//		dayNames           : ["日", "一", "二", "三", "四", "五", "六"],
		dayNamesMin        : ["日", "一", "二", "三", "四", "五", "六"],
		monthNamesShort    : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ]
	});
	$("#dialog_child_add").dialog({
		modal : true,
		minWidth : 700,
		minHeight : 200,
		buttons : [
			{
				text : "创建",
				click : function() {
					ChildMgmt.onButtonCommitAddChild(g_schoolid);
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
};

function onButtonChooseAvatar() {
//	$('#child_add_file_avatar').trigger('click');
}

function onButtonUploadAvatar() {
	
}

ChildMgmt.onButtonCommitAddChild = function(schoolid) {
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
};

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
			$("#dialog_child_add").dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
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
