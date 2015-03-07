package com.ajh.futurestar.web.servlet;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ajh.futurestar.web.common.Attribute;
import com.ajh.futurestar.web.common.DbConn;
import com.ajh.futurestar.web.common.Request;
import com.ajh.futurestar.web.common.RetCode;
import com.ajh.futurestar.web.common.Return;

/**
 * Servlet implementation class ManageClassTablesServlet
 * Manage SQL tables of classes from different schools.
 * Each school has its own SQL table of class.
 */
@WebServlet(description = "Manage SQL tables of classes.", urlPatterns = { "/manageclasstables.do" })
public class ManageClassTablesServlet extends ManageServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 5374963195709422448L;

	/**
     * @see ManageServlet#ManageServlet()
     */
    public ManageClassTablesServlet() {
        super();
    }

	@Override
	protected void generatePageBody(PrintWriter out, Return result) {
		JSONObject obj = new JSONObject();
		obj.put("retcode", result.retcode.ordinal()); // Convert enum to int.
		obj.put("retinfo", result.retinfo);
		obj.put("retobjx", result.retobjx);
		obj.put("actionx", result.actionx);
		obj.put("prvlege", result.prvlege);
		out.println(obj.toString());
	}

	@Override
	protected void doBusiness(HttpServletRequest req, HttpServletResponse rsp, Return ret) {
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
			ret.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_NULL_ACTION;
			ret.retinfo += "action为空";
		} else {
			ret.actionx += action;
			if (action.equalsIgnoreCase(Request.VALUE_ACTION_SELECT)) { // Check if a SQL table of classes exists for specified school.
				try {
					doActionSelect(conn, stmt, req, ret);
				} catch (SQLException e) {
					e.printStackTrace();
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_SELECT_FAILED;
					ret.retinfo += e.getMessage();
				}
			} else if (action.equalsIgnoreCase(Request.VALUE_ACTION_CREATE)) { // Create SQL table of classes for specified school.
				try {
					doActionCreate(conn, stmt, req, ret);
				} catch (SQLException e) {
					e.printStackTrace();
					ret.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_CREATE_FAILED;
					ret.retinfo += e.getMessage();
				}
			} else {
				// TODO
			}
		}

		try {
			stmt.close();
			conn.close();
		} catch (SQLException e) { // No need to update return code.
			e.printStackTrace();
		}
	}

	private void doActionSelect(Connection conn, Statement stmt,
			HttpServletRequest req, Return ret) throws SQLException {
		String schoolid = req.getParameter("schoolid");
		if (schoolid == null || schoolid.equals("")) {
			ret.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_NULL_SCHOOLID;
			ret.retinfo += "school id为空！";
		} else {
			JSONObject retobjx = new JSONObject();
			retobjx.put("schoolid", schoolid);
			ret.retobjx = retobjx;

			String qClassTableExistence = "SELECT * FROM sqlite_master WHERE type='table' AND name='T_CLASS_FROM_SCHOOL_";
			qClassTableExistence += schoolid + "';";

			ResultSet rs = stmt.executeQuery(qClassTableExistence);

			if (rs.next()) { // Table exists.
				String qClassList = "select hex(ID) as ID, NAME, CREATION FROM T_CLASS_FROM_SCHOOL_" + schoolid;
				ResultSet rsClassList = stmt.executeQuery(qClassList);
				JSONArray classArray = new JSONArray();
				while (rsClassList.next()) {
					JSONObject obj = new JSONObject(); // Item in array.
					obj.put("ID", rs.getString("ID"));
					obj.put("NAME", rs.getString("NAME"));
					obj.put("CREATION", rs.getString("CREATION"));
					classArray.put(obj);
				}
				retobjx.put("classes", classArray);
			} else { // Table doesn't exist.
				ret.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_NO_EXISTENCE;
				ret.retinfo += "表格不存在！";
			}

			rs.close();
		}
	}

	private void doActionCreate(Connection conn, Statement stmt, HttpServletRequest req, Return ret)
		throws SQLException {
		String schoolid = req.getParameter("schoolid");
		if (schoolid == null || schoolid.equals("")) {
			ret.retcode  = RetCode.RETCODE_KO_MANAGE_CLASS_TABLES_NULL_SCHOOLID;
			ret.retinfo += "school id为空！";
		} else {
			String qClassTableSchema = "SELECT * FROM sqlite_master WHERE type='table' AND name='T_CLASS';";
			ResultSet rsTable = stmt.executeQuery(qClassTableSchema);
			if (rsTable.next()) { // "if" statement due to only one SQL table T_CLASS.
				String tableSchema0 = rsTable.getString("sql") + ';'; // Get schema of table T_CLASS.
				String tableSchema1 = tableSchema0.replaceAll("T_CLASS", "T_CLASS_FROM_SCHOOL_" + schoolid);
				getServletContext().log(tableSchema1);
				stmt.executeUpdate(tableSchema1); // Create new SQL table.
			} else {
				// TODO
			}
			rsTable.close();

			String qClassViewSchema = "SELECT * FROM sqlite_master WHERE type='view' AND name='V_CLASS';";
			ResultSet rsView = stmt.executeQuery(qClassViewSchema);
			if (rsView.next()) { // "if" statement due to only one SQL view V_CLASS.
				String viewSchema0 = rsView.getString("sql") + ';';
				String viewSchema1 = viewSchema0.replaceAll("V_CLASS", "V_CLASS_FROM_SCHOOL_" + schoolid);
				String viewSchema2 = viewSchema1.replaceAll("T_CLASS", "T_CLASS_FROM_SCHOOL_" + schoolid);
				getServletContext().log(viewSchema2);
				stmt.executeUpdate(viewSchema2);
			}
			rsView.close();
			conn.commit();
			String qClassTableTriggersSchema = "SELECT * FROM sqlite_master WHERE type='trigger' AND tbl_name='T_CLASS';";
			ResultSet rsTrigger = stmt.executeQuery(qClassTableTriggersSchema);
			String triggerSchema = "";
			while (rsTrigger.next()) { // "while" statement due to possibly more than 1 triggers.
				String triggerSchema0 = rsTrigger.getString("sql") + ';'; // Get schemas of triggers corresponding to T_CLASS.
				String triggerSchema1 = triggerSchema0.replaceAll("T_CLASS", "T_CLASS_FROM_SCHOOL_" + schoolid);
//				getServletContext().log(triggerSchema1);
				triggerSchema += "\n" + triggerSchema1;
//				stmt.executeUpdate(triggerSchema1); // Create new trigger.
			}
			getServletContext().log(triggerSchema);
			stmt.executeUpdate(triggerSchema);
			rsTrigger.close();

			conn.commit();
		}
	}
}
