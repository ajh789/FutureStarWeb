package com.ajh.futurestar.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ajh.future.common.*;

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
		Return ret = new Return();

		String reqfrom = req.getParameter(Request.PARAM_FROM);
		if (reqfrom == null) {
			reqfrom = Request.PARAM_FROM_NULL;
			ret.retcode = RetCode.RETCODE_KO_NULL_REQ_SOURCE;
		} else if (!reqfrom.equalsIgnoreCase(Request.PARAM_FROM_PC) &&
				   !reqfrom.equalsIgnoreCase(Request.PARAM_FROM_WAP)) {
			reqfrom = Request.PARAM_FROM_UNKNOWN;
			ret.retcode = RetCode.RETCODE_KO_UNKNOWN_REQ_SOURCE;
		} else {
			doBusiness(req, rsp, ret);
		}

		generatePage(rsp, reqfrom, ret);
	}

	// Catch and handle all exceptions in this method and generate return code.
	private Return doBusiness(HttpServletRequest req, HttpServletResponse rsp, Return ret)
	{
		HttpSession session = req.getSession();
		String name = (String)session.getAttribute(Attribute.ATTR_USER_NAME); // User's name of login.
		if (name == null || name.equalsIgnoreCase(""))
		{
			ret.retcode  = RetCode.RETCODE_KO_NOTLOGIN_OR_TIMEOUT;
			ret.retinfo += "尚未登录或会话超时";
			return ret;
		}

		Connection conn = null;
		try {
			conn = DbConn.getDbConnection();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
			ret.retcode  = RetCode.RETCODE_KO_DB_OPEN_CONN_FAILED;
			ret.retinfo += e.getMessage();
			return ret;
		}

		Statement stmt = null;
		try {
			stmt = conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.close(); // Close connection.
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			ret.retcode  = RetCode.RETCODE_KO_DB_CREATE_STMT_FAILED;
			ret.retinfo += e.getMessage();
			return ret;
		}

		// DO NOT return when performing action.
		String action = req.getParameter(Request.PARAM_ACTION);
		if (action.equalsIgnoreCase(DbAction.ACTION_SELECT)) { // select
			try {
				doDbActionSelect(conn, stmt, ret);
			} catch (SQLException e) {
				e.printStackTrace();
				ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_SELECT_FAILED;
				ret.retinfo += e.getMessage();
			}
		} else if (action.equalsIgnoreCase(DbAction.ACTION_INSERT)) { // insert
			String schoolName = req.getParameter(Request.PARAM_SCHOOL_NAME);
			if (schoolName == null || schoolName.equalsIgnoreCase("")) {
				ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_NULL_NAME;
				ret.retinfo += "学校名称为空";
			} else {
				try {
					doDbActionInsert(conn, stmt, schoolName);
				} catch (SQLException e) {
					e.printStackTrace();
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_INSERT_FAILED;
					ret.retinfo += e.getMessage();
				}
			}
		} else if (action.equalsIgnoreCase(DbAction.ACTION_UPDATE)) { // update
			// TODO
		} else if (action.equalsIgnoreCase(DbAction.ACTION_DELETE)) { // delete
			// TODO
		} else {
			ret.retcode = RetCode.RETCODE_KO_UNKNOWN_DB_ACTION;
		}

		try {
			stmt.close();
			conn.close();
		} catch (SQLException e) { // No need to update return code.
			e.printStackTrace();
		}

		return ret;
	}

	private void doDbActionSelect(Connection c, Statement stmt, Return ret)
			throws SQLException
	{
		String sql = "select * from T_SCHOOL order by ID asc limit 0,5";
		ResultSet rs = stmt.executeQuery(sql);
		JSONArray array = new JSONArray();
		while (rs.next()) {
			JSONObject obj = new JSONObject(); // Item in array.
			obj.put("ID", rs.getInt("ID"));
			obj.put("NAME", rs.getString("NAME"));
			array.put(obj);
		}
		ret.retobjx = array;
		rs.close();
	}

	private void doDbActionInsert(Connection c, Statement stmt, String schoolName) throws SQLException
	{
		String sql = "";
		stmt.execute(sql);
	}

	private void generatePage(HttpServletResponse rsp, String reqfrom, Return result)
			throws IOException
	{
		PrintWriter out = rsp.getWriter();
		if (reqfrom.equalsIgnoreCase(Request.PARAM_FROM_PC)) {
			rsp.setContentType("text/html; charset=UTF-8");
			out.println("<html>");
			out.println("<head><title>" + HTML_TITLE + "</title></head>");
			out.println("<body>");
			generatePageBody4PC(out, result);
			out.println("</body>");
			out.println("</html>");
		} else if (reqfrom.equalsIgnoreCase(Request.PARAM_FROM_WAP)) {
			rsp.setContentType("application/json; charset=UTF-8");
			generatePageBody4WAP(out, result);
		} else {
			rsp.setContentType("text/plain; charset=UTF-8");
			out.println("未知请求来源！");
		}
	}

	private void generatePageBody4PC(PrintWriter out, Return result)
			throws IOException
	{
	}

	private void generatePageBody4WAP(PrintWriter out, Return result)
			throws IOException
	{
		JSONObject obj = new JSONObject();
		obj.put("retcode", result.retcode);
		obj.put("retinfo", result.retinfo);
		obj.put("schools", result.retobjx);
		out.println(obj.toString());
	}
}
