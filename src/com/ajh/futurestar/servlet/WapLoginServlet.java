package com.ajh.futurestar.servlet;

import java.io.*;

import javax.servlet.*;
import javax.servlet.http.*;

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
		rsp.setContentType("text/html");
		PrintWriter out = rsp.getWriter();
		out.println("<html>");
		out.println("<head>");
		out.println("<title>Login</title>");
		out.println("</head>");
		out.println("<body>");
		if (username != null && password != null &&
			authenticate(username, password)) {
			out.println("Login succeeded.");
			session.setAttribute("username", username);
			session.setAttribute("password", password);
		} else {
			out.println("Login failed.");
//			session.setAttribute("username", "");
//			session.setAttribute("password", "");
		}
		out.println("</body>");
		out.println("</html>");
	}

	private boolean authenticate(String username, String password)
	{
		return username.equals("foo") && password.equals("bar");
	}
}
