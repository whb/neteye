
(function($) {

    // 参数选项设置
    var defaults = {
    };
    
    function _create($this, opts, query) {
		if (query == undefined) return ;//参数获取错误返回
		var param = $.extend({}, query.param);
		bochum.loadData(query.url, param, function (data) {
			var treeData = bochum.list2tree(data.datasOut);
			$this.empty();
			_makeHtml($this, opts, treeData);	// 刷新组件
		}, function(XMLHttpRequest, textStatus, errorThrown) {
			
		});
    }
    
    function _makeHtml($this, opts, datas) {
		var itemId = $this.attr("id");
		$.each(datas, function (idx, data) {
			// 展示内容
			var template = $('#_' + itemId + "_content").clone();
			bochum.json2area(data, template);
			var $row = $(template.children());
			$this.append($row);

			$row.find("[rel=tooltip]").tooltip();
			$row.find("._bochum_btn").data("data", data);

			if (typeof(opts.displayControl) == "function") {
				opts.displayControl($this, $row, data, opts);
			}
			
			if (data._children) {
				_makeHtml($this, opts, data._children);
			}
		});
    }

    // 方法集合
    var methods = {
		_init: function (options) {
			return this.each(function () {
				var $this = $(this);
				var opts = $.extend({}, defaults, options || {});
				$this.data("options", opts);//保存设置到对象数据
			});
		},
		reload: function (query) {
			var $this = $(this);
			var opts = $this.data("options");
			_create($this, opts, query);
		},
		setDisplayControl : function (fun) {
			var $this = $(this);
			var opts = $this.data("options");
			opts.displayControl = fun;
		}
    }

    // 插件申明,写法固定
    $.fn.bochumListView = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods._init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.bochumListView');
        }
    };
})(jQuery);
