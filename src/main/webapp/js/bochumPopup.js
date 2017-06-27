(function($) {
    // 参数选项设置
    var defaults = {
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
				$this.on("change", methods._onChange);//绑定变更事件
			});
		},
		_createDialog : function ($this) {
			var opts = $this.data("options");
			var id = opts.id;
			var dialog = $("#_" + id + "Dialog");
			if (dialog.length == 0) {
				var dialog = $('<div class="modal fade" id="_' + id + 'Dialog">' +
						'<div class="modal-dialog">' +
							'<div class="modal-content">' +
								'<div class="modal-header">' +
					                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
					                '<h4 class="modal-title">选择</h4>' +
					            '</div>' +
					            '<div class="modal-body"></div>' +
					        '</div><!-- /.modal-content -->' +
					    '</div><!-- /.modal-dialog -->' +
					'</div>').appendTo($("body"));
			}
			$this.data("_dialog", dialog);
		},
		_createInputs : function ($this) {
			var opts = $this.data("options");
			var id = opts.id;
			$this.append("<input type='hidden' class='_bochum_popup_ids' id='"+opts.id+"' name='"+opts.id+"'>");
			$this.append("<input type='hidden' class='_bochum_popup_txts' id='"+opts.textField+"' name='"+opts.textField+"'>");
			var $inputG = $('<div class="input-group"></div>').appendTo($this);
			$inputG.append('<div class="_bochum_popup_value"></div>');
			$('<a href="javascript:void(0);" class="input-group-addon" ><i class="fa fa-search"></i></a>').appendTo($inputG)
			.on("click", {itemObj:$this}, function (event) {
				var $this = event.data.itemObj;
				var opts = $this.data("options");
				var id = opts.id;
				var vals = $this.find("._bochum_popup_ids").val();
				$('#_' + id + 'Dialog').modal({
					backdrop: 'static',
					keyboard: false,
					remote: opts.url + "?popupId=" + id + "&popupValue=" + vals + "&" + opts.param
				}).on("hidden.bs.modal", function() {
				});
			});
		},
		setParam : function (param) {
			var $this = $(this);
			var opts = $this.data("options");
			if (typeof(param) == "string") {
				opts.param = param;
			} else {
				alert("参数错误");
			}
		},
		ok : function(datas) {
			var $this = $(this);
			var opts = $this.data("options");
			
			methods._showValue($this, datas);
			
			$('#_' + opts.id + 'Dialog').modal("hide");
		},
		cancel : function () {
			var $this = $(this);
			var opts = $this.data("options");
			$('#_' + opts.id + 'Dialog').modal("hide");
		},
		destroy : function () {
			var $this = $(this);
			$this.data("_dialog").remove();
		},
		getValue : function () {
			var $this = $(this);
			var datas = [];
			$this.find("._bochum_popup_item").each(function (idx, item) {
				datas.push(item.attr("dataIds"));
			});
			return datas;
		},
		setValue : function (values) {
			var $this = $(this);
			var opts = $this.data("options");
//			if (opts.dataUrl1) {//自动获取显示名称,暂定
//				var key = "in_"+opts.id;
//				bochum.ajax(opts.dataUrl, {key:values}, function (data){
//					methods._showValue($this, data.datasOut);
//				});
//			} else {
				var datas = [];
				if (values != undefined) { 
					var idstr = values[opts.id];
					var txtstr = values[opts.textField];
					if (idstr != undefined && txtstr != undefined && idstr != "" && txtstr != "") {
						var ids = idstr.split(",");
						var txts = txtstr.split(",");
						if (ids.length == txts.length) {
							for (i=0; i<ids.length; i++) {
								datas.push({id:ids[i], name:txts[i]});
							}
						}
					}
				}
				methods._showValue($this, datas);
//			}
		},
		_onChange : function () {
			
		},
		_showValue : function($this, datas, isAdd) {
			var valueIds = [];
			var $values = $this.find("._bochum_popup_value");
			if (!isAdd) {
				$values.empty();
			}
			$.each(datas, function(idx, data) {
				valueIds.push(data.id);
				var $item = $("<span class='_bochum_popup_item' dataIds='"+data.id+"' dataTxts='"+data.name+"'>"+data.name+"</span>").appendTo($values);
				$("<i class='fa fa-times'></i>").appendTo($item)
				.on("click", function() {
					$popup = $(this).parents("._bochum_popup");
					$(this).parents("._bochum_popup_item").remove();
					methods._refreshHideValue($popup);
				});
			});
			methods._refreshHideValue($this);
		},
		_refreshHideValue : function ($this) {
			var dataIds = [];
			var dataTxts = [];
			$this.find("._bochum_popup_item").each(function () {
				dataIds.push($(this).attr("dataIds"));
				dataTxts.push($(this).attr("dataTxts"));
			});
			$this.find("._bochum_popup_ids").val(dataIds.join(","));
			$this.find("._bochum_popup_txts").val(dataTxts.join(","));
		},
		_create : function($this) {
			var opts = $this.data("options");
			var param = $this.data("param");
			var param = $.extend({}, param);

			methods._createDialog($this);
			methods._createInputs($this);
		}
    }

    // 插件申明,写法固定
    $.fn.bochumPopup = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods._init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.bochumPopup');
        }
    };
})(jQuery);
