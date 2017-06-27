var bochumTable = {
	reload : function($table, data, callback, settings) {
		var query = $table.data("query");
		if (query == undefined) return [];
        //手动控制遮罩
//        $wrapper.spinModal();
        //封装请求参数
        var param = query.param;
//        var param = userManage.getQueryCondition(data);
		//获取表格参数
		param = $.extend({start:data.start, draw:data.draw, length:data.length}, param);
		param.orderBy = "";
		for (i = 0; i < data.order.length; i++) {
			if (param.orderBy.length > 0) param.orderBy += ", ";
			param.orderBy += (data.columns[data.order[i].column].data + " " + data.order[i].dir);
		}

		bochum.loadData(query.url, param, function (data) {
			//封装返回数据，这里仅演示了修改属性名
			var returnData = {};
			returnData.draw = data.dataIn.draw;//这里直接自行返回了draw计数器,应该由后台返回
			returnData.recordsTotal = data.totalRow;
			returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
			returnData.data = data.datasOut;
			//关闭遮罩
//				$wrapper.spinModal(false);
			//调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
			callback(returnData);
		}, function(XMLHttpRequest, textStatus, errorThrown) {
			
		});
	}
}