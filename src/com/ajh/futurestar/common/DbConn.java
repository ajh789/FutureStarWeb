package com.ajh.futurestar.common;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbConn {
	public static final String DB_URL = "C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps_db\\futurestar.db";

	// Callers are responsible for close connection.
	public static Connection getDbConnection()
			throws ClassNotFoundException, SQLException
	{
		Class.forName("org.sqlite.JDBC");
		Connection c = DriverManager.getConnection("jdbc:sqlite:" + DB_URL);
		c.setAutoCommit(false);
	
		return c;
	}
}
