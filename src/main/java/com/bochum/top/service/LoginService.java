package com.bochum.top.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bochum.security.UserInfo;
import com.bochum.security.UserLoginException;
import com.bochum.top.controller.Config;

/**
 * @author Administrator
 *
 */
@Service
public class LoginService {

	@Autowired
	private HttpServletRequest httpServletRequest;
	
	@Autowired
	private Config config;

	public HttpSession getSession() {
		return httpServletRequest.getSession();
	}

	public void login(UserInfo login) throws UserLoginException {

		setLoginUser(login);
	}

	public void logout() {
		getSession().removeAttribute("loginUser");
		getSession().invalidate();
	}

	public UserInfo getLoginUser() {
		try {
			return (UserInfo)getSession().getAttribute("loginUser");
		} catch (Exception e) {
			throw new UserLoginException(e);
		}
	}

	public boolean isLogined() {
		return getLoginUser() != null;
	}

	public void setLoginUser(UserInfo user) {
		getSession().setAttribute("loginUser", user);
	}
}
