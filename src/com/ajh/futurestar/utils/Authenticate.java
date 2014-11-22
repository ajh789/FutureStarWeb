package com.ajh.futurestar.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.http.HttpSession;

public class Authenticate {
	private static String dburl = "C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps_db\\futurestar.db";
	public static boolean authenticate(String username, String password, String role, HttpSession session) 
			throws ClassNotFoundException, SQLException {
		Connection c = null;
		Statement stmt = null;

		Class.forName("org.sqlite.JDBC");
		c = DriverManager.getConnection("jdbc:sqlite:" + dburl);
		c.setAutoCommit(false);

		stmt = c.createStatement();
		String query = null;
		if (role.equalsIgnoreCase("admin")) {
			// Admin logs in with NAME.
			query = "SELECT * FROM T_ADMIN WHERE NAME='" + username + "';";
		} else if (role.equalsIgnoreCase("teacher")) {
			// Teacher logs in with ID.
			query = "SELECT * FROM T_TEACHER WHERE ID=" + username + ";";
		} else if (role.equalsIgnoreCase("parent")) {
			// Parent logs in with ID.
			query = "SELECT * FROM T_PARENT WHERE ID=" + username + ";";
		} else {
			throw new SQLException("Invalid user's role '" + role + "' got.");
		}
		ResultSet rs = stmt.executeQuery(query);
		boolean retcode = false;
		if (rs.next()) {
			int id = rs.getInt("ID");
			String name = rs.getString("NAME");
			String passwd = rs.getString("PASSWORD");
//			if (role.equalsIgnoreCase("admin") || role.equalsIgnoreCase("teacher")) {
//				int privilege = rs.getInt("PRIVILEGE");
//			}
			boolean islocked = rs.getBoolean("ISLOCKED");
			if (password.equals(passwd)) {
				retcode = true;
				session.setAttribute("role", role);
				session.setAttribute("userid", id);
				session.setAttribute("username", name);
				session.setAttribute("islocked", islocked);
			}
		}
		rs.close();
		stmt.close();
		c.close();

		return retcode;
	}
}
