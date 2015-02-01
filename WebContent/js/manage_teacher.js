document.getElementByIdx_x = function(id) {
	if (typeof id == 'string') {
		return document.getElementById(id);
	} else {
		throw new error('Please pass a string as an ID!');
	}
};

var g_manageteacher_url = "/futurestar/manageteacher.do?reqfrom=wap";
var g_manageteacher_select_url = g_manageteacher_url + "&action=select";
var g_manageteacher_insert_url = g_manageteacher_url + "&action=insert";
var g_manageteacher_update_url = g_manageteacher_url + "&action=update";
var g_manageteacher_delete_url = g_manageteacher_url + "&action=delete";

var g_teachers = null; // Array of schools.
var g_teachers_head = null; // Current head.
var g_teachers_tail = null; // Current tail.
var g_privilege = 0;

function reqData()
{
	var url = g_manageteacher_select_url;

	var name = $("#text_teacher_name").val();
	if (name != "") {
		url += "&name=" + name;
	}

	var mobilenum = $("#text_teacher_mobilenum").val();
	if (mobilenum != "") {
		url += "&mobilenum=" + mobilenum;
	}

	var schoolname = $("#text_teacher_schoolname").val();
	if (schoolname != "") {
		url += "&schoolname=" + schoolname;
	}

	$.get(url, handleSelectResponse);
}

function reqDataUp()
{
	var url = g_manageteacher_select_url;

	if (g_teachers_head != null) {
		url += "&baseid=" + g_teachers_head + "&goes=up";
	}

	var name = $("#text_teacher_name").val();
	if (name != "") {
		url += "&name=" + name;
	}

	var mobilenum = $("#text_teacher_mobilenum").val();
	if (mobilenum != "") {
		url += "&mobilenum=" + mobilenum;
	}

	var schoolname = $("#text_teacher_schoolname").val();
	if (schoolname != "") {
		url += "&schoolname=" + schoolname;
	}

	$.get(url, handleSelectResponse);
}

function reqDataDown()
{
	var url = g_manageteacher_select_url;

	if (g_teachers_tail != null) {
		url += "&baseid=" + g_teachers_tail;
	}

	var name = $("#text_teacher_name").val();
	if (name != "") {
		url += "&name=" + name;
	}

	var mobilenum = $("#text_teacher_mobilenum").val();
	if (mobilenum != "") {
		url += "&mobilenum=" + mobilenum;
	}

	var schoolname = $("#text_teacher_schoolname").val();
	if (schoolname != "") {
		url += "&schoolname=" + schoolname;
	}

	$.get(url, handleSelectResponse);
}

function reqDataFromTo()
{
	var url = g_manageteacher_select_url + "&mode=1";

	if (g_teachers_head != null)
		url += "&fromid=" + g_teachers_head;

	if (g_teachers_tail != null)
		url += "&toid=" + g_teachers_tail;

	$.get(url, handleSelectResponse);
}

function handleSelectResponse(data, status) {
	var tmp = "";
	var debug = "";

	if (status == "success") { // 200 OK
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		// Five members: retcode, retinfo, actionx, teachers, privilege
		if (ret.retcode == 0) { // OK
			g_privilege = ret.privilege;
			var teachers = ret.teachers; // Array of schools.
			if (teachers.length > 0) {
				g_teachers = new Array(); // Allocate a new array.
				g_teachers = g_teachers.concat(teachers);
				g_teachers_head = teachers[0].CREATION;
				g_teachers_tail = teachers[teachers.length-1].CREATION;
				tmp += generateTableOfTeachers();
				setSpanContentInnerHTML(tmp);
//				hideButtonReqData();
				showButtonReqDataUp();
				showButtonReqDataDown();
			} else {
				debug += "没有更多数据可加载！";
			}
		} else {
			g_privilege = 0;
			debug += ret.retinfo;
		}
	} else {
		debug += data;
	}

	if (debug != "") {
		showSpanDebugMsg(); // Show
		setSpanDebugMsgInnerHTML(debug);
	} else {
		hideSpanDebugMsg(); // Hide
	}
}

function handleUpdateResponse(data, status) {
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}
//		window.alert(ret.retcode + ": " + ret.retinfo);
		if (ret.retcode == 0) {
			// Trigger a query
			reqDataFromTo();
		}
	}
}

