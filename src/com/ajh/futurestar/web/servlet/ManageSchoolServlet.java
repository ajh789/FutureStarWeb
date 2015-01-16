package com.ajh.futurestar.web.servlet;

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

import com.ajh.futurestar.web.common.*;

/**
 * Servlet implementation class ManageSchoolServlet
 */
@WebServlet(name = "ManageSchoolServlet", description = "ManageSchoolServlet", urlPatterns = { "/manageschool" })
public class ManageSchoolServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String HTML_TITLE = "学校管理";
	private static final int Q_DEFAULT_BASEID = 0;
	private static final int Q_DEFAULT_RANGE = 10;
	private static final int Q_GOES_UP = 0;
	private static final int Q_GOES_DOWN = 1;
	private static final int Q_MODE_BASEID_AND_INCREMENT = 0;
	private static final int Q_MODE_FROM_TO = 1;

	public ManageSchoolServlet()
	{
		super();
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		getServletContext().log("Enter method doGet().");
		process(req, rsp);
		getServletContext().log("Leave method doGet().");
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		getServletContext().log("Enter method doPost().");
		process(req, rsp);
		getServletContext().log("Leave method doPost().");
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		getServletContext().log("Enter method process().");

		Return ret = new Return();

//		req.setCharacterEncoding("UTF-8"); // Doesn't work. Need to set URIEncoding="UTF-8" for Connector in server.xml

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

		getServletContext().log("Leave method process().");
	}

	// Catch and handle all exceptions in this method and generate return code.
	private Return doBusiness(HttpServletRequest req, HttpServletResponse rsp, Return ret)
	{
		getServletContext().log("Enter method doBusiness().");

		HttpSession session = req.getSession();
		String username = (String)session.getAttribute(Attribute.ATTR_USER_NAME); // User's name of login.
		if (username == null || username.equals(""))
		{
			ret.retcode  = RetCode.RETCODE_KO_NOTLOGIN_OR_TIMEOUT;
			ret.retinfo += "尚未登录或会话超时";
			return ret;
		} else {
			Integer privilege = (Integer)session.getAttribute(Attribute.ATTR_USER_PRIVILEGE);
			ret.prvlege = privilege.intValue();
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
		if (action == null || action.equals("")) {
			ret.retcode = RetCode.RETCODE_KO_MANAGE_SCHOOL_NULL_ACTION;
			ret.retinfo = "action为空";
		} else {
			boolean actionDone = false;
DO_DB_ACTION:
			if (!actionDone) { // Start DO_DB_ACTION.
			ret.actionx += action;
			if (action.equalsIgnoreCase(DbAction.ACTION_SELECT)) { // select
				//
				// Get parameters.
				//
				int nMode = Q_MODE_BASEID_AND_INCREMENT;
				String mode = req.getParameter(Request.PARAM_ACTION_SELECT_MODE);
				if (mode != null) {
					nMode = Integer.parseInt(mode);
				}

				String baseid = req.getParameter(Request.PARAM_ACTION_SELECT_BASEID);
				if (baseid == null) {
					baseid = "" + Q_DEFAULT_BASEID;
				}

				int nRange = Q_DEFAULT_RANGE;
				String range = req.getParameter(Request.PARAM_ACTION_SELECT_RANGE);
				if (range != null) {
					nRange = Integer.parseInt(range);
				}

				String schoolname = req.getParameter(Request.PARAM_SCHOOL_NAME);

				int nGoes = Q_GOES_DOWN; // Default to goes down.
				String goes = req.getParameter(Request.PARAM_ACTION_SELECT_GOES);
				if (goes != null && goes.equalsIgnoreCase("up")) {
					nGoes = Q_GOES_UP;
				}
				
				String fromid = req.getParameter(Request.PARAM_ACTION_SELECT_FROMID);
				if (fromid == null) {
					fromid = "0";
				}
				String toid = req.getParameter(Request.PARAM_ACTION_SELECT_TOID);
				if (toid == null) {
					toid = "0";
				}

				//
				// Construct query SQL string.
				//
				String sql = "";
				switch (nMode) {
				case Q_MODE_BASEID_AND_INCREMENT:
					sql = composeSqlStrSelect(DbVendor.DB_SQLITE, baseid, nRange, schoolname, nGoes);
					break;
				case Q_MODE_FROM_TO:
					sql = composeSqlStrSelect(DbVendor.DB_SQLITE, fromid, toid);
					break;
				default:
					break;
				}

				//
				// Do query.
				//
				try {
					doDbActionSelect(conn, stmt, ret, sql);
				} catch (SQLException e) {
					e.printStackTrace();
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_SELECT_FAILED;
					ret.retinfo += e.getMessage();
				}
			} else if (action.equalsIgnoreCase(DbAction.ACTION_INSERT)) { // insert
				String schoolName = req.getParameter(Request.PARAM_SCHOOL_NAME);
				if (schoolName == null || schoolName.equals("")) {
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
				//
				// Get parameters.
				//
				String id = req.getParameter(Request.PARAM_SCHOOL_ID);
				if (id == null || id.equals("")) {
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
					ret.retinfo += "学校ID为空";
					actionDone = true;
					break DO_DB_ACTION;
				}
				String schoolname = req.getParameter(Request.PARAM_SCHOOL_NAME);
				if (schoolname == null || schoolname.equals("")) {
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
					ret.retinfo += "学校名称为空";
					actionDone = true;
					break DO_DB_ACTION;
				}
				String intro = req.getParameter(Request.PARAM_SCHOOL_INTRO);
				if (intro == null || intro.equals("")) {
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
					ret.retinfo += "学校介绍为空";
					actionDone = true;
					break DO_DB_ACTION;
				}
				//
				// Construct update SQL string.
				//
				String sql = composeSqlStrUpdate(DbVendor.DB_SQLITE, id, schoolname, intro);
				//
				// Do update.
				//
				try {
					doDbActionUpdate(conn, stmt, sql);
				} catch (SQLException e) {
					e.printStackTrace();
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
					ret.retinfo += e.getMessage();
				}
			} else if (action.equalsIgnoreCase(DbAction.ACTION_DELETE)) { // delete
				// TODO
			} else {
				ret.retcode = RetCode.RETCODE_KO_UNKNOWN_DB_ACTION;
			}
		} // End DO_DB_ACTION
		} // End else.

		try {
			stmt.close();
			conn.close();
		} catch (SQLException e) { // No need to update return code.
			e.printStackTrace();
		}

		return ret;
	}
	
	private String composeSqlStrSelectAllFields()
	{
		return "select hex(ID) as ID, NAME, LOGO, INTRO, CREATION, LASTUPDATE, ISLOCKED from T_SCHOOL";
	}

	private String composeSqlStrSelect(DbVendor vendor, String baseid, int range, String schoolname, int goes)
	{
		String sql = composeSqlStrSelectAllFields();
		if (goes == Q_GOES_DOWN) {
			sql += " where CREATION > '" + baseid + "'";
			if (schoolname != null && !schoolname.equals("")) {
				getServletContext().log("School name is " + schoolname);
				sql += " and NAME like '%" + schoolname + "%'";
			}
			sql += " order by CREATION asc limit " + range + ";";
		} else {
			sql += " where CREATION in " + 
				"( select CREATION from T_SCHOOL where CREATION < '" + baseid + "'";
			if (schoolname != null && !schoolname.equals("")) {
				getServletContext().log("School name is " + schoolname);
				sql += " and NAME like '%" + schoolname + "%'";
			}
			sql += " order by CREATION desc limit " + range +");";
		}

		return sql;
	}

	private String composeSqlStrSelect(DbVendor vendor, String fromid, String toid)
	{
		String sql = composeSqlStrSelectAllFields();
		sql += " where CREATION >= '" + fromid + "' AND CREATION <= '" + toid + "';";

		return sql;
	}

	private String composeSqlStrUpdate(DbVendor vendor, String id, String schoolname, String intro)
	{
		getServletContext().log("composeSqlStrUpdate() : School id is " + id);
		getServletContext().log("composeSqlStrUpdate() : School name is " + schoolname);
		getServletContext().log("composeSqlStrUpdate() : School name intro " + intro);
		// Syntax: update T_SCHOOL set INTRO='xxx' where ID=X'xxx';
		String sql = "update T_SCHOOL set INTRO='" + intro + "' where ID=X'" + id +"';";
		return sql;
	}

	private void doDbActionSelect(Connection c, Statement stmt, Return ret, String query)
			throws SQLException
	{
		getServletContext().log("Enter method doDbActionSelect(4 PARAMS).");
		getServletContext().log(query);

		ResultSet rs = stmt.executeQuery(query);
		JSONArray array = new JSONArray();
		while (rs.next()) {
			JSONObject obj = new JSONObject(); // Item in array.
			obj.put("ID", rs.getString("ID"));
			obj.put("NAME", rs.getString("NAME"));
			obj.put("LOGO", rs.getString("LOGO"));
			obj.put("INTRO", rs.getString("INTRO"));
			obj.put("CREATION", rs.getString("CREATION"));
			obj.put("LASTUPDATE", rs.getString("LASTUPDATE"));
			obj.put("ISLOCKED", rs.getBoolean("ISLOCKED"));
			array.put(obj);
		}
		ret.retobjx = array;
		rs.close();

		getServletContext().log("Leave method doDbActionSelect(4 PARAMS).");
	}

//	private void doDbActionSelect(Connection c, Statement stmt, Return ret, String baseid, int range, String name, int goes)
//			throws SQLException
//	{
//		getServletContext().log("Enter method doDbActionSelect(5 PARAMS).");
//
//		String sql = "select hex(ID) as ID, NAME, LOGO, INTRO, CREATION, LASTUPDATE, ISLOCKED from T_SCHOOL";
//		if (goes == GOES_DOWN) {
//			sql += " where CREATION > '" + baseid + "'";
//			if (name != null && name.compareToIgnoreCase("") != 0) {
//				getServletContext().log("School name is " + name);
//				sql += " and NAME like '%" + name + "%'";
//			}
//			sql += " order by CREATION asc limit " + range + ";";
//		} else {
//			sql += " where CREATION in " + 
//				"( select CREATION from T_SCHOOL where CREATION < '" + baseid + "'";
//			if (name != null && name.compareToIgnoreCase("") != 0) {
//				getServletContext().log("School name is " + name);
//				sql += " and NAME like '%" + name + "%'";
//			}
//			sql += " order by CREATION desc limit " + range +");";
//		}
//
//		getServletContext().log(sql);
//		doDbActionSelect(c, stmt, ret, sql);
//
//		getServletContext().log("Leave method doDbActionSelect(5 PARAMS).");
//	}

	private void doDbActionInsert(Connection c, Statement stmt, String schoolName) throws SQLException
	{
		String sql = "";
		stmt.execute(sql);
	}

	private void doDbActionUpdate(Connection c, Statement stmt, String sql) throws SQLException
	{
		getServletContext().log(sql);
		stmt.executeUpdate(sql);
		c.commit(); // Auto commit is set to false in DbConn.getDbConnection().
	}

	private void generatePage(HttpServletResponse rsp, String reqfrom, Return result)
			throws IOException
	{
		getServletContext().log("Enter method generatePage().");

//		rsp.setHeader("Cache-Control", "no-store");
//		rsp.setHeader("Pragma", "no-cache");
//		rsp.setDateHeader("Expires", 0);
		PrintWriter out = null; // Method getWriter() should be called after setContentType().
		if (reqfrom.equalsIgnoreCase(Request.PARAM_FROM_PC)) {
			rsp.setContentType("text/html; charset=UTF-8");
			out = rsp.getWriter();
			out.println("<html>");
			out.println("<head><title>" + HTML_TITLE + "</title></head>");
			out.println("<body>");
			generatePageBody4PC(out, result);
			out.println("</body>");
			out.println("</html>");
		} else if (reqfrom.equalsIgnoreCase(Request.PARAM_FROM_WAP)) {
			rsp.setContentType("application/json; charset=UTF-8");
//			rsp.setContentType("text/plain; charset=UTF-8");
			out = rsp.getWriter();
			generatePageBody4WAP(out, result);
		} else {
			rsp.setContentType("text/plain; charset=UTF-8");
			out = rsp.getWriter();
			out.println("未知请求来源！");
		}

		getServletContext().log("Leave method generatePage().");
	}

	private void generatePageBody4PC(PrintWriter out, Return result)
			throws IOException
	{
	}

	private void generatePageBody4WAP(PrintWriter out, Return result)
			throws IOException
	{
		getServletContext().log("Enter method generatePageBody4WAP().");
		JSONObject obj = new JSONObject();
		obj.put("retcode", result.retcode.ordinal()); // Convert enum to int.
		obj.put("retinfo", result.retinfo);
		obj.put("schools", result.retobjx);
		obj.put("actionx", result.actionx);
		obj.put("prvlege", result.prvlege);
		out.println(obj.toString());
		getServletContext().log("Leave method generatePageBody4WAP().");
	}
}
