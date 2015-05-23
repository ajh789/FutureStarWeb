package com.ajh.futurestar.web.servlet;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

/**
 * Servlet implementation class FileUploadServlet
 */
@WebServlet(description = "File uploader", urlPatterns = { "/fileupload.do" })
@MultipartConfig
public class FileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = 
			Logger.getLogger(FileUploadServlet.class.getCanonicalName());
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public FileUploadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		response.setContentType("text/html; chareset=UTF-8");

//		final String filePath = request.getParameter("destination");
		final String filePath = getServletContext().getRealPath(File.separator) + File.separator + "fileuploads";
		final Part filePart = request.getPart("file"); // <input type="file" name="file" />
		final String fileName = getFileName(filePart);

		OutputStream out = null;
		InputStream fileContent = null;
		final PrintWriter writer = response.getWriter();
		
		try {
			out = new FileOutputStream(new File(filePath + File.separator + fileName));
			fileContent = filePart.getInputStream();
			
			int nRead = 0;
			final byte[] bytes = new byte[1024];
			
			while ((nRead = fileContent.read(bytes)) != -1) {
				out.write(bytes, 0, nRead);
			}
			
			writer.println("New file " + fileName + " created at " + filePath);
			logger.log(Level.INFO, "File{0} being uploaded to {1}", new Object[]{fileName, filePath});
		} catch (FileNotFoundException fne) {
			writer.println("You either did not specify a file to upload or are "
					+ "trying to upload a file to a protected or nonexistent "
					+ "location.");
			writer.println("<br/> ERROR: " + fne.getMessage());

			logger.log(Level.SEVERE, "Problems during file upload. Error: {0}", 
					new Object[]{fne.getMessage()});
		} finally {
			if (out != null) {
				out.close();
			}
			if (fileContent != null) {
				fileContent.close();
			}
			if (writer != null) {
				writer.close();
			}
		}
	}

	private String getFileName(final Part part) {
		final String partHeader = part.getHeader("content-disposition");
		logger.log(Level.INFO, "Part Header = {0}", partHeader);

		// Data sample from HTTP:
		//   Content-Disposition: form-data; name="file"; filename="sample.txt"
		//   Content-Type: text/plain
		//   
		//   Data from sample file
		for (String content : part.getHeader("content-disposition").split(";")) {
			if (content.trim().startsWith("filename")) {
				return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
			}
		}

		return null;
	}
}
