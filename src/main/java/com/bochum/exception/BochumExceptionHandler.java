package com.bochum.exception;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerExceptionResolverComposite;

import com.bochum.security.UserLoginException;

public class BochumExceptionHandler extends HandlerExceptionResolverComposite {

	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
		ex.printStackTrace();
		Map<String, Object> model = new HashMap<String, Object>();
		request.setAttribute("ex", ex);
		if (request.getRequestURI().endsWith("/json")) {
			if (ex instanceof UserLoginException) {
				return new ModelAndView("forward:/login", model);
			}
			return new ModelAndView("forward:/jsonError", model);
		} else {
			if (ex instanceof UserLoginException) {
				return new ModelAndView("forward:/login", model);
			}
			return new ModelAndView("forward:/htmlError", model);
		}
	}

}
