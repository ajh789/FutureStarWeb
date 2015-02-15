package com.ajh.futurestar.web.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ajh.futurestar.web.common.Return;

/**
 * Servlet implementation class ManageClassTablesServlet
 */
public abstract class ManageServlet extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = -7824520302314585816L;
	/**
     * @see HttpServlet#HttpServlet()
     */
    public ManageServlet() {
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
		process(req, rsp);
	}

	protected void process(HttpServletRequest req, HttpServletResponse rsp)
			throws ServletException, IOException
	{
		Return ret = new Return();
		doBusiness(req, rsp, ret);
		generatePage(rsp, ret);
	}

	protected void generatePage(HttpServletResponse rsp, Return result) throws IOException
	{
		rsp.setContentType("application/json; charset=UTF-8");
		PrintWriter out = rsp.getWriter();
		generatePageBody(out, result);
	}

	protected abstract void generatePageBody(PrintWriter out, Return result);
	protected abstract void doBusiness(HttpServletRequest req, HttpServletResponse rsp, Return ret);
}
