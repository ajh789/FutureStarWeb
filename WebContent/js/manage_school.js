document.getElementByIdx_x = function(id) {
	if (typeof id == 'string') {
		return document.getElementById(id);
	} else {
		throw new error('Please pass a string as an ID!');
	}
};

var g_manageschool_url = {
	"select" : "/futurestar/manageschool.do?reqfrom=wap&action=select",
	"insert" : "/futurestar/manageschool.do?reqfrom=wap&action=insert",
	"update" : "/futurestar/manageschool.do?reqfrom=wap&action=update",
	"delete" : "/futurestar/manageschool.do?reqfrom=wap&action=delete"
};

var g_privilege = 0;

var g_schools = {};
g_schools.data = null; // Array of schools.
g_schools.head = null; // Time stamp of creation for head in school array.
g_schools.tail = null; // Time stamp of creation for tail in school array.
g_schools.curpos = -1; // Position of currently visiting school.

var g_manageclasstables_url = "/futurestar/manageclasstables.do";
var g_manageclasstables_select_url = g_manageclasstables_url + "?action=select";
var g_manageclasstables_create_url = g_manageclasstables_url + "?action=create";

var g_manageclass_url = "/futurestar/manageclass.do";
var g_manageclass_select_url = "/futurestar/manageclass.do" + "?action=select";
var g_manageclass_create_url = "/futurestar/manageclass.do" + "?action=create";

function reqData()
{
	var url = g_manageschool_url.select;

//	if (g_schools.tail != null) {
//		url += "&baseid=" + g_schools.tail;
//	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	$.get(url, handleSchoolSelectResponse);
}

