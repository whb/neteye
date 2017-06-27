
(function($) {

	/*常量*/
	var CONSTANT = {
        DATA_TABLES : {
            DEFAULT_OPTION : { //DataTables初始化选项
				dom: "t<'dt-toolbar-footer'<'col-sm-12 col-lg-3 hidden-xs'l><'col-xs-12 col-sm-12 col-lg-9'pi>>",
				pageLength : 10,
                language: {
                    "sProcessing":   "处理中...",
                    "sLengthMenu":   "每页 _MENU_ 项",
                    "sZeroRecords":  "没有匹配结果",
                    "sInfo":         "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
                    "sInfoEmpty":    "当前显示第 0 至 0 项，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix":  "",
                    "sSearch":       "搜索:",
                    "sUrl":          "",
                    "sEmptyTable":     "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands":  ",",
                    "oPaginate": {
                        "sFirst":    "首页",
                        "sPrevious": "上页",
                        "sNext":     "下页",
                        "sLast":     "末页",
                        "sJump":     "跳转"
                    },
                    "oAria": {
                        "sSortAscending":  ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                },
                autoWidth: false,   //禁用自动调整列宽
                stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
                order: [],          //取消默认排序查询,否则复选框一列会出现小箭头
                processing: false,  //隐藏加载提示,自行处理
                serverSide: true,   //启用服务器端分页
                searching: false    //禁用原生搜索
            }
        }
	};

    // 参数选项设置
    var defaults = {
    	showSelect : true,
    	showLineNo : false,
    	isSelectMore : true,
    	columns : [],
    };

    // 方法集合
    var methods = {
		init: function (options) {
			return this.each(function () {
				var $this = $(this);
				var id = $this.attr("id");
				var opts = $.extend({}, defaults, options || {}, options);

				$table = $('<table id="_'+id+'Table" class="table table-striped table-bordered table-hover _input_item" style="border: 0px; margin: 0px !important;" width="100%"></table>').appendTo($this);
				$thead = $('<tr></tr>').appendTo($('<thead></thead>').appendTo($table));

				opts.dataTableColumns = [];

				if (opts.showSelect) {
					if (opts.isSelectMore) {
						$thead.append('<th><input type="checkbox" name="_checkAll" class="_bochum_check _bochum_check_all"></th>');
						opts.dataTableColumns.push({ className : "td-center", "orderable" : false, "width" : "10px", "data" : null, "render" : function (data, type, row, meta) {return '<input type="checkbox" class="iCheck _bochum_check _bochum_check_row" value="'+meta.row+'">'; }});//添加复选框列
					} else {
						$thead.append('<th>&nbsp;</th>');
						opts.dataTableColumns.push({ className : "td-center", "orderable" : false, "width" : "10px", "data" : null, "render" : function (data, type, row, meta) {return '<input type="radio" name="'+id+'Radio" class="iCheck _bochum_check _bochum_check_row"  value="'+meta.row+'">'; }});//添加复选框列
					}
				}
				if (opts.showLineNo) {
					$thead.append("<th>No.</th>");
					opts.dataTableColumns.push({ className : "td-center", "orderable" : false, "width" : "10px", "data" : null, "render" : function (data, type, row, meta) { return meta.row + 1 + meta.settings._iDisplayStart; }});//添加索引序号列
				}

				$.each(opts.columns, function (idx, col) {
					$thead.append("<th>"+col.name+"</th>");
					var colInfo = {data:col.id, width:col.width, orderable:col.orderable};
					if (col.render != undefined) {
						colInfo.render = col.render;
					}
					opts.dataTableColumns.push(colInfo);
				});

//				var responsiveHelper = undefined;

				// 初始化表格
				var $dataTable = $table.DataTable(
					$.extend({}, CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
						ajax : function(data, callback, settings) {//ajax配置为function,手动调用异步查询
							methods._reload($(this), data, callback, settings);
						},
						columns : opts.dataTableColumns,
						preDrawCallback : function() {
							// Initialize the responsive datatables helper once.
//							if (!responsiveHelper) {
//								responsiveHelper = new ResponsiveDatatablesHelper($this, breakpointDefinition);
//							}
						},
						rowCallback : function(nRow) {
//							responsiveHelper.createExpandIcon(nRow);
						},
						drawCallback : function(oSettings) {
//							responsiveHelper.respond();
							$("[rel=tooltip]").tooltip();
//							$("#${pi.page.id}CheckAll").prop('checked', false);//表格刷新取消全选
						}
					}
				));

				$this.data("_options", opts);
				$this.data("_table", $table);
				$this.data("_dataTable", $dataTable);
				$this.data("_selectDatas", []);

				$dataTable.on("change", "._bochum_check", function() {
					var $this = $(this);
					var id = $this.attr("id");
					var opts = $this.data("_options");

			        if ($(this).attr("name") == '_checkAll') {//全选
			        	$this.find("._bochum_check_row").prop("checked",$(this).prop("checked"));
			        }else{ //一般复选
			            var checkbox = $this.find("._bochum_check_row");
			            $this.find("._bochum_check_all").prop('checked', checkbox.filter(':checked').length == checkbox.length);
			            // 添加选中
			        }

//					methods._setSelected($this);
		    	})
			});
		},
		_setSelected : function ($this, idx) {// 只保存当页数据
			var opts = $this.data("_options");
			var $dataTable = $this.data("_dataTable");
			var selectDatas = [];

			if (opts.isSelectMore) {
				$dataTable.rows().each(function (idx, row){
					selectDatas.push(row.data());
				});
			} else {
				var row = $dataTable.row(idx);
				selectDatas.push(row.data())
			}
			$this.data("_selectDatas", selectDatas);
		},
		reload : function (query) {
			var $table = $(this).data("_table");
			var $dataTable = $(this).data("_dataTable");
			$table.data("query", query);
			$dataTable.ajax.reload();
		},
		getSelected : function () {
			var $this = $(this);
			var opts = $this.data("_options");
			var $dataTable = $this.data("_dataTable");
			var selectDatas = [];

			$this.find("._bochum_check_row:checked").each(function (idx, check) {
				idx = $(this).val();
				var rowData = $dataTable.row(idx).data();
				selectDatas.push(rowData);
			});
			return selectDatas;
		},
		_reload : function($this, data, callback, settings) {
			var query = $this.data("query");
			if (query == undefined) return [];
	        //手动控制遮罩
//	        $wrapper.spinModal();
	        //封装请求参数
	        var param = query.param;
//	        var param = userManage.getQueryCondition(data);
			//获取表格参数
			param = $.extend({}, param, {start:data.start, draw:data.draw, length:data.length});
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
//					$wrapper.spinModal(false);
				//调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
				callback(returnData);
			}, function(XMLHttpRequest, textStatus, errorThrown) {
				
			});
		}
    }

    // 插件申明,写法固定
    $.fn.bochumTable = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.bochumTable');
        }
    };
})(jQuery);
