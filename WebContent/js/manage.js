document.getElementByIdx_x = function(id) {
	if (typeof id == 'string') {
		return document.getElementById(id);
	} else {
		throw new error('Please pass a string as an ID!');
	}
};

function createXHR()
{
	var obj = false;
	if (window.XMLHttpRequest) { // IE7, Firefox, Opera
		obj = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE5, IE6
		obj = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		window.alert("未知浏览器，不能创建XMLHttpRequest对象实例！");
	}

	if (!obj) {
		window.alert("创建XMLHttpRequest对象实例失败！");
	}

	return obj;
}

var xmlhttp = new createXHR();
var g_schools = null; // Array of schools.
var g_schools_head = null;
var g_schools_tail = null;

function reqData()
{
	var url = "/futurestar/manageschool?reqfrom=wap&action=select";

//	if (g_schools_tail != null) {
//		url += "&baseid=" + g_schools_tail;
//	}

	var schoolname = document.getElementByIdx_x("text_schoolname").value;
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	xmlhttp.open("GET", encodeURI(url), true);
	xmlhttp.onreadystatechange = handleResponse;

	xmlhttp.send();
}

function reqDataUp()
{
	var url = "/futurestar/manageschool?reqfrom=wap&action=select";

	if (g_schools_head != null) {
		url += "&baseid=" + g_schools_head + "&goes=up";
	}

	var schoolname = document.getElementByIdx_x("text_schoolname").value;
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = handleResponse;

	xmlhttp.send();
}

function reqDataDown()
{
	var url = "/futurestar/manageschool?reqfrom=wap&action=select";

	if (g_schools_tail != null) {
		url += "&baseid=" + g_schools_tail;
	}

	var schoolname = document.getElementByIdx_x("text_schoolname").value;
	if (schoolname != "") {
		url += "&name=" + schoolname;
	}

	xmlhttp.open("GET", encodeURI(url), true);
	xmlhttp.onreadystatechange = handleResponse;

	xmlhttp.send();
}

function handleResponse() {
	if (xmlhttp.readyState == 4) {
		var tmp = "";
		var debug = "";
		var rsp = xmlhttp.responseText;
		if (xmlhttp.status == 200) { // 200 OK
			// Five members: retcode, retinfo, actionx, schools, prvlege
			var ret = eval("("+rsp+")"); // Transit JSON string to JSON object.
			if (ret.retcode == 0) { // OK
				var schools = ret.schools; // Array of schools.
				if (schools.length > 0) {
					g_schools = new Array(); // Allocate a new array.
					g_schools_head = schools[0].CREATION;
					g_schools_tail = schools[schools.length-1].CREATION;

					tmp += "<table id='schools' border='1'>";
					tmp += "<tr>";
					tmp += "<th>&nbsp;</th>";       // Column 1
					tmp += "<th>学校</th>"; // Column 2
					tmp += "<th>操作</th>";     // Column 3
					tmp += "</tr>";

					for (var i=0; i<schools.length; i++) {
						g_schools.push(schools[i]); // Append new item.
						tmp += "<tr>"; // Row stars.
						// Column 1
						if (schools[i].LOGO != "" && schools[i].LOGO != "null") {
							tmp += "<td><img src='" + schools[i].LOGO +"' alt='logo' height='100' width='100' /></td>";
						} else {
							tmp += "<td>" + schools[i].LOGO + "</td>";
						}
						// Column 2
						tmp += "<td><b>" + schools[i].NAME + "</b>(" + schools[i].ID + ")<br/>" + schools[i].CREATION +"<br/>" + schools[i].INTRO + "</td>";
						// Column 3
						tmp += "<td>";
						if (ret.prvlege & 0x4)
							tmp += "<input type='button' value='删除' />";
						if (ret.prvlege & 0x2)
							tmp += "<input type='button' value='修改' onclick='onButtonEditSchool(\"" + schools[i].ID +"\")' />";
						tmp += "</td>";
						tmp += "</tr>"; // Row ends.
					}

					tmp += "</table>";
					setSpanContentInnerHTML(tmp);
//					hideButtonReqData();
					showButtonReqDataUp();
					showButtonReqDataDown();
				} else {
					debug += "没有更多数据可加载！";
				}
			} else {
				debug += ret.retinfo;
			}
		} else {
			debug += rsp;
		}
		if (debug != "") {
			showSpanDebugMsg(); // Show
			setSpanDebugMsgInnerHTML(debug);
		} else {
			hideSpanDebugMsg(); // Hide
		}
	}
}

function hideButtonReqData() {
//	document.getElementByIdx_x("button_reqdata").style.display = "none";
	$("#button_reqdata").hide();
}

function showButtonReqDataUp() {
//	document.getElementByIdx_x("button_reqdata_up").style.display = "inline";
	$("#button_reqdata_up").show();
}

function showButtonReqDataDown() {
//	document.getElementByIdx_x("button_reqdata_down").style.display = "inline";
	$("#button_reqdata_down").show();
}

function hideSpanDebugMsg() {
//	document.getElementById("span_debugmsg").style.display = "none"; // Hide
	$("#span_debugmsg").hide();
}

function showSpanDebugMsg() {
//	document.getElementById("span_debugmsg").style.display = "block"; // Hide
	$("#span_debugmsg").show();
}

function setSpanDebugMsgInnerHTML(innerHTML) {
//	document.getElementById("span_debugmsg").innerHTML = innerHTML;
	$("#span_debugmsg").html(innerHTML);
}

function setSpanContentInnerHTML(innerHTML) {
//	document.getElementByIdx_x("span_content").innerHTML = innerHTML;
	$("#span_content").html(innerHTML);
}

function onButtonEditSchool(id) {
//	window.alert("onButtonEditSchool: id = " + id);
	if (typeof id == 'string') {
		var tmp = "<table class='table_school_edit'>";
		var found = false;
		for (var i=0; i<g_schools.length; i++) {
			if (g_schools[i].ID == id) {
				tmp += "<tr><td>学校名称：</td><td>" + g_schools[i].NAME + "</td></tr>";
				tmp += "<tr><td>注册时间：</td><td>" + g_schools[i].CREATION + "</td></tr>";
				tmp += "<tr><td>学校介绍：</td><td>" + "<textarea rows='10' cols='80'>" + g_schools[i].INTRO + "</textarea></td>";
				tmp += "<tr><td></td><td><input type='button' value='更新' /><input type='button' value='取消' /></td></tr>";
				found = true;
				break;
			}
		}
		tmp += "</table>";
		if (found) {
			hideSpanDebugMsg();
			setSpanContentInnerHTML(tmp);
		}
	} else {
		throw new error('Please pass a string as an ID!');
	}
}