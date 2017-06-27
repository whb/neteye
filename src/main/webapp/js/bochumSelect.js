(function($) {
    // 参数选项设置
    var defaults = {
		placeholder : "请输入",
	    minimumInputLength: 1, 
		minLength : 2,
		dataUrl : '',
		initValue : "",
		datas : [],
		delay : 1000,
		idField : 'id',
		textField : 'name',
		minWidth : 200,
		displayType : "combobox",
		required : "false",
		dataParam : {},
		maxSelect : undefined
    };

    // 方法集合
    var methods = {
		_init: function (options, param) {
			return this.each(function () {
				var $this = $(this);
				var opts = $.extend({}, defaults, options || {});
				$this.data("options", opts);//保存设置到对象数据
				$this.data("param", param);//保存设置到对象数据
				methods._create($this);
				$this.bind("change", methods._onChange);//绑定变更事件
			});
		},
		getValue : function () {
			var $select = $(this);
			return $select.find("select").val();
		},
		getText : function () {
			var $select = $(this);
			return $select.find("select").text();
		},
		getSelected : function () {
			var $select = $(this);
			var selectObject = $select.find("option:selected");
			var obj = {value:selectObject.attr("value"), text:selectObject.text()};
			return obj;
		},
		setValue : function (value) {
			var $select = $(this);
			$select.data("options").initValue = value;// 解决设值时控件还没有初始化完成的问题
			$select.find("select").select2().val(value).trigger("change");
		},
		refresh : function(value) {
			var $select = $(this);
			var opts = $select.data("options");
			opts.initValue = value;
			methods._create($select);
		},
		_create : function($select) {
			var opts = $select.data("options");
			var param = $select.data("param");
			if (opts.dataUrl == "") return "create select failed url";
			var param = $.extend({}, param);
			bochum.ajax(
					opts.dataUrl,
					param,
				function success(data) {
					$select.html("");
					if (opts.displayType == "combobox") {
						var sel = $('<select name="'+opts.id+'" style="width:100%" class="form-control bochumInputCombobox hide"></select>');
						if (!opts.required || opts.required == "false") {
							var v = {};
							v[opts.idField] = "_bochumSelectClear";
							v[opts.textField] = "-清空-";
							data.datasOut.unshift(v);
						}
						sel.on("change", function() {
							if (sel.val() == "_bochumSelectClear" || sel.val() == "-清空-") {
								sel.select2().val("").trigger('change');
							}
							if (opts.onChange != undefined && opts.onChange != "") {
								eval(opts.onChange);
							}
						});
//						if (!$select.is(":hidden") && $select.width() < opts.minWidth) {
//							$select.css("width", opts.minWidth);
//						}
						var sel = sel.appendTo($select).select2({
							allowClear: true,
//							maximumSelectionLength: opts.maxSelect,
							multiple:false,
							tags: true,
							id : function(rs) {
						        return rs[opts.idField];
						    },
							data : $.map(data.datasOut, function(data, index) {
								if (data.text == undefined)
								data.text = data[opts.textField];
								data.sid = data.id;
								data.id = data[opts.idField];
								return data;
							})
						}).val(opts.initValue).trigger('change');
						$select.data("selectObject", sel);
						$select.data("select2", sel);
					}
				},
				function fail(data) {

				}
			);
		}
    }

    // 插件申明,写法固定
    $.fn.bochumSelect = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods._init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.bochumSelect');
        }
    };
})(jQuery);
