package com.ajh.futurestar.web.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ajh.futurestar.web.common.DbConn;

@WebServlet(name = "GetSchoolListServlet", description = "GetSchoolListServlet", urlPatterns = { "/getschools.do" })
public class BizSchoolListGetterServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		process(req, rsp);
	}
	
	private void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
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
			try {
				conn.close();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			return;
		}

		String term = (String)req.getParameter("term");
		getServletContext().log("Term is " + term);

		String query = "select hex(ID) as ID, NAME from T_SCHOOL";
		if (term != null && !term.equals("")) {
			query += " where NAME like '%"+ term + "%'";
		}
		query += " order by CREATION asc limit 5;";
		getServletContext().log("Query is " + query);

		ResultSet rs = null;
		try {
			rs = stmt.executeQuery(query);
		} catch (SQLException e1) {
			e1.printStackTrace();
		}

		JSONArray array = new JSONArray();
		try {
			while (rs.next()) {
				JSONObject obj = new JSONObject(); // Item in array.
				obj.put("ID", rs.getString("ID"));
				obj.put("NAME", rs.getString("NAME"));
				array.put(obj);
			}
		} catch (JSONException | SQLException e1) {
			e1.printStackTrace();
		}

		try {
			rs.close();
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		rsp.setContentType("application/json; charset=UTF-8");
		getServletContext().log(array.toString());
		rsp.getWriter().println(array.toString());
	}
}
