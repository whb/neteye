var bochumPageManager = {
	gotoPage : function (page) {
		document.location.hash='#' + page.url + "?" + bochum.json2String($.extend({}, page.param, {_gotoPage:"goto"}));
	},
	changePage : function (page) {
		loadURL(page.url + "?" + bochum.json2String($.extend({}, page.param, {_gotoPage:"change"})), $('#' + page.target));
	},
	showTitle : function (pages) {
		var pageTitle = $("#_page-title");
		pageTitle.empty();

		$.each(pages, function (idx, pg) {
			if (pg.pageType == "S") {
				pageTitle.append(pg.pageName);
			} else {
				$("<a href='javascript:void(0);'>"+pg.pageName+"</a>").appendTo(pageTitle)
				.bind("click", function() {document.location.hash='#' + pg.url + bochumPageManager._getParamString(pg);});
			}
			if (idx == pages.length-1) {
				if (pg.pageType != "S") { // 初始化页面导航
					$("#_page-navigation").empty();
				}
			} else {
				pageTitle.append("/");
			}
		});
	},
	_getParamString : function (pg) {
		if (pg.param != undefined && pg.param != "") {
			return "?" + pg.param;
		}
		return "";
	}
}
