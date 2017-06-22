package com.bochum.neteye.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DetailServlet extends HttpServlet {
	private static final long serialVersionUID = -1779650997215496331L;

	public void init() throws ServletException {

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Content-Type", "application/json; charset=UTF-8");
		String filename = "/WEB-INF//test/resultdata_detail.json";

		InputStream is = getServletContext().getResourceAsStream(filename);
		if (is != null) {
			InputStreamReader isr = new InputStreamReader(is, "UTF-8");
			BufferedReader reader = new BufferedReader(isr);
			PrintWriter pw = response.getWriter();

			String text;
			while ((text = reader.readLine()) != null) {
				pw.println(text);
			}
		}

	}

	public void destroy() {
		// do nothing.
	}
}