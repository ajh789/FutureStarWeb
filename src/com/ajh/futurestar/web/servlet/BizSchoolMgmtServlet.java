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
import com.ajh.futurestar.web.utils.Util;
import com.ajh.futurestar.web.utils.Util.DbConnectionWrapper;
import com.ajh.futurestar.web.utils.Util.DbStatementWrapper;

/**
 * Servlet implementation class ManageSchoolServlet
 */
@WebServlet(name = "ManageSchoolServlet", description = "ManageSchoolServlet", urlPatterns = { "/schoolmgmt.do" })
public class BizSchoolMgmtServlet extends HttpServlet {
	private static final long serialVersionUID = 5826567279826573784L;

	public BizSchoolMgmtServlet()
	{
		super();
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

		ReturnX ret = new ReturnX();
//		req.setCharacterEncoding("UTF-8"); // Doesn't work. Need to set URIEncoding="UTF-8" for Connector in server.xml
		doBusiness(req, rsp, ret);
		generatePage(rsp, ret);

		getServletContext().log("Leave method process().");
	}

	// Catch and handle all exceptions in this method and generate return code.
	private void doBusiness(HttpServletRequest req, HttpServletResponse rsp, ReturnX retx)
	{
		getServletContext().log("Enter method doBusiness().");

		HttpSession session = req.getSession();

		if (!Util.checkAndSetUserLoginInfo(session, retx)) {
			return;
		}

		Connection conn = null;
		DbConnectionWrapper wrapperConn = Util.getDbConnection(retx);
		if (wrapperConn.ok) {
			conn = wrapperConn.conn;
		} else {
			return;
		}

		Statement stmt = null;
		DbStatementWrapper wrapperStmt = Util.getDbStatement(conn, retx);
		if (wrapperStmt.ok) {
			stmt = wrapperStmt.stmt;
		} else {
			return;
		}

		// DO NOT return when performing action.
		String action = req.getParameter(Request.PARAM_ACTION);
		if (action == null || action.equals("")) {
			retx.retcode = RetCode.RETCODE_KO_MANAGE_SCHOOL_NULL_ACTION;
			retx.retinfo = RetInfo.RETINFO_REQ_PARAM_NULL_ACTION;
		} else {
			retx.actionx += action;
			if (action.equalsIgnoreCase(Request.VALUE_ACTION_SELECT)) { // select
				try {
					doActionSelect(conn, stmt, req, retx);
				} catch (SQLException e) {
					e.printStackTrace();
					retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_SELECT_FAILED;
					retx.retinfo += e.getMessage();
				}
			} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_INSERT)) { // insert
				try {
					doActionInsert(conn, stmt, req, retx);
				} catch (SQLException e) {
					e.printStackTrace();
					retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_INSERT_FAILED;
					retx.retinfo += e.getMessage();
				}
			} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_UPDATE)) { // update
				try {
					doActionUpdate(conn, stmt, req, retx);
				} catch (SQLException e) {
					e.printStackTrace();
					retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
					retx.retinfo += e.getMessage();
				}
			} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_DELETE)) { // delete
				// TODO
			} else {
				retx.retcode = RetCode.RETCODE_KO_UNKNOWN_DB_ACTION;
			}
		} // End else.

		Util.closeDbConnectionAndStatement(conn, stmt); // No need to update return code when exception occurs.
	}

	private String composeSqlStrSelectAllFields()
	{
		return "select * from V_SCHOOL";
	}

	private String composeSqlStrSelect(DbVendor vendor, String baseid, int range, String schoolname, int goes)
	{
		String sql = composeSqlStrSelectAllFields();
		if (goes == Request.VALUE_ACTION_SELECT_GOES_DOWN) {
			sql += " where CREATION > '" + baseid + "'";
			if (schoolname != null && !schoolname.equals("")) {
//				getServletContext().log("School name is " + schoolname);
				sql += " and NAME like '%" + schoolname + "%'";
			}
			sql += " order by CREATION asc limit " + range + ";";
		} else {
			sql += " where CREATION in " + 
				"( select CREATION from T_SCHOOL where CREATION < '" + baseid + "'";
			if (schoolname != null && !schoolname.equals("")) {
//				getServletContext().log("School name is " + schoolname);
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
//		getServletContext().log("composeSqlStrUpdate() : School id is " + id);
//		getServletContext().log("composeSqlStrUpdate() : School name is " + schoolname);
//		getServletContext().log("composeSqlStrUpdate() : School name intro " + intro);
		// Syntax: update T_SCHOOL set INTRO='xxx' where ID=X'xxx';
		String sql = "update T_SCHOOL set INTRO='" + intro + "' where ID=X'" + id +"';";
		return sql;
	}

	private void doActionSelect(Connection conn, Statement stmt, HttpServletRequest req, ReturnX retx)
			throws SQLException {
		//
		// Get parameters.
		//
		int nMode = Request.VALUE_ACTION_SELECT_MODE_BASEID_AND_INCREMENT;
		String strMode = req.getParameter(Request.PARAM_ACTION_SELECT_MODE);
		if (strMode != null) {
			nMode = Integer.parseInt(strMode);
		}

		String strBaseId = req.getParameter(Request.PARAM_ACTION_SELECT_BASEID);
		if (strBaseId == null) {
			strBaseId = "" + Request.VALUE_ACTION_SELECT_BASEID_DEFAULT;
		}

		int nRange = Request.VALUE_ACTION_SELECT_RANGE_DEFAULT;
		String strRange = req.getParameter(Request.PARAM_ACTION_SELECT_RANGE);
		if (strRange != null) {
			nRange = Integer.parseInt(strRange);
		}

		String strSchoolName = req.getParameter(Request.PARAM_SCHOOL_NAME);

		int nGoes = Request.VALUE_ACTION_SELECT_GOES_DOWN; // Default to goes down.
		String strGoes = req.getParameter(Request.PARAM_ACTION_SELECT_GOES);
		if (strGoes != null && strGoes.equalsIgnoreCase("up")) {
			nGoes = Request.VALUE_ACTION_SELECT_GOES_UP;
		}

		String strFromId = req.getParameter(Request.PARAM_ACTION_SELECT_FROMID);
		if (strFromId == null) {
			strFromId = "0";
		}
		String strToId = req.getParameter(Request.PARAM_ACTION_SELECT_TOID);
		if (strToId == null) {
			strToId = "0";
		}

		//
		// Construct query SQL string.
		//
		String strQuery = "";
		switch (nMode) {
		case Request.VALUE_ACTION_SELECT_MODE_BASEID_AND_INCREMENT:
			strQuery = composeSqlStrSelect(DbVendor.DB_SQLITE, strBaseId, nRange, strSchoolName, nGoes);
			break;
		case Request.VALUE_ACTION_SELECT_MODE_FROM_TO:
			strQuery = composeSqlStrSelect(DbVendor.DB_SQLITE, strFromId, strToId);
			break;
		default:
			break;
		}
		getServletContext().log(strQuery);

		//
		// Do query.
		//
		ResultSet rs = stmt.executeQuery(strQuery);
		JSONArray arraySchool = new JSONArray();
		while (rs.next()) {
			JSONObject obj = new JSONObject(); // Item in array.
			obj.put("ID", rs.getString("ID"));
			obj.put("NAME", rs.getString("NAME"));
			obj.put("LOGO", rs.getString("LOGO"));
			obj.put("INTRO", rs.getString("INTRO"));
			obj.put("CREATION", rs.getString("CREATION"));
			obj.put("LASTUPDATE", rs.getString("LASTUPDATE"));
			obj.put("ISLOCKED", rs.getBoolean("ISLOCKED"));
			arraySchool.put(obj);
		}
		rs.close();

		JSONObject retobjx = new JSONObject();
		retobjx.put("schools", arraySchool);

		retx.retobjx = retobjx; // Remember to do this assignment.
	}

	private void doActionInsert(Connection conn, Statement stmt, HttpServletRequest req, ReturnX retx)
		throws SQLException
	{
		String schoolName = req.getParameter(Request.PARAM_SCHOOL_NAME);
		if (schoolName == null || schoolName.equals("")) {
			retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_NULL_NAME;
			retx.retinfo += RetInfo.RETINFO_REQ_PARAM_NULL_SCHOOL_NAME;
		} else {
			String sql = "";
			stmt.executeUpdate(sql);
			conn.commit();
		}
	}

	private void doActionUpdate(Connection conn, Statement stmt, HttpServletRequest req, ReturnX retx)
		throws SQLException
	{
		//
		// Get parameters.
		//
		String id = req.getParameter(Request.PARAM_SCHOOL_ID);
		if (id == null || id.equals("")) {
			retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
			retx.retinfo += RetInfo.RETINFO_REQ_PARAM_NULL_SCHOOL_ID;
			return;
		}
		String schoolname = req.getParameter(Request.PARAM_SCHOOL_NAME);
		if (schoolname == null || schoolname.equals("")) {
			retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
			retx.retinfo += RetInfo.RETINFO_REQ_PARAM_NULL_SCHOOL_NAME;
			return;
		}
		String intro = req.getParameter(Request.PARAM_SCHOOL_INTRO);
		if (intro == null || intro.equals("")) {
			retx.retcode  = RetCode.RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED;
			retx.retinfo += RetInfo.RETINFO_REQ_PARAM_NULL_SCHOOL_INTRO;
			return;
		}

		//
		// Construct update SQL string.
		//
		String sql = composeSqlStrUpdate(DbVendor.DB_SQLITE, id, schoolname, intro);

		//
		// Do update.
		//
		getServletContext().log(sql);
		stmt.executeUpdate(sql);
		conn.commit(); // Auto commit is set to false in DbConn.getDbConnection().
	}

	private void generatePage(HttpServletResponse rsp, ReturnX result)
			throws IOException
	{
		getServletContext().log("Enter method generatePage().");

//		PrintWriter out = null; // Method getWriter() should be called after setContentType().
		rsp.setContentType("application/json; charset=UTF-8");
		PrintWriter out = rsp.getWriter(); // Method getWriter() should be called after setContentType().
		generatePageBody(out, result);

		getServletContext().log("Leave method generatePage().");
	}

	private void generatePageBody(PrintWriter out, ReturnX result)
			throws IOException
	{
		getServletContext().log("Enter method generatePageBody().");

		JSONObject obj = new JSONObject();
		obj.put("actionx", result.actionx); // String
		obj.put("retcode", result.retcode.ordinal()); // Convert enumeration to integer.
		obj.put("retinfo", result.retinfo); // String
		obj.put("retobjx", result.retobjx); // JSON object
		obj.put("curuser", result.curuser); // JSON object
		out.println(obj.toString());

		getServletContext().log("Leave method generatePageBody().");
	}
}
