package com.bochum.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.bochum.top.service.LoginService;

public class UserLoginHandlerInterceptor extends HandlerInterceptorAdapter {
	

	@Autowired
	private LoginService loginService;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		String url = request.getRequestURI();

		HttpSession sess = request.getSession(true);
		if (sess == null) {
			throw new UserLoginException();
		}

		// 用户登录验证
		if (!loginService.isLogined()) {
			throw new UserLoginException();
		}

		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		super.postHandle(request, response, handler, modelAndView);
		if (modelAndView != null) {
			modelAndView.addObject("loginUser", loginService.getLoginUser());
			modelAndView.addObject("lastMenu", request.getSession().getAttribute("lastMenu"));
		}
	}

}
