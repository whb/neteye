package com.bochum.top.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bochum.exception.MessageException;
import com.bochum.security.UserInfo;
import com.bochum.top.service.LoginService;

/**
 * CopyRright (c)2015-xxxx:博琛软件 Author:liuzhaojun Create Date:2015-10-16
 */
@Controller
@RequestMapping(value = "/")
public class TopController {

	@Autowired
	private LoginService loginService;

	@Autowired
	private HttpServletRequest request;

	@Autowired
	private Config config;

	public TopController() {
		super();
		System.out.println("TopController");
	}

	@RequestMapping(value = "/", produces = "text/html;charset=UTF-8")
	public String toIndex(Map<String, Object> map) {
		return "index.html";
	}

	@RequestMapping(value = "/search", produces = "text/html;charset=UTF-8")
	public String toSearchResult(Map<String, Object> map) {
		map.put("currQ", request.getParameter("q"));
		return "result.html";
	}

	@RequestMapping(value = "/index", produces = "text/html;charset=UTF-8")
	public String toIndex1(Map<String, Object> map) {
		return toIndex(map);
	}

	@RequestMapping(value = "/login", produces = "text/html;charset=UTF-8")
	public String toLogin(Map<String, Object> map) {
		map.put("login", new UserInfo());
		return "login.html";
	}

	@RequestMapping(value = "/doLogin", produces = "text/html;charset=UTF-8")
	public String doLogin(UserInfo user, Map<String, Object> map) {

		try {
			HttpSession sess = request.getSession(true);
			if (!StringUtils.defaultString(user.getIdentifyCodeImg())
					.equalsIgnoreCase((String) sess.getAttribute("identifyCode"))) {
				throw new MessageException("验证码不正确");
			}

			loginService.login(user);

		} catch (MessageException e) {
			map.put("login", user);
			map.put("errorMessage", e.getMessage());
			return "login.html";
		}
		return "redirect:/index";
	}

	@RequestMapping(value = "/logout", produces = "text/html;charset=UTF-8")
	public String toLogout(Map<String, Object> map) {
		loginService.logout();
		map.put("login", new UserInfo());
		return "login.html";
	}

	/**
	 * 获取开票地(区)
	 * 
	 * @param dataInfo
	 * @return json对象
	 */
	@RequestMapping(value = "/getJson", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String getJson(String url) {
		String rtnVal = "{}";
		CloseableHttpClient httpclient = HttpClients.createDefault();
		HttpGet httppost = new HttpGet(url);
		try {
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				HttpEntity entity = response.getEntity();
				if (entity != null) {
					rtnVal = EntityUtils.toString(entity, "UTF-8");
				}
			} finally {
				response.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 关闭连接,释放资源
			try {
				httpclient.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return rtnVal;
	}
}
