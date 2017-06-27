jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",   
    remote: "请修正该字段",   
    email: "请输入正确格式的电子邮件",   
    url: "请输入合法的网址",  
    date: "请输入合法的日期",   
    dateISO: "请输入合法的日期 (ISO).",  
    number: "请输入合法的数字",   
    digits: "只能输入整数",   
    creditcard: "请输入合法的信用卡号",   
    equalTo: "请再次输入相同的值",   
    accept: "请输入拥有合法后缀名的字符串",   
    range:"请输入一个介于 {0} 和 {1} 之间的值"
//    maxlength: jQuery.format("请输入一个长度最多是 {0} 的字符串"),   
//    minlength: jQuery.format("请输入一个长度最少是 {0} 的字符串"),   
//    rangelength: jQuery.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),   
//    range: jQuery.format("请输入一个介于 {0} 和 {1} 之间的值"),   
//    max: jQuery.format("请输入一个最大为 {0} 的值"),  
//    min: jQuery.format("请输入一个最小为 {0} 的值")
});

var bochum = {
	backPage : function () {
		history.back(-1);
	},
	nvlstr : function (val) {
		if (val == null || val == undefined) return "";
		return val;
	},
	inputValidateMessage : "",
	showMessage : function (dataInfo) {
		if (dataInfo.errorMessage != undefined && dataInfo.errorMessage != "") {
			bochum.showErrorMessage(dataInfo.errorMessage);
			return "error";
		} else if (dataInfo.warnMessage != undefined && dataInfo.warnMessage != "") {
			bochum.showWarnMessage(dataInfo.warnMessage);
			return "warn";
		} else if (dataInfo.otherMessage != undefined && dataInfo.otherMessage != "") {
			bochum.showOtherMessage(dataInfo.otherMessage);
			return "other";
		} else if (dataInfo.successMessage != undefined && dataInfo.successMessage != "") {
			bochum.showSuccessMessage(dataInfo.successMessage);
			return "success";
		}
		return "success";
	},
	showErrorMessage : function(msg) {
		if (msg == undefined || msg == "") return;
		$.smallBox({
			title : "错误信息",
			content : msg,
			color : "#C46A69",
			//timeout: 6000,
			icon : "fa fa-times shake animated",
			timeout : 6000
		});
	},
	showWarnMessage : function(msg) {
		if (msg == undefined || msg == "") return;
		$.smallBox({
			title : "警告信息",
			content : msg,
			color : "#C79121",
			//timeout: 6000,
			icon : "fa fa-warning shake animated",
			timeout : 6000
		});
	},
	showSuccessMessage : function(msg) {
		if (msg == undefined || msg == "") return;
		$.smallBox({
			title : "成功信息",
			content : msg,
			color : "#739E73",
			//timeout: 6000,
			icon : "fa fa-check",
			timeout : 6000
		});
	},
	showOtherMessage : function(msg) {
		if (msg == undefined || msg == "") return;
		$.smallBox({
			title : "信息",
			content : msg,
			color : "#3276B1",
			//timeout: 6000,
			icon : "fa fa-envelope-o shake animated",
			timeout : 6000
		});
	},
	confirm : function (msg, fyes, fno) {
		if (msg == undefined || msg == "") return;
		$.SmartMessageBox({
			title : "操作确认",
			content : msg,
			buttons : '[No][Yes]'
		}, function(ButtonPressed) {
			if (ButtonPressed === "Yes") {
				if (typeof fyes == 'function') {
					fyes();
				}
			} else {
				if (typeof fno == 'function') {
					fno();
				}
			}
		});
	},
	mask : function (msg) {
		$.SmartMessageBox({
			title : msg,
			buttons : ''
		});
	},
	scrollToId : function (id) {//滚动到指定ID的元素位置
		$("html,body").stop(true);$("html,body").animate({scrollTop: $("#" + id).offset().top}, 1000);
	},
	closeMask : function (callback) {
		SmartMSGboxCount = 0;
	    $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(0).queue(function () {
	        ExistMsg = 0;
	        $(this).remove();

			if (typeof callback == 'function') {
				callback();
			}
	    });
	},
	validateGroup : function(formId, userCheck) {
		$("#" + formId).validate({
			onsubmit : true,// 是否在提交是验证
			onfocusout : true,// 是否在获取焦点时验证
			onkeyup : true,// 是否在敲击键盘时验证
			userCheck : userCheck,
			highlight : function(element) {
				$(element).closest('.form-group').addClass('has-error');
			},
			unhighlight : function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			},
			errorPlacement : function(error, element) {
//				bochum.inputValidateMessage += "<br>" + error.html();
			},
			showErrors : function(errorMap, errorList) {
				var msgs = "";
				for (idx in errorList) {
					msgs += "<br>" + $(errorList[idx].element).attr("labelName") + ":" + errorList[idx].message;
				}
				bochum.showErrorMessage(msgs);
//				$("#summary").html("Your form contains " + this.numberOfInvalids() + " errors,see details below.");
				this.defaultShowErrors();
			}
		});
	},
	validateError : function(validator, element, msg) {
		validator.errorList.push( {
			message: msg,
			element: element,
			method: ""
		} );
	},
	validate : function (formId) {
		  $("#"+formId).validate({
			  onsubmit:true,// 是否在提交是验证
			  onfocusout:true,// 是否在获取焦点时验证
			  onkeyup :true,// 是否在敲击键盘时验证
				highlight: function(element) {
				    $(element).closest('label').addClass('state-error');
				},
			    unhighlight: function(element) {
			    	$(element).closest('label').removeClass('state-error');
			    },
			  messages:{
			   typeName:{
			        required:'不能为空',
			        byteRangeLength:'不能大于8个字节'
			       }
			  }
		  });
	},
	ajax : function(url, param, success, fail) {
		$.ajax({
			url : url,
			type : 'POST',
			cache : false,
			data : (typeof param=="string"?param:bochum.json2String(param)),
			dataType : 'json',
			success : function(data) {
				if (typeof success == 'function') {
					success(data);
				} else {
					bochum.showMessage(data);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof fail == 'function') {
					fail(errorThrown);
				} else {
					bochum.showMessage(errorThrown);
				}
			}
		});
	},
	deleteData : function (url, param, success, fail) {
		$.SmartMessageBox({
			title : "删除警告!",
			content : "删除的数据将无法恢复!您确认要继续吗?",
			buttons : '[No][Yes]'
		}, function(ButtonPressed) {
			if (ButtonPressed === "Yes") {
				bochum.mask("删除数据中,请稍等...");
				$.ajax({
				    url : url,
					type : 'POST',
					cache : false,
					data : bochum.json2String(param),
					dataType : 'json',
					success : function(data) {
						bochum.closeMask();
						if ("success" == bochum.showMessage(data)) {
							if (typeof(success) == "function") {
								success(data);
							}
						}
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						bochum.closeMask();
						bochum.showMessage(errorThrown);
						if (typeof(fail) == "function") {
							fail(data);
						}
					}
				});
			}
		});
	},
	loadData : function (url, param, success, fail) {
		bochum.mask("数据读取中,请稍等...");
		$.ajax({
		    url : url,
			type : 'POST',
			cache : false,
			data : bochum.json2String(param),
			dataType : 'json',
			success : function(data) {
				bochum.closeMask();
				if ("success" == bochum.showMessage(data)) {
					if (typeof(success) == "function") {
						success(data);
					}
				}
			},
			error : function (XMLHttpRequest, textStatus, errorThrown) {
				bochum.closeMask();
				bochum.showMessage(errorThrown);
				if (typeof(fail) == "function") {
					fail(XMLHttpRequest, textStatus, errorThrown);
				}
			}
		});
	},
	saveData : function (url, param, success, fail) {
		bochum.mask("数据保存中,请稍等...");
		$.ajax({
		    url : url,
			type : 'POST',
			cache : false,
			data : bochum.json2String(param),
			dataType : 'json',
			success : function(data) {
				bochum.closeMask();
				if ("success" == bochum.showMessage(data)) {
					if (typeof(success) == "function") {
						success(data);
					}
				}
			},
			error : function (XMLHttpRequest, textStatus, errorThrown) {
				bochum.closeMask();
				bochum.showMessage(errorThrown);
				if (typeof(fail) == "function") {
					fail(data);
				}
			}
		});
	},
	json2String : function (jsonObj, names) {
		var obj = {};
		if (names == undefined) {
			obj = jsonObj;
		} else {
			for (i in names) {
				obj[names[i]] = jsonObj[names[i]];
			}
		}
		return $.base64.btoa(encodeURIComponent(JSON.stringify(obj)));
//		return $.base64.btoa((JSON.stringify(obj)));
	} ,
	form2json : function (form, convert) {
		if (typeof(form) == "string") {
			form = $("#" + form);
		}
		var serializeObj={};
        $(form.serializeArray()).each(function(){
        	if (serializeObj[this.name] != undefined) {
        		serializeObj[this.name]=serializeObj[this.name]+","+this.value;
        	} else {
                serializeObj[this.name]=this.value;  
        	}
        });
        
        var ckEditors = form.find(".bochum-ckeditor");
        $.each(ckEditors, function (idx, cke) {
        	var name = $(cke).attr("name");
        	serializeObj[name] = CKEDITOR.instances[name].getData();
        });

        serializeObj = bochum.paramConvert(serializeObj, convert);

        return serializeObj;
	},
	paramConvert : function (param, convert) {
        if (convert != undefined) {
        	$.each(convert, function(key, convKey) {
        		param[convKey] = param[key];
        	});
        }
        return param;
	},
	clearForm : function (form) {
		if (typeof(form) == "string") {
			form = $("#" + form);
		}
		$.each(form.find("._input_item"), function(idx, obj) {
			bochum.setValue($(obj), "");
		});
	},
	json2area : function (json, area) {
		if (typeof json == "string") {
			json = JSON.parse(json);
		};
		if (typeof area == "string") {
			area = $("#" + area);
		};
		$.each(json, function(name, value) {
			var $obj = area.find("[name='"+name+"']");
			bochum.setValue($obj, value, json);
		});
	},
	setValue : function (inputObject, value, json) {
		if (inputObject.is("label")) {
			inputObject.html(value);
		} else if (inputObject.hasClass("progress-bar")) {
			inputObject.attr("data-transitiongoal", value);
		} else if (inputObject.hasClass("easy-pie-chart")) {
			inputObject.attr("data-percent", value);
		} else if (inputObject.hasClass("_bochum_popup")) {
			inputObject.bochumPopup("setValue", json);
		} else if (inputObject.hasClass("_bochum_combobox")) {
			inputObject.bochumSelect("setValue", value);
		} else if (inputObject.hasClass("_bochum-ckeditor")) {
			CKEDITOR.instances[inputObject.attr("name")].setData(value);
		} else if (inputObject.is('input')) {
			if (bochum.inArray(inputObject.attr('type').toLowerCase(), ["text", "textarea", "hidden"])) {
				inputObject.val(value);
			}
		}
	},
	refreshTable : function(tableId, data) {
		var table = $("#"+tableId).DataTable();
		oSettings = table.settings();
		table.clear(this);
		for (var j = 0; j < data.datasOut.length; j++) {
			table.row.add(data.datasOut[j]);
		}
		table.draw();
	},
	inArray : function (val, arr) {
		for (v in arr) {
			if (typeof(val) == "string") {
				if (arr[v].toLowerCase() == val.toLowerCase()) return true;
			} else {
				if (arr[v] == val) return true;
			}
		}
		return false;
	},
	str2bool : function(val) {
		if (val == "true") {
			return true;
		} else if (val == "false") {
			return false;
		}
		return val;
	},
	refreshPagination : function (paginationId, totalPage, currPage, callback) {
		var pagination = $("#"+paginationId);
		pagination.html("");
		var st = Math.floor((currPage-1)/10)*10+1;
		var ed = Math.min(totalPage, Math.floor((currPage-1)/10)*10+10);
		var page = $("<ul class='pagination pagination'></ul>").appendTo(pagination);
		if (currPage<=1) {
			$("<li class='disabled'><a href='javascript:void(0);'><i class='fa fa-chevron-left'></i></a></li>").appendTo(page);
		} else {
			$("<li ><a href='javascript:void(0);'><i class='fa fa-chevron-left'></i></a></li>").appendTo(page).one("click", (currPage-1), function(event) {callback(event.data)});
		}
		for (i=st; i<=ed; i++) {
			$("<li"+(i==currPage?" class='active'":"")+"><a href='javascript:void(0);'>"+i+"</a></li>").appendTo(page).one("click", i, function(event) {callback(event.data)});
		}
		if (currPage>=totalPage) {
			$("<li class='disabled'><a href='javascript:void(0);'><i class='fa fa-chevron-right'></i></a></li>").appendTo(page);
		} else {
			$("<li ><a href='javascript:void(0);'><i class='fa fa-chevron-right'></i></a></li>").appendTo(page).one("click", (currPage+1), function(event) {callback(event.data)});
		}
	},
	
	initWidgets : function () {
		$('.widget-grid').jarvisWidgets({
			grid : 'article',
			widgets : '.jarviswidget',
			localStorage : localStorageJarvisWidgets,
			deleteSettingsKey : '#deletesettingskey-options',
			settingsKeyLabel : 'Reset settings?',
			deletePositionKey : '#deletepositionkey-options',
			positionKeyLabel : 'Reset position?',
			sortable : sortableJarvisWidgets,
			buttonsHidden : false,
			// toggle button
			toggleButton : true,
			toggleClass : 'fa fa-minus | fa fa-plus',
			toggleSpeed : 200,
			onToggle : function() {
			},
			// delete btn
			deleteButton : true,
			deleteMsg:'Warning: This action cannot be undone!',
			deleteClass : 'fa fa-times',
			deleteSpeed : 200,
			onDelete : function() {
			},
			// edit btn
			editButton : true,
			editPlaceholder : '.jarviswidget-editbox',
			editClass : 'fa fa-cog | fa fa-save',
			editSpeed : 200,
			onEdit : function() {
			},
			// color button
			colorButton : true,
			// full screen
			fullscreenButton : true,
			fullscreenClass : 'fa fa-expand | fa fa-compress',
			fullscreenDiff : 3,
			onFullscreen : function() {
			},
			// custom btn
			customButton : false,
			customClass : 'folder-10 | next-10',
			customStart : function() {
				alert('Hello you, this is a custom button...');
			},
			customEnd : function() {
				alert('bye, till next time...');
			},
			// order
			buttonOrder : '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
			opacity : 1.0,
			dragHandle : '> header',
			placeholderClass : 'jarviswidget-placeholder',
			indicator : true,
			indicatorTime : 600,
			ajax : true,
			timestampPlaceholder : '.jarviswidget-timestamp',
			timestampFormat : 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
			refreshButton : true,
			refreshButtonClass : 'fa fa-refresh',
			labelError : 'Sorry but there was a error:',
			labelUpdated : 'Last Update:',
			labelRefresh : 'Refresh',
			labelDelete : 'Delete widget:',
			afterLoad : function() {
			},
			rtl : false, // best not to toggle this!
			onChange : function() {
				
			},
			onSave : function() {
				
			},
			ajaxnav : $.navAsAjax // declears how the localstorage should be saved (HTML or AJAX Version)

		});
	},
	download : function (url, param) {
		var form = $("#downloadForm");
		if (form.length == 0) {
			form = $("<form id='downloadForm' target='downloadFrame' style='display:none;'></form>").appendTo($("body"));
		}
		var iframe = $("#downloadFrame");
		if (iframe.length == 0) {
			iframe = $("<iframe id='downloadFrame' name='downloadFrame' style='display:none;'></iframe>").appendTo($("body"));
		}
		form.attr("action", url);
		form.empty();
		$.each(param,function(name,value) {
			form.append($("<input type='hidden' name='"+name+"' value='"+value+"'>"));
		});
		form.submit();
	},
	initSelect : function (selectId, url) {
		bochum.ajax(url, {}, function (data) {
			for (idx in data.datasOut) {
				var d = data.datasOut[idx];
				$("#"+selectId).append("<option value='"+d.name+"'>"+d.name+"</option>");
			}
		}, function(data) {
			
		});
	},
	// 数组通过指定父key转换为树结构
	list2tree : function (lst, options) {
		var defOption = {id:"id", pid:"parentId", name:"name", orderNum:"orderNum"};//默认设置
		opt = $.extend(defOption, options);//合并设置,用户设置覆盖默认设置
		var tree = [];
		var idObjs = {};
		// 做成id对应数据的map
		$.each(lst, function (idx, value) {
			value._id = value[opt.id];
			value._pId = value[opt.pid];
			value._name = value[opt.name];
			value._orderNum = value[opt.orderNum];

			idObjs[value._id] = value;
		});
		// 做成树结构
		$.each(lst, function (idx, value){
			if (value._pId != undefined && value._pId != null && value._pId != "") {//如果包含父id则将该对象加入父对象子集中
				var _parentObj = idObjs[value._pId];//获取父对象
				if (_parentObj != undefined) {//判断父对象存在
					if (_parentObj._children == undefined) {//判断父对象子集不存在
						_parentObj._children = [];//创建父对象子集
					}
					_parentObj._children.push(value);//加入对象到父对象子集
				} else {//父对象不存在,加入根节点
//					tree.push(value);
				}
			} else {//父id为空则加入根节点
				tree.push(value);
			}
		});
		return tree;
	}
}