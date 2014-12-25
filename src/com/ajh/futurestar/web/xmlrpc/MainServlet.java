package com.ajh.futurestar.web.xmlrpc;

import javax.servlet.annotation.WebServlet;
import org.apache.xmlrpc.XmlRpcException;
import org.apache.xmlrpc.XmlRpcRequest;
import org.apache.xmlrpc.common.XmlRpcHttpRequestConfig;
import org.apache.xmlrpc.server.AbstractReflectiveHandlerMapping;
import org.apache.xmlrpc.server.PropertyHandlerMapping;
import org.apache.xmlrpc.server.XmlRpcHandlerMapping;
import org.apache.xmlrpc.webserver.XmlRpcServlet;

/**
 * Servlet implementation class MainServlet
 */
@WebServlet("/MainServlet")
public class MainServlet extends XmlRpcServlet {

	private static final long serialVersionUID = -3738065307566016605L;

	private boolean isAuthenticated(String pUserName, String pPassword) 
	{
		return "foo".equals(pUserName) && "bar".equals(pPassword);
	}

	protected XmlRpcHandlerMapping newXmlRpcHandlerMapping() throws XmlRpcException 
	{
		PropertyHandlerMapping mapping = (PropertyHandlerMapping)super.newXmlRpcHandlerMapping();
		AbstractReflectiveHandlerMapping.AuthenticationHandler handler = new AbstractReflectiveHandlerMapping.AuthenticationHandler() 
		{
			@Override
			public boolean isAuthorized(XmlRpcRequest pRequest) 
			{
				XmlRpcHttpRequestConfig config = (XmlRpcHttpRequestConfig)pRequest.getConfig();
				return isAuthenticated(config.getBasicUserName(), config.getBasicPassword());
			};
		};
		mapping.setAuthenticationHandler(handler);
		return mapping;
	}
	
	public boolean login(String username, String password)
	{
		return username.equals("foo") && password.equals("bar");
	}
}
