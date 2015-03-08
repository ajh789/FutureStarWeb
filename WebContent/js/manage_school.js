document.getElementByIdx_x = function(id) {
	if (typeof id == 'string') {
		return document.getElementById(id);
	} else {
		throw new error('Please pass a string as an ID!');
	}
};

var g_manageschool_url = "/futurestar/manageschool.do?reqfrom=wap";
var g_manageschool_select_url = g_manageschool_url + "&action=select";
var g_manageschool_insert_url = g_manageschool_url + "&action=insert";
var g_manageschool_update_url = g_manageschool_url + "&action=update";
var g_manageschool_delete_url = g_manageschool_url + "&action=delete";

var g_schools = null; // Array of schools.
var g_schools_head = null; // Current head.
var g_schools_tail = null; // Current tail.
var g_privilege = 0;

var g_manageclasstables_url = "/futurestar/manageclasstables.do";
var g_manageclasstables_select_url = g_manageclasstables_url + "?action=select";
var g_manageclasstables_create_url = g_manageclasstables_url + "?action=create";

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

	$.get(url, handleSchoolSelectResponse);
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

	$.get(url, handleSchoolSelectResponse);
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

	$.get(url, handleSchoolSelectResponse);
}

function reqDataFromTo()
{
	var url = g_manageschool_select_url + "&mode=1";

	if (g_schools_head != null)
		url += "&fromid=" + g_schools_head;

	if (g_schools_tail != null)
		url += "&toid=" + g_schools_tail;

	$.get(url, handleSchoolSelectResponse);
}

