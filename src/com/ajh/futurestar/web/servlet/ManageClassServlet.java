/**
 * ManageClassServlet.java
 * Manage classes in specified school.
 */
package com.ajh.futurestar.web.servlet;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Statement;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.ajh.futurestar.web.common.Request;
import com.ajh.futurestar.web.common.RetCode;
import com.ajh.futurestar.web.common.RetInfo;
import com.ajh.futurestar.web.common.ReturnX;
import com.ajh.futurestar.web.utils.Util;

/**
 * @author Andy Jiang H
 *
 */
public class ManageClassServlet extends ManageExServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8273769336541772993L;

	@Override
	protected void generatePageBody(PrintWriter out, ReturnX result) {
		JSONObject obj = new JSONObject();
		obj.put("actionx", result.actionx); // String
		obj.put("retcode", result.retcode.ordinal()); // Convert enumeration to integer.
		obj.put("retinfo", result.retinfo); // String
		obj.put("retobjx", result.retobjx); // JSON object
		obj.put("curuser", result.curuser); // JSON object
		out.println(obj.toString());
	}

	@Override
	protected void doBusiness(HttpServletRequest req, HttpServletResponse rsp, ReturnX retx) {
		HttpSession session = req.getSession();

		if (!Util.checkAndSetUserLoginInfo(session, retx)) {
			return;
		}

		Connection conn = null;
		if (!Util.getDbConnection(conn, retx)) {
			return;
		}

		Statement stmt = null;
		if (!Util.getDbStatement(conn, stmt, retx)) {
			return;
		}

		// DO NOT return when performing action.
		String action = req.getParameter(Request.PARAM_ACTION);
		if (action == null || action.equals("")) {
			retx.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_NULL_ACTION;
			retx.retinfo += RetInfo.RETINFO_REQ_PARAM_NULL_ACTION;
		} else {
			retx.actionx += action;
			if (action.equalsIgnoreCase(Request.VALUE_ACTION_SELECT)) {
				// TODO
			} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_CREATE)) {
				// TODO
			} else {
				// TODO
			}
		}
		Util.closeDbConnectionAndStatement(conn, stmt); // No need to update return code when exception occurs.
	}

}