function generateTableOfTeachers() {
	var html = "";

	if (g_teachers.length > 0) {
		html += "<table id='teachers'";
		html += "<tr>";
		html += "<th>照&nbsp;片</th>"; // Column 1
		html += "<th>信&nbsp;息</th>"; // Column 2
		html += "<th>操&nbsp;作</th>"; // Column 3
		html += "</tr>";
	}

	for (var i=0; i<g_teachers.length; i++) {
		html += "<tr>"; // Row stars.
		// Column 1
		if (g_teachers[i].LOGO != "" && g_teachers[i].LOGO != "null") {
			html += "<td><img src='" + g_teachers[i].LOGO +"' alt='logo' class='img_teacher_logo' /></td>";
		} else {
			html += "<td>" + g_teachers[i].LOGO + "</td>";
		}
		// Column 2
		html += "<td id='teacher_details'>";
		html += "<b>" + g_teachers[i].NAME + "</b>(" + g_teachers[i].MOBILENUM + ")<br/>";
		html += "注册时间：" + g_teachers[i].CREATION + "<br/>";
		html += "上次登录：" + g_teachers[i].LASTLOGIN + "<br/>";
		html += "所属学校：" + g_teachers[i].SCHOOL_NAME;
		html += "</td>";
		// Column 3
		html += "<td>";
		if (g_privilege & 0x4)
			html += "<input type='button' value='删除' onclick='onButtonDeleteTeacher()' />&nbsp;";
		if (g_privilege & 0x2)
			html += "<input type='button' value='修改' onclick='onButtonEditTeacher(\"" + g_teachers[i].ID +"\")' />";
		html += "</td>";
		html += "</tr>"; // Row ends.
	}

	if (g_teachers.length > 0) {
		html += "</table>";
	}

	return html;
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

function hideSpanDebugMsg() {
	$("#span_debugmsg").hide();
}

function showSpanDebugMsg() {
	$("#span_debugmsg").show();
}

function setSpanDebugMsgInnerHTML(innerHTML) {
	$("#span_debugmsg").html(innerHTML);
}

function setSpanContentInnerHTML(innerHTML) {
	$("#span_content").html(innerHTML);
}

function onButtonEditTeacher(id) {
	if (typeof id == 'string') {
		var found = false;
		var teacher = null;
		for (var i=0; i<g_teachers.length; i++) {
			if (g_teachers[i].ID == id) {
				found = true;
				teacher = g_teachers[i];
				break;
			}
		}
		if (found) {
			hideSpanDebugMsg();
			generateEditTeacherHtml(teacher);
		}
	} else {
		throw new error('Please pass a string as an ID!');
	}
}

function onButtonDeleteTeacher()
{
	window.alert("暂不支持删除操作！");
}

function generateEditTeacherHtml(teacher)
{
	var html = "";
	html += "<table class='table_teacher_edit'>";
	html += "  <tr>";
	html += "    <td>照片：</td>";
	html += "    <td><img id='teacher_edit_logo' src='' alt='logo' class='img_school_logo' /></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>姓名：</td>";
	html += "    <td>";
	html += "      <input id='teacher_edit_id' type='hidden' name='id' value='' />";
	html += "      <input id='teacher_edit_name' type='text' name='name' value=''/>";
	html += "    </td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>性别：</td>";
	html += "    <td>";
	html += "      <input id='teacher_edit_gender_male'  type='radio' name='gender' value='male' />男";
	html += "      <input id='teacher_edit_gender_female' type='radio' name='gender' value='female' />女";
	html += "    </td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "  <tr>";
	html += "    <td>手机号码：</td>";
	html += "    <td><input id='teacher_edit_mobilenum' type='text' name='mobilenum' value=''/></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>注册时间：</td>";
	html += "    <td><span id='teacher_edit_creation'></span></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>当前状态：</td>";
	html += "    <td>";
	html += "      <input id='teacher_edit_islocked_true'  type='radio' name='islocked' value='true' />锁定";
	html += "      <input id='teacher_edit_islocked_false' type='radio' name='islocked' value='false' />未锁定";
	html += "    </td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>所属学校：</td>";
	html += "    <td>";
	html += "      <input id='teacher_edit_schoolname' type='text' name='schoolname' value='' disabled />&nbsp;";
	html += "      <input id='teacher_edit_schoolid' type='hidden' name='schoolid' value='' />";
	html += "      <input type='button' value='更改...' onclick='onButtonGetSchoolList()'/>";
	html += "    </td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>所属班级：</td>";
	html += "    <td>";
	html += "      <intput id='teacher_edit_classname' type='text' value='' disabled />";
	html += "      <intput id='teacher_edit_classid' type='hidden' value='' />";
	html += "    </td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>&nbsp;&nbsp;</td>";
	html += "    <td>";
	html += "      <input type='button' value='更新' onclick='onButtonCommitEditTeacher()' />";
	html += "      <input type='button' value='取消' onclick='onButtonCancelEditTeacher()' />";
	html += "    </td>";
	html += "  </tr>";
	html += "</table>";
	setSpanContentInnerHTML(html);
	$("#teacher_edit_id").prop("value", teacher.ID);
	$("#teacher_edit_logo").prop("src", teacher.LOGO);
	$("#teacher_edit_name").prop("value", teacher.NAME);
	$("#teacher_edit_gender_male").prop("checked", (teacher.GENDER == 0));
	$("#teacher_edit_gender_female").prop("checked", (teacher.GENDER != 0));
	$("#teacher_edit_mobilenum").prop("value", teacher.MOBILENUM);
	$("#teacher_edit_creation").html(teacher.CREATION);
	$("#teacher_edit_islocked_true").prop("checked", (teacher.ISLOCKED != 0));
	$("#teacher_edit_islocked_false").prop("checked", (teacher.ISLOCKED == 0));
	$("#teacher_edit_schoolname").prop("value", teacher.SCHOOL_NAME);
	$("#teacher_edit_schoolid").prop("value", teacher.SCHOOL_ID);
	$("#teacher_edit_classname").prop("value", teacher.CLASS_NAME);
}

function onButtonCommitEditTeacher() {
	var id = $("#teacher_edit_id").val();
	var name = $("#teacher_edit_name").html();
	var intro = $("#teacher_edit_intro").val();
	intro = htmlEncode(intro); // Remember to do html encode.
	$.post(
		g_manageteacher_update_url, 
		{"id":id, "name":name, "intro":intro}, 
		handleUpdateResponse
	);
}

function onButtonCancelEditTeacher() {
	var tmp = generateTableOfTeachers();
	setSpanContentInnerHTML(tmp);
}

function onButtonGetSchoolList() {
	var dialoghtml = "";
	dialoghtml += "<div id='dialog_school_list' title='学校列表'>";
	dialoghtml += "  <label for='text_school_list_input'>学校名称: </label>";
	dialoghtml += "  <input id='text_school_list_input' value='' /><br/><br/>"; // input field
	dialoghtml += "  <input id='text_school_list_output_id' type='hidden' value='' disabled />"; // selected id
	dialoghtml += "  <label for='text_school_list_output_name'>已选学校: </label>";
	dialoghtml += "  <input id='text_school_list_output_name' type='text' value='' disabled />"; // selected name
	dialoghtml += "</div>";
	$(dialoghtml).appendTo('body');

	$("#dialog_school_list").css("display", "true");
	$("#dialog_school_list").dialog(
		{
			modal : true,
			minWidth : 450,
			minHeight : 300,
			buttons : [
				{
					text: "清除所选",
//					icons: {primary: "ui-icon-heart"},
					click: function() {
						$("#text_school_list_output_id").prop("value", "");
						$("#text_school_list_output_name").prop("value", "");
					}
				},
				{
					text: "确定",
//					icons: {primary: "ui-icon-heart"},
					click: function() {
						var schoolid = $("#text_school_list_output_id").prop("value");
						var schoolname = $("#text_school_list_output_name").prop("value");
						if (schoolid != "" && schoolname != "") {
							$("#teacher_edit_schoolid").prop("value", schoolid);
							$("#teacher_edit_schoolname").prop("value", schoolname);
						}
						$(this).dialog("close");
					}
				}
			]
		}
	);

	$("#text_school_list_input").autocomplete({
		source : function(req, rsp) {
			$.ajax({
				url : "/futurestar/getschools.do",
				dataType : "json",
				data : {term: req.term},
				success : function(data) {
					rsp($.map(data, function(item) {
						return {
							id : item.ID,
							name : item.NAME,
							label : item.NAME // A 'label' and/or 'value' field is used to display suggestion list.
						};
					}));
				}
			});
		}, 
		appendTo : "#dialog_school_list",
		select : function(event, ui) {
			$("#text_school_list_output_id").prop("value", ui.item.id);
			$("#text_school_list_output_name").prop("value", ui.item.name);
		}
	});
}