function handleSchoolSelectResponse(data, status) {
	var tmp = "";
	var debug = "";

	if (status == "success") { // 200 OK
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		// Five members: 
		//   retcode -- see enum RetCode
		//   retinfo -- string
		//   actionx -- string of action
		//   retobjx -- JSON array of schools
		//   prvlege -- privilege of current user
		if (ret.retcode == RetCode.RETCODE_OK) { // OK
			g_privilege = ret.prvlege;
			var schools = ret.retobjx; // Array of schools.
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

function handleSchoolUpdateResponse(data, status) {
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}
//		window.alert(ret.retcode + ": " + ret.retinfo);
		if (ret.retcode == 0) {
			reqDataFromTo(); // Trigger a query
			$("#dialog_school_edit").dialog("destroy").remove(); // Destroy and remove dialog.
		}
	}
}

function generateTableOfSchools() {
	var html = "";

	if (g_schools.length > 0) {
		html += "<table id='schools' border='1'>";
		html += "<tr>";
		html += "<th>&nbsp;</th>";       // Column 1
		html += "<th>学&nbsp;校</th>"; // Column 2
		html += "<th>操&nbsp;作</th>";     // Column 3
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
		html += "<td id='school_details'><b>" + g_schools[i].NAME + "</b>(" + g_schools[i].ID + ")<br/>" + g_schools[i].CREATION +"<br/>" + g_schools[i].INTRO + "</td>";
		// Column 3
		html += "<td>";
		if (g_privilege & 0x4)
			html += "<input type='button' value='删除' onclick='onButtonDeleteSchool()' />&nbsp;";
		if (g_privilege & 0x2)
			html += "<input type='button' value='修改' onclick='onButtonEditSchool(\"" + g_schools[i].ID +"\")' />&nbsp;";
		if (g_privilege > 0)
			html += "<input type='button' value='班级列表' onclick='onButtonGetSchoolClassList(\"" + g_schools[i].ID + "\")' />";
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

function onButtonDeleteSchool()
{
	window.alert("暂不支持删除操作！");
}

function generateEditSchoolHtml(school)
{
	var dialoghtml = "";
	dialoghtml += "<div id='dialog_school_edit' title='学校编辑'>";
	dialoghtml += "<table class='table_school_edit'>";
//	dialoghtml += "  <caption>学校编辑</caption>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>学校徽标：</td>";
	dialoghtml += "    <td><img id='school_edit_logo' src='' alt='logo' class='img_school_logo' /></td>";
	dialoghtml += "  </tr>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>学校名称：</td>";
	dialoghtml += "    <td>";
	dialoghtml += "      <input type='text' id='school_edit_name' name='name' value='' disabled/>";
	dialoghtml += "      <input type='hidden' id='school_edit_id' name='id' value='' />";
	dialoghtml += "    </td>";
	dialoghtml += "  </tr>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>注册时间：</td>";
	dialoghtml += "    <td><span id='school_edit_creation'></span></td>";
	dialoghtml += "  </tr>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>更新时间：</td>";
	dialoghtml += "    <td><span id='school_edit_lastupdate'></span></td>";
	dialoghtml += "  </tr>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>当前状态：</td>";
	dialoghtml += "    <td>";
	dialoghtml += "      <input id='school_edit_islocked_true'  type='radio' name='islocked' value='true' />锁定";
	dialoghtml += "      <input id='school_edit_islocked_false' type='radio' name='islocked' value='false' />未锁定";
	dialoghtml += "    </td>";
	dialoghtml += "  </tr>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>学校介绍：</td>";
	dialoghtml += "    <td><textarea id='school_edit_intro' rows='10' cols='80'></textarea></td>";
	dialoghtml += "  </tr>";
	dialoghtml += "  <tr>";
	dialoghtml += "    <td>&nbsp;&nbsp;</td>";
	dialoghtml += "    <td>";
//	dialoghtml += "      <input type='button' value='更新' onclick='onButtonCommitEditSchool()' />";
//	dialoghtml += "      <input type='button' value='取消' onclick='onButtonCancelEditSchool()' />";
	dialoghtml += "    </td>";
	dialoghtml += "  </tr>";
	dialoghtml += "</table>";
	dialoghtml += "</div>";

//	setSpanContentInnerHTML(html);
	$(dialoghtml).appendTo('body');

	$("#school_edit_id").prop("value", school.ID);
	$("#school_edit_logo").prop("src", school.LOGO);
	$("#school_edit_name").prop("value", school.NAME);
	$("#school_edit_creation").html(school.CREATION);
	$("#school_edit_lastupdate").html(school.LASTUPDATE);
	$("#school_edit_islocked_true").prop("checked", school.ISLOCKED);
	$("#school_edit_islocked_false").prop("checked", !school.ISLOCKED);
	$("#school_edit_intro").prop("value", htmlDecode(school.INTRO)); // Remember to do html decode.

	$("#dialog_school_edit").dialog({
		modal : true,
		minWidth : 600,
		minHeight : 300,
		buttons : [
			{
				text : "更新",
				click : function() {
					onButtonCommitEditSchool();
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

function onButtonCommitEditSchool() {
	var id = $("#school_edit_id").prop("value");
	var name = $("#school_edit_name").prop("value");
	var intro = $("#school_edit_intro").prop("value");
	intro = htmlEncode(intro); // Remember to do html encode.
	$.post(
		g_manageschool_update_url, 
		{"id":id, "name":name, "intro":intro}, 
		handleSchoolUpdateResponse
	);
}

function onButtonCancelEditSchool() {
	var tmp = generateTableOfSchools();
	setSpanContentInnerHTML(tmp);
}

function onButtonGetSchoolClassList(schoolid) {
	if (typeof schoolid == 'string') {
		var url = g_manageclasstables_select_url + "&schoolid=" + schoolid;
		$.get(url, handleClassTableSelectResponse);
	} else {
		throw new error('Please pass a string as an ID!');
	}
}

function handleClassTableSelectResponse(data, status) {
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		if (ret.retcode == RetCode.RETCODE_OK) {
			generateClassListHtml(ret);
		} else if (ret.retcode == RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_NO_EXISTENCE) {
			generateClassTableCreationHtml(ret);
		} else {
			window.alert("handleClassTableSelectResponse(): unknown retcode !");
		}
	}
}

// Generate UI(a list of classes) for a successful query.
function generateClassListHtml(ret) {
	var schoolid = ret.retobjx.schoolid;
	var classes = ret.retobjx.classes; // Array of classes.
	var dialoghtml = "";
	dialoghtml += "<div id='dialog_class_list' title='班级列表'>";
	dialoghtml += "</div>";

	$(dialoghtml).appendTo('body');
	if (classes.length == 0) {
		$("#dialog_class_list").html("班级列表为空！");
		$("#dialog_class_list").dialog({
			modal : true,
			minWidth : 400,
			minHeight : 200,
			buttons : [
				{
					text : "创建新班级",
					click : function() {
						onButtonCreateClass(schoolid);
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
	} else {
		
	}
}

function onButtonCreateClass(schoolid) {
	$("#dialog_class_list").dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
	var dialoghtml = "";
	dialoghtml += "<div id='dialog_class_creation' title='班级创建'>";
	dialoghtml += "  班级名称：<input type='text' id='class_create_name' name='name' value=''><br>";
	dialoghtml += "  入学年月：<input type='text' id='class_create_enrollment' name='enrollment' value=''>";
	dialoghtml += "</div>";
	$(dialoghtml).appendTo('body');
	$("#class_create_enrollment").datepicker();
	$("#dialog_class_creation").dialog({
		modal : true,
		minWidth : 400,
		minHeight : 200,
		buttons : [
			{
				text : "创建",
				click : function() {
					onButtonCommitCreateClass(schoolid);
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
	
}

// Generate UI(creation of new class table) when class table doesn't exist.
function generateClassTableCreationHtml(ret) {
	var dialoghtml = "";
	dialoghtml += "<div id='dialog_class_table_creation' title='班级列表'>";
	dialoghtml += "</div>";

	$(dialoghtml).appendTo('body');
	$("#dialog_class_table_creation").html("不存在班级sql表格，点击下方<u>创建新sql表格</u>创建！");
	$("#dialog_class_table_creation").dialog({
		modal : true,
		minWidth : 400,
		minHeight : 200,
		buttons : [
			{
				text : "创建新sql表格",
				click : function() {
					onButtonCommitCreateClassTable(ret.retobjx.schoolid);
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

function onButtonCommitCreateClassTable(schoolid) {
	if (typeof schoolid == 'string') {
		var url = g_manageclasstables_create_url + "&schoolid=" + schoolid;
		$.get(url, handleClassTableCreateResponse);
	} else {
		throw new error('Please pass a string as an ID!');
	}
}

function handleClassTableCreateResponse(data, status) {
	if (status == "success") {
		var ret = null;
		if (typeof data == "object") { // object
			ret = data;
		} else { // string
			ret = eval("("+data+")"); // Transit JSON string to JSON object.
		}

		if (ret.retcode == RetCode.RETCODE_OK) {
			window.alert("创建成功！");
			$("#dialog_class_table_creation").dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
		} else {
			window.alert("handleClassTableCreateResponse(): unknown retcode !");
		}
	}
}
