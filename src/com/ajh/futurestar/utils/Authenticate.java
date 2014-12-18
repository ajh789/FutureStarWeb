package com.ajh.futurestar.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.http.HttpSession;

import com.ajh.futurestar.common.Attribute;
import com.ajh.futurestar.common.DbConn;

public class Authenticate {
//	private static String dburl = "C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps_db\\futurestar.db";
	public static boolean authenticate(String username, String password, String role, HttpSession session) 
			throws ClassNotFoundException, SQLException {
		Class.forName("org.sqlite.JDBC");
		Connection c = DriverManager.getConnection("jdbc:sqlite:" + DbConn.DB_URL);
		c.setAutoCommit(false);

		Statement stmt = c.createStatement();
		String query = null;
		if (role.equalsIgnoreCase("admin")) {
			// Administrator logs in with NAME.
			query = "SELECT * FROM T_ADMIN   WHERE NAME='" + username + "';";
		} else if (role.equalsIgnoreCase("teacher")) {
			// Teacher logs in with ID, i.e. mobile phone number.
			query = "SELECT * FROM T_TEACHER WHERE NAME='" + username + "';";
		} else if (role.equalsIgnoreCase("parent")) {
			// Parent logs in with ID, i.e. mobile phone number.
			query = "SELECT * FROM T_PARENT  WHERE NAME='" + username + "';";
		} else {
			throw new SQLException("Invalid user's role '" + role + "' got.");
		}
		ResultSet rs = stmt.executeQuery(query);
		boolean retcode = false;
		if (rs.next()) {
			int id = rs.getInt("ID");
			String name = rs.getString("NAME");
			String passwd = rs.getString("PASSWORD");
			int privilege = rs.getInt("PRIVILEGE"); // Field PRIVILEGE is useless in T_PARENT at the moment.
			boolean islocked = rs.getBoolean("ISLOCKED");
			if (password.equals(passwd)) {
				retcode = true;
				session.setAttribute(Attribute.ATTR_USER_ROLE, role);
				session.setAttribute(Attribute.ATTR_USER_ID, Integer.valueOf(id));
				session.setAttribute(Attribute.ATTR_USER_NAME, name);
				session.setAttribute(Attribute.ATTR_USER_PRIVILEGE, Integer.valueOf(privilege));
				session.setAttribute(Attribute.ATTR_USER_ISLOCKED, Boolean.valueOf(islocked));
			}
		}

		rs.close();
		stmt.close();
		c.close();

		return retcode;
	}
}
