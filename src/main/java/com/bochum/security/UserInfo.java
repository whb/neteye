package com.bochum.security;

public class UserInfo {
	private String pwd = null;
	
	private String identifyCodeImg = null;

	private String loginName = null;

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getIdentifyCodeImg() {
		return identifyCodeImg;
	}

	public void setIdentifyCodeImg(String identifyCodeImg) {
		this.identifyCodeImg = identifyCodeImg;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	
}
