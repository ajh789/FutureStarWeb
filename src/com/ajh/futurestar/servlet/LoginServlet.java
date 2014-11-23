package com.ajh.futurestar.servlet;

import java.io.*;
import java.sql.SQLException;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.ajh.futurestar.utils.Authenticate;

@WebServlet("/login")
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
//		out.println("username: " + username + "<br/>");
//		out.println("password: " + password + "<br/>");
//		out.println("role: " + role + "<br/>");
		if (username != null && 
			password != null &&
			role != null) {
			try {
//				out.println("Try connecting to db and authenticate.<br/>");
				if (Authenticate.authenticate(username, password, role, session)) {
					out.println("µÇÂ¼³É¹¦.<br/>");
					out.println("role    : " + session.getAttribute("role") + "<br/>");
					out.println("id      : " + session.getAttribute("userid") + "<br/>");
					out.println("name    : " + session.getAttribute("username") + "<br/>");
					out.println("islocked: " + session.getAttribute("islocked") + "<br/>");
				} else {
					out.println("ÓÃ»§Ãû»òÃÜÂë´íÎó.<br/>");
				}
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
				out.println(e.getMessage() + "<br/>");
			}
		} else {
			out.println("µÇÂ¼Ê§°Ü.<br/>");
		}
		out.println("</body>");
		out.println("</html>");
	}
}
