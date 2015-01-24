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

//	if (g_schools_tail != null) {
//		url += "&baseid=" + g_schools_tail;
//	}

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

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	$.get(url, handleSelectResponse);
}

function reqDataDown()
{
	var url = g_manageteacher_select_url;

	if (g_teachers_tail != null) {
		url += "&baseid=" + g_teachers_tail;
	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
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
				tmp += generateTableOfSchools();
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

function generateTableOfSchools() {
	var html = "";

	if (g_teachers.length > 0) {
		html += "<table id='teachers' border='1'>";
		html += "<tr>";
		html += "<th>&nbsp;</th>";       // Column 1
		html += "<th>教师</th>"; // Column 2
		html += "<th>操作</th>";     // Column 3
		html += "</tr>";
	}

	for (var i=0; i<g_teachers.length; i++) {
		html += "<tr>"; // Row stars.
		// Column 1
		if (g_teachers[i].LOGO != "" && g_teachers[i].LOGO != "null") {
			html += "<td><img src='" + g_teachers[i].LOGO +"' alt='logo' class='img_school_logo' /></td>";
		} else {
			html += "<td>" + g_teachers[i].LOGO + "</td>";
		}
		// Column 2
		html += "<td id='teacher_details'>";
		html += "<b>" + g_teachers[i].NAME + "</b>(" + g_teachers[i].MOBILENUM + ")<br/>";
		html += "注册时间：" + g_teachers[i].CREATION + "<br/>";
		html += "上次登录：" + g_teachers[i].LASTLOGIN;
		html += "</td>";
		// Column 3
		html += "<td>";
		if (g_privilege & 0x4)
			html += "<input type='button' value='删除' onclick='onButtonDeleteTeacher()' />";
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
		var school = null;
		for (var i=0; i<g_teachers.length; i++) {
			if (g_teachers[i].ID == id) {
				found = true;
				school = g_teachers[i];
				break;
			}
		}
		if (found) {
			hideSpanDebugMsg();
			generateEditSchoolHtml(school);
		}
	} else {
		throw new error('Please pass a string as an ID!');
	}
}

function onButtonDeleteTeacher()
{
	window.alert("暂不支持删除操作！");
}

function generateEditSchoolHtml(school)
{
	var html = "";
	html += "<table class='table_school_edit'>";
	html += "  <tr>";
	html += "    <td>学校徽标：</td>";
	html += "    <td><img id='school_edit_logo' src='' alt='logo' class='img_school_logo' /></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>学校名称：</td>";
	html += "    <td><span id='school_edit_name'></span></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>注册时间：</td>";
	html += "    <td><span id='school_edit_creation'></span></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>更新时间：</td>";
	html += "    <td><span id='school_edit_lastupdate'></span></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>当前状态：</td>";
	html += "    <td>";
	html += "      <input id='school_edit_islocked_true'  type='radio' name='islocked' value='true' />锁定";
	html += "      <input id='school_edit_islocked_false' type='radio' name='islocked' value='false' />未锁定";
	html += "    </td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>学校介绍：</td>";
	html += "    <td><textarea id='school_edit_intro' rows='10' cols='80'></textarea></td>";
	html += "  </tr>";
	html += "  <tr>";
	html += "    <td>&nbsp;&nbsp;</td>";
	html += "    <td>";
	html += "      <input type='hidden' id='school_edit_id' name='id' value='' />";
	html += "      <input type='button' value='更新' onclick='onButtonCommitEditSchool()' />";
	html += "      <input type='button' value='取消' onclick='onButtonCancelEditSchool()' />";
	html += "    </td>";
	html += "  </tr>";
	html += "</table>";
	setSpanContentInnerHTML(html);
	$("#school_edit_id").val(school.ID);
	$("#school_edit_logo").attr("src", school.LOGO);
	$("#school_edit_name").html(school.NAME);
	$("#school_edit_creation").html(school.CREATION);
	$("#school_edit_lastupdate").html(school.LASTUPDATE);
	$("#school_edit_islocked_true").attr("checked", (school.ISLOCKED)?"checked":"");
	$("#school_edit_islocked_false").attr("checked", (!school.ISLOCKED)?"checked":"");
	$("#school_edit_intro").val(htmlDecode(school.INTRO)); // Remember to do html decode.
}

function onButtonCommitEditSchool() {
	var id = $("#school_edit_id").val();
	var name = $("#school_edit_name").html();
	var intro = $("#school_edit_intro").val();
	intro = htmlEncode(intro); // Remember to do html encode.
	$.post(
		g_manageteacher_update_url, 
		{"id":id, "name":name, "intro":intro}, 
		handleUpdateResponse
	);
}

function onButtonCancelEditSchool() {
	var tmp = generateTableOfSchools();
	setSpanContentInnerHTML(tmp);
}