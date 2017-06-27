$.extend(true, $.fn.dataTable.defaults, {
	autoWidth : true,
	paging : true,
	pageLength : 25,
	language : {
		processing : "处理中...",
		search: 		'<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>',
		lengthMenu: 	"_MENU_",
		info:           '显示第 <span class="txt-color-darken">_START_</span> 至 <span class="txt-color-darken">_END_</span> ，共 <span class="text-primary">_TOTAL_</span> 项',
		infoEmpty: 		"无记录",
		infoFiltered:   "(由 _MAX_ 项结果过滤)",
		infoPostFix : 	"",
		loadingRecords: "载入中...",
		zeroRecords: 	"没有匹配结果",
		emptyTable: 	"表中数据为空",
		paginate : {
			first:      "首页",
		    previous:   '<i class="fa fa-chevron-left"></i>',
		    next:       '<i class="fa fa-chevron-right"></i>',
		    last:       "末页"
		},
		aria: {
		    sortAscending:  ": 以升序排列此列",
		    sortDescending: ": 以降序排列此列"
		}
	},
	// https://datatables.net/reference/option/dom
//	dom: "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>"+
//	"t"+
//	"<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
	
	dom: "t"+
	"<'dt-toolbar-footer'<'col-sm-1 col-xs-1 'l><'col-sm-5 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",

});
