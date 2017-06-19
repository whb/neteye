package com.bochum.servlet;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class SearchServlet extends HttpServlet {
 
   private String message;

   public void init() throws ServletException {
      message = "Hello World";
   }

   public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

      RequestDispatcher requestDispatcher = request.getRequestDispatcher("/result.jsp");
      requestDispatcher.forward(request, response);
   }

   public void destroy() {
      // do nothing.
   }
}