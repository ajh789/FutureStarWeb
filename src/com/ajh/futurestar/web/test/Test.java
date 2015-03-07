package com.ajh.futurestar.web.test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.ajh.futurestar.web.common.DbConn;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Connection conn = null;
		try {
			conn = DbConn.getDbConnection();
		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
			return;
		}
		Statement stmt = null;
		try {
			stmt = conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
			return;
		}

		String schoolid = "9A2DDFFC4123036A116253475CF0FD57";

		String qClassTableSchema = "SELECT * FROM sqlite_master WHERE type='table' AND name='T_CLASS';";
		ResultSet rsTable = null;
		try {
			rsTable = stmt.executeQuery(qClassTableSchema);
			if (rsTable.next()) { // "if" statement due to only one SQL table T_CLASS.
				String tableSchema0 = rsTable.getString("sql") + ';'; // Get schema of table T_CLASS.
				String tableSchema1 = tableSchema0.replaceAll("T_CLASS", "T_CLASS_FROM_SCHOOL_" + schoolid);
				System.out.println(tableSchema1);
				stmt.executeUpdate(tableSchema1); // Create new SQL table.
			} else {
				// TODO
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rsTable.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		String qClassTableTriggersSchema = "SELECT * FROM sqlite_master WHERE type='trigger' AND tbl_name='T_CLASS';";
		ResultSet rsTrigger = null;
		try {
			rsTrigger = stmt.executeQuery(qClassTableTriggersSchema);
			String triggerSchema = "";
			while (rsTrigger.next()) { // "while" statement due to possibly more than 1 triggers.
				String triggerSchema0 = rsTrigger.getString("sql") + ';'; // Get schemas of triggers corresponding to T_CLASS.
				String triggerSchema1 = triggerSchema0.replaceAll("T_CLASS", "T_CLASS_FROM_SCHOOL_" + schoolid);
				triggerSchema += triggerSchema1;
				System.out.println(triggerSchema1);
//				stmt.executeUpdate(triggerSchema1); // Create new trigger.
			}
			stmt.executeUpdate(triggerSchema);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rsTrigger.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		try {
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		try {
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
