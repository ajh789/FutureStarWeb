package com.ajh.futurestar.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class SQLiteDemoServlet
 */
@WebServlet("/dbdemo")
public class SQLiteDemoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SQLiteDemoServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse rsp) 
			throws ServletException, IOException {
		process(req, rsp);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse rsp) 
			throws ServletException, IOException {
	}
	
	private void process(HttpServletRequest req, HttpServletResponse rsp) 
			throws ServletException, IOException {
		rsp.setContentType("text/plain; charset=UTF-8");
		PrintWriter out = rsp.getWriter();
		out.println("²éÑ¯½á¹û£º");
		query(out, out);
	}
	
	private void query(PrintWriter out, PrintWriter err) {
		Connection c = null;
	    Statement stmt = null;
	    out.println(this.getServletContext().getRealPath("/"));
	    out.println(this.getServletContext().getRealPath(""));
	    try {
	      Class.forName("org.sqlite.JDBC");
	      String dburl = this.getServletContext().getRealPath("/") + "\\..\\..\\webapps_db\\futurestar.db";
	      c = DriverManager.getConnection("jdbc:sqlite:" + dburl);
	      c.setAutoCommit(false);
	      out.println("Opened database successfully");

	      stmt = c.createStatement();
	      ResultSet rs = stmt.executeQuery( "SELECT * FROM T_ADMIN;" );
	      while ( rs.next() ) {
	         int id           = rs.getInt("ID");
	         String name      = rs.getString("NAME");
	         String password  = rs.getString("PASSWORD");
	         int privilege    = rs.getInt("PRIVILEGE");
	         boolean islocked = rs.getBoolean("ISLOCKED");
	         out.println( "ID = " + id );
	         out.println( "NAME = " + name );
	         out.println( "PASSWORD = " + password );
	         out.println( "PRIVILEGE = " + privilege );
	         out.println( "ISLOCKED = " + islocked );
	         out.println();
	      }
	      rs.close();
	      stmt.close();
	      c.close();
	    } catch ( Exception e ) {
	      err.println( e.getClass().getName() + ": " + e.getMessage() );
	      return;
	    }
	    out.println("Operation done successfully");
	}

}