function reqDataUp()
{
	var url = g_manageschool_url.select;

	if (g_schools.head != null) {
		url += "&baseid=" + g_schools.head + "&goes=up";
	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	$.get(url, handleSchoolSelectResponse);
}

function reqDataDown()
{
	var url = g_manageschool_url.select;

	if (g_schools.tail != null) {
		url += "&baseid=" + g_schools.tail;
	}

	var schoolname = $("#text_schoolname").val();
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	$.get(url, handleSchoolSelectResponse);
}

function reqDataFromTo()
{
	var url = g_manageschool_url.select + "&mode=1";

	if (g_schools.head != null)
		url += "&fromid=" + g_schools.head;

	if (g_schools.tail != null)
		url += "&toid=" + g_schools.tail;

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
		//   retobjx -- array of schools
		//   curuser -- info of current user
		if (ret.retcode == RetCode.RETCODE_OK) { // OK
			g_privilege = ret.curuser.privilege;
			var schools = ret.retobjx.schools; // Array of schools.
			if (schools.length > 0) {
				g_schools.data = new Array(); // Allocate a new array.
				g_schools.data = g_schools.data.concat(schools);
				g_schools.head = schools[0].CREATION;
				g_schools.tail = schools[schools.length-1].CREATION;
				tmp += generateSchoolListUI();
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
			alert("更新成功！");
			reqDataFromTo(); // Trigger a query
			$("#dialog_school_edit").dialog("destroy").remove(); // Destroy and remove dialog.
		}
	}
}

function generateSchoolListUI() {
	var html = "";

	if (g_schools.data.length > 0) {
		html += "<table id='schools' border='1'>";
		html += "<tr>";
		html += "<th>&nbsp;</th>";       // Column 1
		html += "<th>学&nbsp;校</th>"; // Column 2
		html += "<th>操&nbsp;作</th>";     // Column 3
		html += "</tr>";
	}

	for (var i=0; i<g_schools.data.length; i++) {
		html += "<tr>"; // Row stars.
		// Column 1
		if (g_schools.data[i].LOGO != "" && g_schools.data[i].LOGO != "null") {
			html += "<td><img src='" + g_schools.data[i].LOGO +"' alt='logo' class='img_school_logo' /></td>";
		} else {
			html += "<td>" + g_schools.data[i].LOGO + "</td>";
		}
		// Column 2
		html += "<td id='school_details'><b>" + g_schools.data[i].NAME + "</b>(" + g_schools.data[i].ID + ")<br/>" + g_schools.data[i].CREATION +"<br/>" + g_schools.data[i].INTRO + "</td>";
		// Column 3
		html += "<td>";
		if (g_privilege & 0x4)
			html += "<input type='button' value='删除' onclick='onButtonDeleteSchool()' />&nbsp;";
//		if (g_privilege & 0x2)
//			html += "<input type='button' value='修改' onclick='onButtonEditSchool(\"" + g_schools.data[i].ID +"\")' />&nbsp;";
		if (g_privilege > 0) {
			html += "<input type='button' value='详细信息' onclick='onButtonShowSchoolDetails(\"" + g_schools.data[i].ID + "\")' />&nbsp;";
			html += "<input type='button' value='班级列表' onclick='onButtonGetSchoolClassList(\"" + g_schools.data[i].ID + "\")' />";
		}
		html += "</td>";
		html += "</tr>"; // Row ends.
	}

	if (g_schools.data.length > 0) {
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

function clearSpanContentInnerHTML() {
	$("#span_content").html("");
}

function onButtonEditSchool(id) {
	try {
		var obj = findSchool(id);
		if (obj.found) {
			hideSpanDebugMsg();
			generateEditSchoolUI(obj.school);
		}
	} catch (e) {
		window.alert(e);
	}
}

// Find a school according to its ID.
function findSchool(id) {
	if (typeof id == 'string') {
		var found = false;
		var school = null;
		for (var i=0; i<g_schools.data.length; i++) {
			if (g_schools.data[i].ID == id) {
				found = true;
				school = g_schools.data[i];
				break;
			}
		}
		return {
			"found": found,
			"school": school
		};
	} else {
		throw new Error('Please pass a string as an ID!');
	}
}

function onButtonShowSchoolDetails(id)
{
	try {
		var obj = findSchool(id);
		if (obj.found) {
			hideSpanDebugMsg();
			var ui = generateSchoolDetailsUI(obj.school);
			setSpanContentInnerHTML(ui);
		}
	} catch (e) {
		window.alert(e);
	}
}

function onButtonDeleteSchool()
{
	window.alert("暂不支持删除操作！");
}

function generateSchoolDetailsUI(school)
{
	var ui = "";
	ui += "<table>"; // Use table to do layout.
	ui += "  <tr style='vertical-align:middle;'>";
	ui += "    <td>";
	ui += "      <a href='#' onclick='onButtonSchoolNaviPrev()'>";
	ui += "        <img class='img_navigation_prev_next' src='images/icons/prev.png' alt='上一个' />";
	ui += "      </a>";
	ui += "    </td>";
	ui += "    <td>";
	ui += "<table class='table_school_edit'>";
	ui += "  <tr>";
	ui += "    <td>学校徽标：</td>";
	ui += "    <td><img id='school_details_logo' src='' alt='logo' class='img_school_logo' /></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>学校名称：</td>";
	ui += "    <td>";
	ui += "      <input type='text' id='school_details_name' name='name' value='' disabled/>";
	ui += "      <input type='hidden' id='school_details_id' name='id' value='' />";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>注册时间：</td>";
	ui += "    <td><span id='school_details_creation'></span></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>更新时间：</td>";
	ui += "    <td><span id='school_details_lastupdate'></span></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>当前状态：</td>";
	ui += "    <td>";
	ui += "      <input id='school_details_islocked_true'  type='radio' name='islocked' value='true' />锁定";
	ui += "      <input id='school_details_islocked_false' type='radio' name='islocked' value='false' />未锁定";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>学校介绍：</td>";
	ui += "    <td><textarea id='school_details_intro' rows='10' cols='80'></textarea></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td colspan='2' align='center'>";
	ui += "      <input type='button' value='更新' onclick='onButtonCommitEditSchool()' />";
//	ui += "      <input type='button' value='取消' onclick='onButtonCancelEditSchool()' />";
	ui += "      <input type='button' value='返回列表' onclick='onButtonReturnToSchoolList()' />";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "</table>";
	ui += "    </td>";
	ui += "    <td>";
	ui += "      <a href='#' onclick='onButtonSchoolNaviNext()'>";
	ui += "        <img class='img_navigation_prev_next' src='images/icons/next.png' alt='下一个' />";
	ui += "      </a>";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "</table>";

	pushHiddenDOM(ui);

	// All text boxes and radio buttons should update default values as well as values.
	// Otherwise innerHTML will only contain default value.
	$("#school_details_id").prop("value", school.ID);
	$("#school_details_id").prop("defaultValue", school.ID);
	$("#school_details_logo").prop("src", school.LOGO);
	$("#school_details_name").prop("value", school.NAME);
	$("#school_details_name").prop("defaultValue", school.NAME);
	$("#school_details_creation").html(school.CREATION);
	$("#school_details_lastupdate").html(school.LASTUPDATE);
	$("#school_details_islocked_true").prop("checked", school.ISLOCKED);
	$("#school_details_islocked_true").prop("defaultChecked", school.ISLOCKED);
	$("#school_details_islocked_false").prop("checked", !school.ISLOCKED);
	$("#school_details_islocked_false").prop("defaultChecked", !school.ISLOCKED);
	$("#school_details_intro").prop("value", htmlDecode(school.INTRO)); // Remember to do html decode.
	$("#school_details_intro").prop("defaultValue", htmlDecode(school.INTRO)); // Remember to do html decode.

	$("#div_school_navi_prev").css("height", $("#div_school_details").css("height"));
	$("#div_school_navi_next").css("height", $("#div_school_details").css("height"));

	return popHiddenDOM();
}

function generateEditSchoolUI(school)
{
	var ui = "";
	ui += "<div id='dialog_school_edit' title='学校编辑'>";
	ui += "<table class='table_school_edit'>";
//	ui += "  <caption>学校编辑</caption>";
	ui += "  <tr>";
	ui += "    <td>学校徽标：</td>";
	ui += "    <td><img id='school_edit_logo' src='' alt='logo' class='img_school_logo' /></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>学校名称：</td>";
	ui += "    <td>";
	ui += "      <input type='text' id='school_edit_name' name='name' value='' disabled/>";
	ui += "      <input type='hidden' id='school_edit_id' name='id' value='' />";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>注册时间：</td>";
	ui += "    <td><span id='school_edit_creation'></span></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>更新时间：</td>";
	ui += "    <td><span id='school_edit_lastupdate'></span></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>当前状态：</td>";
	ui += "    <td>";
	ui += "      <input id='school_edit_islocked_true'  type='radio' name='islocked' value='true' />锁定";
	ui += "      <input id='school_edit_islocked_false' type='radio' name='islocked' value='false' />未锁定";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>学校介绍：</td>";
	ui += "    <td><textarea id='school_edit_intro' rows='10' cols='80'></textarea></td>";
	ui += "  </tr>";
	ui += "  <tr>";
	ui += "    <td>&nbsp;&nbsp;</td>";
	ui += "    <td>";
//	ui += "      <input type='button' value='更新' onclick='onButtonCommitEditSchool()' />";
//	ui += "      <input type='button' value='取消' onclick='onButtonCancelEditSchool()' />";
	ui += "    </td>";
	ui += "  </tr>";
	ui += "</table>";
	ui += "</div>";

	$(ui).appendTo('body');

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
//					onButtonCommitEditSchool(); // Disabled.
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
	var id = $("#school_details_id").prop("value");
	var name = $("#school_details_name").prop("value");
	var intro = $("#school_details_intro").prop("value");
	intro = htmlEncode(intro); // Remember to do html encode.
	$.post(
		g_manageschool_url.update, 
		{"id":id, "name":name, "intro":intro}, 
		handleSchoolUpdateResponse
	);
}

function onButtonCancelEditSchool() {
	setSpanContentInnerHTML(generateSchoolListUI());
}

function onButtonReturnToSchoolList() {
	setSpanContentInnerHTML(generateSchoolListUI());
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
//			generateClassListHtml(ret);
			retrieveClassList(ret.retobjx.schoolid);
		} else if (ret.retcode == RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_NO_EXISTENCE) {
			generateClassTableCreationHtml(ret);
		} else {
			window.alert("handleClassTableSelectResponse(): unknown retcode !");
		}
	}
}

function retrieveClassList(schoolid) {
	var url = g_manageclass_select_url + "&schoolid=" + schoolid;
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
			generateClassListHtml(ret);
		} else {
			window.alert("Error: " + ret.retinfo);
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
}

function onButtonCreateClass(schoolid) {
	$("#dialog_class_list").dialog("destroy").remove(); // Remove dialog div from its parent after destroy.
	var dialoghtml = "";
	dialoghtml += "<div id='dialog_class_creation' title='班级创建'>";
	dialoghtml += "  班级名称：<input type='text' id='class_create_text_name' value=''>";
	dialoghtml += "            <span id='class_create_label_name'></span><br>";
	dialoghtml += "  入学年月：<input type='text' id='class_create_text_enrollment' value=''>";
	dialoghtml += "            <span id='class_create_label_enrollment'></span>";
	dialoghtml += "</div>";
	$(dialoghtml).appendTo('body');
	$("#class_create_text_enrollment").datepicker({
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
	var name = $("#class_create_text_name").prop("value");
	var enrollment = $("#class_create_text_enrollment").prop("value");
	var ok = true;

	if (name === "") {
		ok = false;
		$("#class_create_label_name").html("<font color='red'>不能为空！</font>");
	}

	if (enrollment === "") {
		ok = false;
		$("#class_create_label_enrollment").html("<font color='red'>不能为空！</font>");
	}

	if (ok == false) {
		return;
	}

	var url = g_manageclass_create_url + "&schoolid=" + schoolid + "&name=" + name + "&enrollment=" + enrollment;
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
			window.alert("Error: " + ret.retinfo);
		}
	}
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

function pushHiddenDOM(element) {
	$("#span_content_hidden").html("");
	$(element).appendTo("#span_content_hidden");
}

function popHiddenDOM() {
	var html = $("#span_content_hidden").html();
	$("#span_content_hidden").html("");
	return html;
}
