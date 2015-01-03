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

function reqData()
{
	var url = "/futurestar/manageschool?reqfrom=wap&action=select";

	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = handleResponse;

	xmlhttp.send();
}

function handleResponse() {
	if (xmlhttp.readyState == 4) {
		var tmp = "Output:<br/>";
		var rsp = xmlhttp.responseText;
		if (xmlhttp.status == 200) { // 200 OK
			// Four members: retcode, retinfo, actionx, schools
			var ret = eval("("+rsp+")"); // Transit JSON string to JSON object.
			if (ret.retcode == 0) { // OK
				var schools = ret.schools; // Array of schools.
				tmp += "Data:<br/>";
				if (schools.length > 0) {
					tmp += "<table border='1'>";
//					tmp += "<caption>Schools:</caption>";
					tmp += "<tr>";
//					tmp += "<th>ID</th>";
					tmp += "<th>NAME</th>";
					tmp += "<th>LOGO</th>";
					tmp += "<th>INTRO</th>";
					tmp += "<th>CREATION</th>";
					tmp += "</tr>";
				}
				for (var i=0; i<schools.length; i++) {
					tmp += "<tr>";
//					tmp += "<td>" + schools[i].ID + "</td>";
					tmp += "<td>" + schools[i].NAME + "</td>";
					tmp += "<td>" + schools[i].LOGO + "</td>";
					tmp += "<td>" + schools[i].INTRO + "</td>";
					tmp += "<td>" + schools[i].CREATION + "</td>";
					tmp += "</tr>";
				}
				if (schools.length > 0) {
					tmp += "</table>";
				}
			} else {
				tmp += ret.retinfo;
			}
		} else {
			tmp += rsp;
		}
		document.getElementById("span_content").innerHTML = tmp;
	}
}