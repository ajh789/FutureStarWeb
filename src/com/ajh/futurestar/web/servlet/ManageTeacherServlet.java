package com.ajh.futurestar.web.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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

	private void process(HttpServletRequest req, HttpServletResponse rsp)
	{
		Return ret = new Return();
		doBusiness(req, rsp, ret);
		generateResult(rsp, ret);
	}

	private void generateResult(HttpServletResponse rsp, Return ret)
	{
		// TODO Auto-generated method stub
		
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
DO_DB_ACTION:
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
						sql = composeSqlStrSelect(DbVendor.DB_SQLITE, baseid, nRange, name, schoolname, nGoes);
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

	private String composeSqlStrSelect(DbVendor vendor, String fromid, String toid)
	{
		return null;
	}

	private String composeSqlStrSelect
	(
		DbVendor vendor, 
		String baseid,
		int nRange, 
		String name, 
		String schoolname, 
		int nGoes
	)
	{
		return null;
	}

}
