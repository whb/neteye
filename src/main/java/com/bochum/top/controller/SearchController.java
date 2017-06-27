package com.bochum.top.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * CopyRright (c)2015-xxxx:博琛软件 Author:liuzhaojun Create Date:2015-10-16
 */
@Controller
@RequestMapping(value = "/search")
public class SearchController {

	@Autowired
	private HttpServletRequest request;

	@Autowired
	private Config config;

	public SearchController() {
		super();
	}

	/**
	 * @return json对象
	 */
	@RequestMapping(value = "/hostwebcount", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String hostwebcount() {
		return getJson(config.searchHostwebcount);
	}
	/**
	 * @return json对象
	 */
	@RequestMapping(value = "/sum", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String sum() {
		return getJson(config.searchSumUrl);
	}
	/**
	 * @return json对象
	 */
	@RequestMapping(value = "/detail", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String detail() {
		return getJson(config.searchDetailUrl);
	}
	
	private String getJson(String url) {
		String page = StringUtils.defaultString(request.getParameter("page"));
		String type = StringUtils.defaultString(request.getParameter("type"));
		String keyword = StringUtils.defaultString(request.getParameter("keyword"));
		
		String rtnVal = "{}";
		CloseableHttpClient httpclient = HttpClients.createDefault();
		HttpGet httppost = new HttpGet(url + "?currpage="+page+"&type="+type+"&keyword="+keyword);
		try {
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				HttpEntity entity = response.getEntity();
				if (entity != null) {
					rtnVal = EntityUtils.toString(entity, "UTF-8");
					JSONObject jo = new JSONObject(rtnVal);
					jo.put("currpage", StringUtils.defaultString(page, "1"));
					rtnVal = jo.toString();
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
