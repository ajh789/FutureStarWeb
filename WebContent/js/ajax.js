var req = null;

function reqdata()
{
	var url = "manageschool?reqfrom=wap";

	if (window.XMLHttpRequest) { // IE7, Firefox, Opera
		document.getElementById("span_content").innerHTML = "<b>尝试获取XMLHttpRequest！</b>";
		req = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE5, IE6
		document.getElementById("span_content").innerHTML = "<b>尝试获取ActiveXObject！</b>";
		req = new ActiveXObject("Microsoft.XMLHTTP");
	} else {
		document.getElementById("span_content").innerHTML = "<b>获取req对象出错！</b>";
	}
	
	if (req == null) {
		window.alert("不能创建XMLHttpRequest对象实例！");
		return;
	}

	req.open("GET", url, true);
	req.onreadystatechange = getResponse;

	req.send(null);
}

function getResponse() {
	var tmp = "<b>In function getResponse.</b><br/>";
	tmp += "req.readyState is " + req.readyState + "<br/>";
	tmp += "req.status is " + req.status + "<br/>";
//	if (req.readyState == 4 && req.status == 200) {
//		var rsp = req.responseText;
//		tmp += rsp;
//	}
	tmp += req.responseText;
	document.getElementById("span_content").innerHTML = tmp;
}