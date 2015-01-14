document.getElementByIdx_x = function(id) {
	if (typeof id == 'string') {
		return document.getElementById(id);
	} else {
		throw new error('Please pass a string as an ID!');
	}
};

var g_manageschool_url = "/futurestar/manageschool?reqfrom=wap";
var g_manageschool_select_url = g_manageschool_url + "&action=select";
var g_manageschool_insert_url = g_manageschool_url + "&action=insert";
var g_manageschool_update_url = g_manageschool_url + "&action=update";
var g_manageschool_delete_url = g_manageschool_url + "&action=delete";

var g_schools = null; // Array of schools.
var g_schools_head = null;
var g_schools_tail = null;
var g_privilege = 0;

function reqData()
{
	var url = g_manageschool_select_url;

//	if (g_schools_tail != null) {
//		url += "&baseid=" + g_schools_tail;
//	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	$.get(url, handleSelectResponse);
}

function reqDataUp()
{
	var url = g_manageschool_select_url;

	if (g_schools_head != null) {
		url += "&baseid=" + g_schools_head + "&goes=up";
	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	$.get(url, handleSelectResponse);
}

function reqDataDown()
{
	var url = g_manageschool_select_url;

	if (g_schools_tail != null) {
		url += "&baseid=" + g_schools_tail;
	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

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

		// Five members: retcode, retinfo, actionx, schools, prvlege
		if (ret.retcode == 0) { // OK
			g_privilege = ret.prvlege;
			var schools = ret.schools; // Array of schools.
			if (schools.length > 0) {
				g_schools = new Array(); // Allocate a new array.
				g_schools = g_schools.concat(schools);
				g_schools_head = schools[0].CREATION;
				g_schools_tail = schools[schools.length-1].CREATION;
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
		window.alert(ret.retcode + ret.retinfo);
	}
}

function generateTableOfSchools() {
	var html = "";

	if (g_schools.length > 0) {
		html += "<table id='schools' border='1'>";
		html += "<tr>";
		html += "<th>&nbsp;</th>";       // Column 1
		html += "<th>学校</th>"; // Column 2
		html += "<th>操作</th>";     // Column 3
		html += "</tr>";
	}

	for (var i=0; i<g_schools.length; i++) {
		html += "<tr>"; // Row stars.
		// Column 1
		if (g_schools[i].LOGO != "" && g_schools[i].LOGO != "null") {
			html += "<td><img src='" + g_schools[i].LOGO +"' alt='logo' class='img_school_logo' /></td>";
		} else {
			html += "<td>" + g_schools[i].LOGO + "</td>";
		}
		// Column 2
		html += "<td><b>" + g_schools[i].NAME + "</b>(" + g_schools[i].ID + ")<br/>" + g_schools[i].CREATION +"<br/>" + g_schools[i].INTRO + "</td>";
		// Column 3
		html += "<td>";
		if (g_privilege & 0x4)
			html += "<input type='button' value='删除' />";
		if (g_privilege & 0x2)
			html += "<input type='button' value='修改' onclick='onButtonEditSchool(\"" + g_schools[i].ID +"\")' />";
		html += "</td>";
		html += "</tr>"; // Row ends.
	}

	if (g_schools.length > 0) {
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

function onButtonEditSchool(id) {
	if (typeof id == 'string') {
		var found = false;
		var school = null;
		for (var i=0; i<g_schools.length; i++) {
			if (g_schools[i].ID == id) {
				found = true;
				school = g_schools[i];
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
	$("#school_edit_intro").val(school.INTRO);
}

function onButtonCommitEditSchool() {
	var id = $("#school_edit_id").val();
	var name = $("#school_edit_name").html();
	var intro = $("#school_edit_intro").val();
	$.post(
		g_manageschool_update_url, 
		{"id":id, "name":name, "intro":intro}, 
		handleUpdateResponse
	);
}

function onButtonCancelEditSchool() {
	var tmp = generateTableOfSchools();
	setSpanContentInnerHTML(tmp);
}