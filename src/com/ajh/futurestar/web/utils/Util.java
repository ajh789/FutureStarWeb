package com.ajh.futurestar.web.utils;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.ajh.futurestar.web.common.Attribute;
import com.ajh.futurestar.web.common.DbConn;
import com.ajh.futurestar.web.common.RetCode;
import com.ajh.futurestar.web.common.RetInfo;
import com.ajh.futurestar.web.common.ReturnX;

public class Util {
	// Static nested class DbConnectionWrapper
	public static class DbConnectionWrapper {
		public Connection conn = null;
		public boolean ok = false;

		public DbConnectionWrapper(Connection conn, boolean ok) {
			this.conn = conn;
			this.ok = ok;
		}
	}

	// Static nested class DbStatementWrapper
	public static class DbStatementWrapper {
		public Statement stmt = null;
		public boolean ok = false;

		public DbStatementWrapper(Statement stmt, boolean ok) {
			this.stmt = stmt;
			this.ok = ok;
		}
	}

	/**
	 * 
	 * @param session IN PARAM
	 * @param retx OUT PARAM
	 * @return true/false
	 */
	public static boolean checkAndSetUserLoginInfo(final HttpSession session, ReturnX retx) {
		String strUserName = (String)session.getAttribute(Attribute.ATTR_USER_NAME); // User's login name.

		if (strUserName == null || strUserName.equals(""))
		{
			retx.retcode  = RetCode.RETCODE_KO_NOT_LOGIN_OR_SESSION_TIMEOUT;
			retx.retinfo += RetInfo.RETINFO_NOT_LOGIN_OR_SESSION_TIMEOUT;
			return false;
		} else {
			String strUserRole = (String)session.getAttribute(Attribute.ATTR_USER_ROLE);
			Integer nPrivilege = (Integer)session.getAttribute(Attribute.ATTR_USER_PRIVILEGE);
			JSONObject objCurUser = new JSONObject();
			objCurUser.put("name", strUserName);
			objCurUser.put("role", strUserRole);
			objCurUser.put("privilege", nPrivilege);
			retx.curuser = objCurUser;
		}

		return true;
	}

	/**
	 * 
	 * @param conn OUT PARAM -- Doesn't work, because OUT parameter can't be null.
	 * @param retx OUT PARAM
	 * @return true/false
	 */
	public static boolean getDbConnection(Connection conn, ReturnX retx) {
		try {
			conn = DbConn.getDbConnection();
		} catch (ClassNotFoundException | SQLException  e) {
			e.printStackTrace();
			retx.retcode  = RetCode.RETCODE_KO_DB_OPEN_CONN_FAILED;
			retx.retinfo += e.getMessage();
			return true;
		}

		return true;
	}
	public static DbConnectionWrapper getDbConnection(ReturnX retx) {
		Connection conn = null;

		try {
			conn = DbConn.getDbConnection();
		} catch (ClassNotFoundException | SQLException  e) {
			e.printStackTrace();
			retx.retcode  = RetCode.RETCODE_KO_DB_OPEN_CONN_FAILED;
			retx.retinfo += e.getMessage();
			return new DbConnectionWrapper(conn, false);
		}

		return new DbConnectionWrapper(conn, true);
	}

	/**
	 * 
	 * @param conn IN
	 * @param stmt OUT -- Doesn't work, because OUT parameter can't be null.
	 * @param retx OUT
	 * @return true/false
	 */
	public static boolean getDbStatement(final Connection conn, Statement stmt, ReturnX retx) {
		try {
			stmt = conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.close(); // Close connection.
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			retx.retcode  = RetCode.RETCODE_KO_DB_CREATE_STMT_FAILED;
			retx.retinfo += e.getMessage();
			return false;
		}

		return true;
	}
	public static DbStatementWrapper getDbStatement(final Connection conn, ReturnX retx) {
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
			retx.retcode  = RetCode.RETCODE_KO_DB_CREATE_STMT_FAILED;
			retx.retinfo += e.getMessage();
			return new DbStatementWrapper(stmt, false);
		}

		return new DbStatementWrapper(stmt, true);
	}

	/**
	 * 
	 * @param conn IN PARAM
	 * @param stmt IN PARAM
	 */
	public static void closeDbConnectionAndStatement(final Connection conn, final Statement stmt) {
		try {
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
