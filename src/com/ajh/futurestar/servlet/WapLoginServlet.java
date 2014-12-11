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
	private static final int RETCODE_OK = 0;
	private static final int RETCODE_KO = 1;
	private static final int RETCODE_KO_LOGIN_FAILED = 2;
	private static final int RETCODE_KO_NOTLOGIN_OR_TIMEOUT = 3;

	public void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws IOException, ServletException 
	{
		process(req, rsp);
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
//		HttpSession session = req.getSession(true); // It may return new session.
		HttpSession session = req.getSession();
		String action   = req.getParameter("action");
		String name     = req.getParameter("name");
		String password = req.getParameter("password");
		String role     = req.getParameter("role");
		rsp.setContentType("text/plain; charset=UTF-8"); // DO NOT use "application/json; charset=UTF-8".
		PrintWriter out = rsp.getWriter();
		JSONObject jo = new JSONObject();
		if (action == null) {
			jo.put("retcode", RETCODE_KO);
			jo.put("retinfo", "actionΪ��");
		} else {
			if (action.equalsIgnoreCase("login")) { // Do login.
				if (name     != null && 
					password != null &&
					role     != null) {
					try {
						if (Authenticate.authenticate(name, password, role, session)) {
							JSONObject user = new JSONObject();
							user.put("role", session.getAttribute("role"));
							user.put("id", ((Integer)session.getAttribute("id")).intValue());
							user.put("name", session.getAttribute("name"));
							user.put("privilege", ((Integer)session.getAttribute("privilege")).intValue());
							user.put("islocked", ((Boolean)session.getAttribute("islocked")).booleanValue());
							jo.put("retcode", RETCODE_OK);
							jo.put("retinfo", "��¼�ɹ�");
							jo.put("user", user);
						} else {
							jo.put("retcode", RETCODE_KO_LOGIN_FAILED);
							jo.put("retinfo", "�û��������벻��ȷ");
						}
					} catch (ClassNotFoundException | SQLException e) {
						jo.put("retcode", RETCODE_KO);
						jo.put("retinfo", "�����쳣: " + e.getMessage());
						e.printStackTrace();
					}
				} else {
					jo.put("retcode", RETCODE_KO);
					if (name == null)
						jo.put("retinfo", "�û���Ϊ��");
					else if (password == null)
						jo.put("retinfo", "����Ϊ��");
					else
						jo.put("retinfo", "�û���ɫΪ��");
				}
			} // End login.
			else if (action.equalsIgnoreCase("getstatus")) { // Do get status.
				if (session.getAttribute("name") != null) {
					JSONObject user = new JSONObject();
					user.put("role", session.getAttribute("role"));
					user.put("id", ((Integer)session.getAttribute("id")).intValue());
					user.put("name", session.getAttribute("name"));
					user.put("privilege", ((Integer)session.getAttribute("privilege")).intValue());
					user.put("islocked", ((Boolean)session.getAttribute("islocked")).booleanValue());
					jo.put("retcode", RETCODE_OK);
					jo.put("retinfo", "�Ѿ���¼");
					jo.put("user", user);
				} else {
					jo.put("retcode", RETCODE_KO_NOTLOGIN_OR_TIMEOUT);
					jo.put("retinfo", "��δ��¼��Ự��ʱ");
				}
			} // End get status.
			else {
				jo.put("retcode", RETCODE_KO);
				jo.put("retinfo", "δ֪action: " + action);
			}
		}

		out.println(jo.toString());
	}
}
