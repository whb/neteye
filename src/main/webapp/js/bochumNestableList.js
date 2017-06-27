
(function($) {
    // 参数选项设置
    var defaults = {    
    	id:"id", 								// 主键
    	pid:"parentId", 						// 父键
    	name:"name", 							// 显示名称
    	orderNum:"orderNum", 					// 排序字段
    	moveH:true, 							// 可横向拖拽
    	moveV:true,								// 可纵向拖拽
    	getControlState:function ($item, data){return 0}		// 详细活性非活性;0:显示活性;1:不显示;2显示非活性
    };

    // 方法集合
    var methods = {
		init: function (options) {
			return this.each(function () {
				var $this = $(this);
				var opts = $.extend({}, defaults, options || {}, options);
				opts.canDrag = ($this.attr("urlSave") != undefined && $this.attr("urlSave") != "");
				$this.data("options", opts);//保存设置到对象数据
				$this.nestable(opts);
				$this.bind("change", methods._onChange);//绑定变更事件
			});
		},
		setControlCallback : function (callback) {
			var $this = $(this);
			$this.data("options").getControlState = callback;
		},
		_onChange : function (e) {
			var $item = $(this);
			var options = $item.data("options");
			var pData = $(e.target).parents(".dd-item").data("data");//获取父节点数据
			var data = $(e.target).data("data");//获取节点数据
//				if (data._parentObj != undefined) { //数据解绑上级节点
//					data._parentObj._children.splice($.inArray(data, data._parentObj._children), 1); // 从父节点移除
//				}
			if (pData == undefined) {//没有父节点数据,清空父节点信息
				data[options.pid] = "";
				data._pId = "";
//					data._parentObj = undefined;
			} else {//有父节点信息,更新父节点信息
				data[options.pid] = pData._id;
				data._pId = pData._id;
//					data._parentObj = pData;
			}

			$(e.target).attr("data-pid", data._pId);// 更新元素属性pid为新pid

			if ($item.attr("urlSave") != "") {//如果设置了保存地址,保存修改内容
				var currLvlList = []; // 变更对象集合
				if (data._pId == undefined || data._pId == "") {
					currLvlList = $.find("[data-pid='"+data._pId+"']");//父节点不存在时,获取所有根节点
				} else {
					currLvlList = $(e.target).parents(".dd-item").find("[data-pid='"+data._pId+"']");//父节点存在时,获取所有父节点的子节点
				}
				// 遍历更新变更对象
				$.each(currLvlList, function (idx, saveItem) {
					var $saveItem = $(saveItem);
					bochum.mask("保存中,请稍等...");
					var saveData = $.extend({}, $saveItem.data("data"));// 创建保存数据
					saveData._children = null; // 去除客户端加载属性
					saveData._orderNum = idx; // 重新排序
					saveData[options.orderNum] = idx;
					$.ajax({
						url : $item.attr("urlSave"),
						type : 'POST',
						cache : false,
						data : bochum.json2String(saveData),
						dataType : 'json',
						success : function(sdata) {
							bochum.closeMask();
							bochum.json2area(sdata.dataOut, $saveItem.find("div.dd3-content:first"));// 刷新显示内容
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							bochum.closeMask();
							bochum.showErrorMessage(errorThrown);
							methods.reload($item.attr("id"));
						}
					});
				});
			}
		},
		reload : function (query) {
			if (query == undefined) return ;//参数获取错误返回
			var $item = $(this);// 获取元素
//			var query = $item.data("query");//获取元素参数
			var options = $item.data("options");
			var param = $.extend({}, query.param);
			bochum.loadData(query.url, param, function (data) {
				$item.empty();
				$item.append(methods._makeHtml($item, bochum.list2tree(data.datasOut, options)));	// 刷新组件
			}, function(XMLHttpRequest, textStatus, errorThrown) {
			});
		},
		_makeHtml : function ($item, data) { // 创建展示代码
			var html = $('<ol class="dd-list"></ol>');
			if (data instanceof Array) {
				$.each(data,function(n,value){
					html.append(methods._makeItem($item, value));// 添加子元素
				});
			} else {
				html.append(methods._makeItem($item, data));// 添加子元素
			}
			return html;
		},
		_makeItem : function ($item, data) {	// 创建子元素展示代码
			var opts = $item.data("options");
			var html = $('<li class="dd-item dd3-item" data-id="' + data._id + '" data-pid="' + data._pId + '" data-order="' + data._orderNum + '"></li>');
			html.data("data", data);
			if (data._children != undefined && data._children.length > 0) {// 添加折叠展开按钮
				var itemNestable = $item.data("nestable");
				$(itemNestable.options.expandBtnHTML).appendTo(html).hide();// 默认展开 隐藏折叠按钮
				html.append($(itemNestable.options.collapseBtnHTML));
			}
			// 添加详细迁移按钮
			if ($item.attr("urlDetail") != "") {
				var sts = opts.getControlState($item, data);
				var btn = $('<a class="dd-item-detail" href="javascript:void(0);" onclick="'+$item.attr("urlDetail")+'($(this).data(\'data\'));"><i class="'+$item.attr("detailIcon")+'"></i></a>')
				.appendTo(html).data("data", data);
				if (sts == 1) {
					btn.hide();
				} else if (sts == 2) {
					btn.attr("disabled","disabled"); 
				}
			}
			html.append($('<div class="dd-handle dd3-handle">&nbsp;</div>'));
			// 展示内容
			var template = $("#" + $item.attr("id") + "Template").children().clone();
			bochum.json2area(data, template);
			template.appendTo(html);
//			// 设置工具条
//			template.toolbar( {
//				content: '#toolbar-' + $item.attr("id"),
//				position: 'right',
//				style: 'primary',
//				event: 'click',
//				hideOnClick: true
//			}).on('toolbarShown', "", data, function( event ) {
//				$(this).toolbar("getToolbarElement").find("a").data("data", event.data);
//			});
			// 添加子元素
			if (data._children != undefined && data._children.length > 0) {
				template.addClass("dd-content-parent");
				var childrenOl = $('<ol class="dd-list"></ol>').appendTo(html);
				$.each(data._children,function(n,value){
					childrenOl.append(methods._makeItem($item, value));
				});
			}
			return html;
		}
    }

    // 插件申明,写法固定
    $.fn.bochumNestableList = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.bochumNestableList');
        }
    };
})(jQuery);
