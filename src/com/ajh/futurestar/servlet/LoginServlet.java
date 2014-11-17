package com.ajh.futurestar.servlet;

import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

public class LoginServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1382075836716659538L;

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
		rsp.setContentType("text/html; charset=UTF-8");
		PrintWriter out = rsp.getWriter();
		out.println("<html>");
		out.println("<head>");
		out.println("<title>µÇÂ¼</title>");
		out.println("</head>");
		out.println("<body>");
		if (username != null && 
			password != null &&
			role != null &&
			authenticate(username, password, role)) {
			out.println("µÇÂ¼³É¹¦.");
			session.setAttribute("username", username);
			session.setAttribute("password", password);
			session.setAttribute("role", role);
		} else {
			out.println("µÇÂ¼Ê§°Ü.");
		}
		out.println("</body>");
		out.println("</html>");
	}

	private boolean authenticate(String username, String password, String role)
	{
		return username.equals("foo") && password.equals("bar");
	}
}
