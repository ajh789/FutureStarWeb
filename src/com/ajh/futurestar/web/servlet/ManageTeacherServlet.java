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

import com.ajh.futurestar.web.common.Attribute;
import com.ajh.futurestar.web.common.DbConn;
import com.ajh.futurestar.web.common.DbVendor;
import com.ajh.futurestar.web.common.Request;
import com.ajh.futurestar.web.common.RetCode;
import com.ajh.futurestar.web.common.Return;

/**
 * Servlet implementation class ManageTeacherServlet
 */
@WebServlet("/manageteacher.do")
public class ManageTeacherServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ManageTeacherServlet()
    {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}

	private void process(HttpServletRequest req, HttpServletResponse rsp) throws IOException
	{
		Return ret = new Return();
		doBusiness(req, rsp, ret);
		generatePage(rsp, ret);
	}

	private void generatePage(HttpServletResponse rsp, Return result) throws IOException
	{
		rsp.setContentType("application/json; charset=UTF-8");
		PrintWriter out = rsp.getWriter();
		generatePageBody(out, result);
	}

	private void generatePageBody(PrintWriter out, Return result) {
		JSONObject obj = new JSONObject();
		obj.put("retcode", result.retcode.ordinal()); // Convert enum to int.
		obj.put("retinfo", result.retinfo);
		obj.put("teachers", result.retobjx);
		obj.put("actionx", result.actionx);
		obj.put("privilege", result.prvlege);
		out.println(obj.toString());
	}

	private void doBusiness(HttpServletRequest req, HttpServletResponse rsp, Return ret)
	{
		HttpSession session = req.getSession();
		String username = (String)session.getAttribute(Attribute.ATTR_USER_NAME); // User's name of login.
		if (username == null || username.equals(""))
		{
			ret.retcode  = RetCode.RETCODE_KO_NOTLOGIN_OR_TIMEOUT;
			ret.retinfo += "尚未登录或会话超时";
			return;
		} else {
			Integer privilege = (Integer)session.getAttribute(Attribute.ATTR_USER_PRIVILEGE);
			ret.prvlege = privilege.intValue();
		}

		Connection conn = null;
		try {
			conn = DbConn.getDbConnection();
		} catch (ClassNotFoundException | SQLException  e) {
			e.printStackTrace();
			ret.retcode  = RetCode.RETCODE_KO_DB_OPEN_CONN_FAILED;
			ret.retinfo += e.getMessage();
			return;
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
			return;
		}

		// DO NOT return when performing action.
		String action = req.getParameter(Request.PARAM_ACTION);
		if (action == null || action.equals("")) {
			ret.retcode = RetCode.RETCODE_KO_MANAGE_TEACHER_NULL_ACTION;
			ret.retinfo = "action为空";
		} else {
			boolean actionDone = false;
//DO_DB_ACTION:
			if (!actionDone) { // Start DO_DB_ACTION.
				ret.actionx += action;
				if (action.equalsIgnoreCase(Request.VALUE_ACTION_SELECT)) { // select
					//
					// Get parameters.
					//
					int nMode = Request.VALUE_ACTION_SELECT_MODE_BASEID_AND_INCREMENT;
					String mode = req.getParameter(Request.PARAM_ACTION_SELECT_MODE);
					if (mode != null) {
						nMode = Integer.parseInt(mode);
					}

					String baseid = req.getParameter(Request.PARAM_ACTION_SELECT_BASEID);
					if (baseid == null) {
						baseid = "" + Request.VALUE_ACTION_SELECT_BASEID_DEFAULT;
					}

					int nRange = Request.VALUE_ACTION_SELECT_RANGE_DEFAULT;
					String range = req.getParameter(Request.PARAM_ACTION_SELECT_RANGE);
					if (range != null) {
						nRange = Integer.parseInt(range);
					}

					int nGoes = Request.VALUE_ACTION_SELECT_GOES_DOWN; // Default to goes down.
					String goes = req.getParameter(Request.PARAM_ACTION_SELECT_GOES);
					if (goes != null && goes.equalsIgnoreCase("up")) {
						nGoes = Request.VALUE_ACTION_SELECT_GOES_UP;
					}

					String name = req.getParameter(Request.PARAM_TEACHER_NAME);
					if (name == null) {
						name = "";
					}
					String mobilenum = req.getParameter(Request.PARAM_TEACHER_MOBILENUM);
					if (mobilenum == null) {
						mobilenum = "";
					}
					String schoolname = req.getParameter(Request.PARAM_TEACHER_SCHOOLNAME);
					if (schoolname == null) {
						schoolname = "";
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
					// Construct SQL query string.
					//
					String sql = "";
					switch (nMode) {
					case Request.VALUE_ACTION_SELECT_MODE_BASEID_AND_INCREMENT:
						sql = composeSqlStrSelect(DbVendor.DB_SQLITE, baseid, nRange, name, mobilenum, schoolname, nGoes);
						break;
					case Request.VALUE_ACTION_SELECT_MODE_FROM_TO:
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
						ret.retcode  = RetCode.RETCODE_KO_MANAGE_TEACHER_SELECT_FAILED;
						ret.retinfo += e.getMessage();
					}
				} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_INSERT)) { // insert
					//
				} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_UPDATE)) { // update
					//
				} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_DELETE)) { // delete
					//
				} else {
					ret.retcode = RetCode.RETCODE_KO_UNKNOWN_DB_ACTION;
				}
			}
		}

		try {
			stmt.close();
			conn.close();
		} catch (SQLException e) { // No need to update return code.
			e.printStackTrace();
		}
	}
	
	private String composeSqlStrSelectAllFields()
	{
		return "select * from V_TEACHER_FROM_SCHOOL";
	}

	private String composeSqlStrSelect(DbVendor vendor, String fromid, String toid)
	{
		return null;
	}

	private String composeSqlStrSelect
	(
		DbVendor vendor, 
		String baseid,
		int range, 
		String name, 
		String mobilenum,
		String schoolname, 
		int goes
	)
	{
		String sql = composeSqlStrSelectAllFields();
		if (goes == Request.VALUE_ACTION_SELECT_GOES_DOWN) { // Goes down.
			sql += " where CREATION > '" + baseid + "'";
			if (name != null && !name.equals("")) {
				sql += " and NAME like '%" + name +"%'";
			}
			if (mobilenum != null && !mobilenum.equals("")) {
				sql += " and MOBILENUM = '" + mobilenum + "'";
			}
			if (schoolname != null && !schoolname.equals("")) {
				sql += " and SCHOOL_NAME like '%" + schoolname + "%'";
			}
			sql += " order by CREATION asc limit " + range + ";";
		} else { // Goes up.
			sql += " where CREATION in " +
				"(select CREATION from V_TEACHER_FROM_SCHOOL where CREATION < '" + baseid + "'";
			if (name != null && !name.equals("")) {
				sql += " and NAME like '%" + name +"%'";
			}
			if (mobilenum != null && !mobilenum.equals("")) {
				sql += " and MOBILENUM = '" + mobilenum + "'";
			}
			if (schoolname != null && !schoolname.equals("")) {
				sql += " and SCHOOL_NAME like '%" + schoolname + "%'";
			}
			sql += " order by CREATION desc limit " + range +");";
		}
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
			obj.put("ID", rs.getInt("ID"));
			obj.put("NAME", rs.getString("NAME"));
			obj.put("LOGO", rs.getString("LOGO"));
			obj.put("MOBILENUM", rs.getString("MOBILENUM"));
			obj.put("GENDER", rs.getInt("GENDER"));
			obj.put("CREATION", rs.getString("CREATION"));
			obj.put("LASTLOGIN", rs.getString("LASTLOGIN"));
			obj.put("ISLOCKED", rs.getInt("ISLOCKED"));
			obj.put("SCHOOL_ID", rs.getString("SCHOOL_ID"));
			obj.put("SCHOOL_NAME", rs.getString("SCHOOL_NAME"));
			array.put(obj);
//			getServletContext().log(obj.toString());
		}
		ret.retobjx = array;
		rs.close();

		getServletContext().log("Leave method doDbActionSelect(4 PARAMS).");
	}
}
