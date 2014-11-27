package com.ajh.futurestar.servlet;

import java.io.*;
import java.sql.SQLException;
import javax.servlet.*;
import javax.servlet.http.*;

import org.json.JSONObject;

import com.ajh.futurestar.utils.Authenticate;

public class WapLoginServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1315400829044423376L;

	public void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws IOException, ServletException 
	{
		process(req, rsp);
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
		process(req, rsp);
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException {
//		HttpSession session = req.getSession(true); // It may return new session.
		HttpSession session = req.getSession();
		String username = req.getParameter("name");
		String password = req.getParameter("password");
		String userrole = req.getParameter("role");
		rsp.setContentType("text/plain; charset=UTF-8"); // DO NOT use "application/json; charset=UTF-8".
		PrintWriter out = rsp.getWriter();
		JSONObject jo = new JSONObject();
		if (username != null && 
			password != null &&
			userrole != null) {
			try {
				if (Authenticate.authenticate(username, password, userrole, session)) {
					JSONObject user = new JSONObject();
					user.put("role", session.getAttribute("role"));
					user.put("id", ((Integer)session.getAttribute("id")).intValue());
					user.put("name", session.getAttribute("name"));
					user.put("privilege", ((Integer)session.getAttribute("privilege")).intValue());
					user.put("islocked", ((Boolean)session.getAttribute("islocked")).booleanValue());
					jo.put("retcode", 0);
					jo.put("retinfo", "登录成功");
					jo.put("user", user);
				} else {
					jo.put("retcode", 1);
					jo.put("retinfo", "用户名或密码不正确");
				}
			} catch (ClassNotFoundException | SQLException e) {
				jo.put("retcode", 1);
				jo.put("retinfo", "捕获异常: " + e.getMessage());
				e.printStackTrace();
			}
		} else {
			jo.put("retcode", 1);
			if (username == null)
				jo.put("retinfo", "用户名为空");
			else if (password == null)
				jo.put("retinfo", "密码为空");
			else
				jo.put("retinfo", "用户角色为空");
		}
		out.println(jo.toString());
	}
}
