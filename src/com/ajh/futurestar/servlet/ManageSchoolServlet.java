package com.ajh.futurestar.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.ajh.future.common.Common.*;

/**
 * Servlet implementation class ManageSchoolServlet
 */
@WebServlet(name = "ManageSchoolServlet", description = "ManageSchoolServlet", urlPatterns = { "/manageschool" })
public class ManageSchoolServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String HTML_TITLE = "学校管理";
       
    public ManageSchoolServlet()
    {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		RetCode retcode = RetCode.RETCODE_OK;

		String reqfrom = req.getParameter("reqfrom");
		if (reqfrom == null) {
			reqfrom = Request.FROM_NULL;
			retcode = RetCode.RETCODE_KO_NULL_REQ_SOURCE;
		} else if (!reqfrom.equalsIgnoreCase(Request.FROM_PC) &&
				   !reqfrom.equalsIgnoreCase(Request.FROM_WAP)) {
			reqfrom = Request.FROM_UNKNOWN;
			retcode = RetCode.RETCODE_KO_UNKNOWN_REQ_SOURCE;
		} else {
			retcode = doBusiness(req, rsp);
		}

		generatePage(rsp, reqfrom, retcode);
	}

	private RetCode doBusiness(HttpServletRequest req, HttpServletResponse rsp)
	{
		HttpSession session = req.getSession();
		String name = (String)session.getAttribute("name");
		if (name == null || name.equalsIgnoreCase(""))
		{
			return RetCode.RETCODE_KO_NOTLOGIN_OR_TIMEOUT;
		}

		return RetCode.RETCODE_OK;
	}

	private void generatePage(HttpServletResponse rsp, String reqfrom, RetCode retcode)
			throws IOException
	{
		PrintWriter out = rsp.getWriter();
		if (reqfrom.equalsIgnoreCase(Request.FROM_PC)) {
			rsp.setContentType("text/html; charset=UTF-8");
			out.println("<html>");
			out.println("<head><title>" + HTML_TITLE + "</title></head>");
			out.println("<body>");
			generatePageBody4PC(out, retcode);
			out.println("</body>");
			out.println("</html>");
		} else if (reqfrom.equalsIgnoreCase(Request.FROM_WAP)) {
			rsp.setContentType("application/json; charset=UTF-8");
			JSONObject jobj = new JSONObject();
			generatePageBody4WAP(jobj, retcode);
			out.println(jobj.toString());
		} else {
			rsp.setContentType("text/plain; charset=UTF-8");
			out.println("未知请求来源！");
		}
	}

	private void generatePageBody4PC(PrintWriter out, RetCode retcode)
			throws IOException
	{
	}

	private void generatePageBody4WAP(JSONObject jobj, RetCode retcode)
			throws IOException
	{
	}
}
