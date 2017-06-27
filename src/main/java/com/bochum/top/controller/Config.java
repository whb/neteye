package com.bochum.top.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Config {
	@Value("${search.detail.url}")
	public String searchDetailUrl;
	@Value("${search.sum.url}")
	public String searchSumUrl;
	@Value("${search.hostwebcount.url}")
	public String searchHostwebcount;
}
