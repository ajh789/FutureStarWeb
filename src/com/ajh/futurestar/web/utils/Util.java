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
	public static boolean checkAndSetUserLoginInfo(HttpSession session, ReturnX retx) {
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
	 * @param conn OUT
	 * @param retx OUT
	 * @return
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

	/**
	 * 
	 * @param conn IN
	 * @param stmt OUT
	 * @param retx OUT
	 * @return
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
