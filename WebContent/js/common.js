function htmlEncode(value) {
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value) {
  return $('<div/>').html(value).text();
}

var Common = {}; // Use Common as a naming space.

Common.generateNaviMenu = function() {
	var uiMenu = "";
	uiMenu += '<span style="background-color:lightgray; display:block; font-size:20px; font-weight:bold; padding:5px 0px 5px 5px;">功能菜单</span>';
	uiMenu += '<ul>';
	uiMenu += '  <li><a href="manage_school.jsp">学校管理</a></li>';
	uiMenu += '  <li><a href="manage_teacher.jsp">教师管理</a></li>';
	uiMenu += '  <li><a href="manage_parent.jsp">家长管理</a></li>';
	uiMenu += '  <li><a href="childmgmt.html">学生管理</a></li>';
	uiMenu += '</ul>';
	return uiMenu;
};

Common.promptLoginDialog = function() {
	var uiDialog = "";
	uiDialog += "<div id='dialog_login' title='登录框'>";
	uiDialog += "<p>登录名称: <input type='text' id='login_text_name' /><span id='login_label_name'></span></p>";
	uiDialog += "<p>登录密码: <input type='password' id='login_text_password' /><span id='login_label_password'></span></p>";
	uiDialog += "<p>选择角色: ";
	uiDialog += "  <input type='radio' name='login_radio_role' value='admin' checked='checked' />管理员";
	uiDialog += "  <input type='radio' name='login_radio_role' value='teacher' />老&nbsp;师";
	uiDialog += "  <input type='radio' name='login_radio_role' value='parent' />家&nbsp;长";
	uiDialog += "</p>";
	uiDialog += "</div>";
	$(uiDialog).appendTo('body');
	$("#dialog_login").dialog({
		modal : true,
		minWidth : 400,
		minHeight : 200,
		buttons : [
			{
				text : "创建",
				click : function() {
					var name = $("#login_text_name").prop("value");
					var password = $("#login_text_password").prop("value");
					var role = $("input[name='login_radio_role']:checked").prop("value"); // Cool!
					var hasError = false;
					if (name == "") {
						$("#login_label_name").html("<font color='red'>输入名称</font>");
						hasError = true;
					} else {
						$("#login_label_name").html("");
					}
					if (password == "") {
						$("#login_label_password").html("<font color='red'>输入密码</font>");
						hasError = true;
					} else {
						$("#login_label_password").html("");
					}
//					console.log("name=" + name + ", password=" + password + ", role=" + role);

					if (hasError) return;

					$.post(
							g_waplogin_do_url.plain, 
							{"action": "login", "name": name, "password": password, "role": role}, 
							Common.handleLoginResponse
						);
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

Common.handleLoginResponse = function(data, status) {
	$("#dialog_login").dialog("destroy").remove(); // Remove dialog div from its parent after destroy.

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
		var uiLogin = "<input type='button' value='点击登录' onclick='onButtonLogin()' />";
		$("#span_user_info").html(uiLogin);
	}
};

Common.isLogin = function() {
	if (g_user == null)
		return false;
	else
		return true;
};
