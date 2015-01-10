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
			// Four members: retcode, retinfo, actionx, schools
			var ret = eval("("+rsp+")"); // Transit JSON string to JSON object.
			if (ret.retcode == 0) { // OK
				var schools = ret.schools; // Array of schools.
				if (schools.length > 0) {
//					g_schools = new Array(); // Allocate a new array.
					g_schools_head = schools[0].CREATION;
					g_schools_tail = schools[schools.length-1].CREATION;

					tmp += "<table id='schools' border='1'>";
//					tmp += "<caption>Schools:</caption>";
					tmp += "<tr>";
//					tmp += "<th>ID</th>";
//					tmp += "<th>NAME</th>";
					tmp += "<th>LOGO</th>";
					tmp += "<th>NAME&INTRO</th>";
					tmp += "<th>CREATION</th>";
					tmp += "</tr>";

					for (var i=0; i<schools.length; i++) {
//						g_schools.push(schools[i]); // Append new item.
						tmp += "<tr>";
//						tmp += "<td>" + schools[i].ID + "</td>";
//						tmp += "<td>" + schools[i].NAME + "</td>";
						if (schools[i].LOGO != "" && schools[i].LOGO != "null") {
							tmp += "<td><img src='" + schools[i].LOGO +"' alt='logo' height='100' width='100' /></td>";
						} else {
							tmp += "<td>" + schools[i].LOGO + "</td>";
						}
						tmp += "<td><b>" + schools[i].NAME + "</b>(" + schools[i].ID + ")<br/><br/>" + schools[i].INTRO + "</td>";
						tmp += "<td>" + schools[i].CREATION + "</td>";
						tmp += "</tr>";
					}

					tmp += "</table>";
					document.getElementByIdx_x("span_content").innerHTML = tmp;
//					document.getElementByIdx_x("button_reqdata").style.display = "none";
					document.getElementByIdx_x("button_reqdata_up").style.display = "inline";
					document.getElementByIdx_x("button_reqdata_down").style.display = "inline";
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
//			window.alert("Debug message is not null.");
			document.getElementById("span_debugmsg").style.display = "block"; // Show
			document.getElementById("span_debugmsg").innerHTML = debug;
		} else {
//			window.alert("Debug message is null.");
			document.getElementById("span_debugmsg").style.display = "none"; // Hide
		}
	}
}