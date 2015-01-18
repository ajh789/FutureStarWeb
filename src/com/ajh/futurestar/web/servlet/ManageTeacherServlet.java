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
					//
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
					// Construct SQL query string.
					//
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

}
