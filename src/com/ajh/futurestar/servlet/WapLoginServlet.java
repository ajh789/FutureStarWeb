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
		String username = req.getParameter("username");
		String password = req.getParameter("password");
		String userrole = req.getParameter("role");
//		rsp.setContentType("text/plain; charset=UTF-8");
		rsp.setContentType("application/json; charset=UTF-8");
		PrintWriter out = rsp.getWriter();
		JSONObject jo = new JSONObject();
		if (username != null && 
			password != null &&
			userrole != null) {
			try {
				if (Authenticate.authenticate(username, password, userrole, session)) {
//					out.println("Login succeeded.");
					jo.put("retcode", 0);
					jo.put("retinfo", "登录成功");
				} else {
					jo.put("retcode", 1);
					jo.put("retinfo", "用户名或密码不正确");
				}
			} catch (ClassNotFoundException | SQLException e) {
//				out.println("Login failed.");
				jo.put("retcode", 1);
				jo.put("retinfo", "捕获异常: " + e.getMessage());
				e.printStackTrace();
			}
		} else {
//			out.println("Login failed.");
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
