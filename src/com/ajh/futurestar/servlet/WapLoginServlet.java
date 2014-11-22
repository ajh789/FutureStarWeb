package com.ajh.futurestar.servlet;

import java.io.*;
import java.sql.SQLException;

import javax.servlet.*;
import javax.servlet.http.*;

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
		String role     = req.getParameter("role");
		rsp.setContentType("text/plain; charset=UTF-8");
		PrintWriter out = rsp.getWriter();
		if (username != null && 
			password != null) {
			try {
				if (Authenticate.authenticate(username, password, role, session)) {
					out.println("Login succeeded.");
				}
			} catch (ClassNotFoundException | SQLException e) {
				out.println("Login failed.");
				e.printStackTrace();
			}
//			session.setAttribute("username", username);
//			session.setAttribute("password", password);
		} else {
			out.println("Login failed.");
//			session.setAttribute("username", "");
//			session.setAttribute("password", "");
		}
	}
}
